import pool from "../config/db.js";
import { allocateSeats } from "../services/seatService.js";
import { generatePNR } from "../utils/pnr.js";
import { emitEvent } from "../utils/socket.js";

export async function seatAvailability(req, res) {
  const [seats] = await pool.query("SELECT * FROM seat_availability WHERE train_id=?", [req.params.trainId]);
  res.json({ seats });
}

export async function createBooking(req, res) {
  const { trainId, classType, journeyDate, seatsBooked, passengerName } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [seatRows] = await conn.query("SELECT * FROM seat_availability WHERE train_id=? AND class_type=? FOR UPDATE", [trainId, classType]);
    if (!seatRows.length) throw new Error("No seat class found");
    const allocation = allocateSeats(seatRows[0], Number(seatsBooked));
    await conn.query("UPDATE seat_availability SET available_seats=?, waiting_list_count=? WHERE id=?", [
      allocation.updatedAvailable, allocation.waitingList, seatRows[0].id
    ]);
    const pnr = generatePNR();
    const [result] = await conn.query(
      "INSERT INTO bookings (user_id,train_id,pnr_number,journey_date,class_type,seats_booked,booking_status,fare_amount) VALUES (?,?,?,?,?,?,?,?)",
      [req.user.id, trainId, pnr, journeyDate, classType, seatsBooked, allocation.status, Number(seatsBooked) * 450]
    );
    await conn.query("INSERT INTO passengers (booking_id,name,age,gender,seat_number) VALUES (?,?,?,?,?)", [result.insertId, passengerName, 25, "NA", allocation.status === "CONFIRMED" ? "S1-01" : null]);
    await conn.commit();
    emitEvent("booking:created", { bookingId: result.insertId, pnr, trainId, classType, seatsBooked });
    res.status(201).json({ booking: { id: result.insertId, pnr_number: pnr, booking_status: allocation.status } });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ message: e.message });
  } finally {
    conn.release();
  }
}

export async function makePayment(req, res) {
  const { bookingId } = req.params;
  const { method } = req.body;
  const [[booking]] = await pool.query("SELECT * FROM bookings WHERE id=?", [bookingId]);
  await pool.query("INSERT INTO payments (booking_id,amount,payment_method,payment_status,transaction_id) VALUES (?,?,?,?,?)", [
    bookingId, booking.fare_amount, method, "SUCCESS", `TXN${Date.now()}`
  ]);
  await pool.query("UPDATE bookings SET payment_status='PAID' WHERE id=?", [bookingId]);
  emitEvent("payment:success", { bookingId, transactionTime: Date.now() });
  res.json({ message: "Payment successful", booking });
}

export async function myBookings(req, res) {
  const [bookings] = await pool.query("SELECT * FROM bookings WHERE user_id=? ORDER BY created_at DESC", [req.user.id]);
  res.json({ bookings });
}

export async function cancelBooking(req, res) {
  const { bookingId } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[booking]] = await conn.query("SELECT * FROM bookings WHERE id=? FOR UPDATE", [bookingId]);
    if (!booking || booking.user_id !== req.user.id) return res.status(404).json({ message: "Booking not found" });
    if (booking.booking_status === "CANCELLED") return res.status(400).json({ message: "Already cancelled" });

    const [[seatRow]] = await conn.query(
      "SELECT * FROM seat_availability WHERE train_id=? AND class_type=? FOR UPDATE",
      [booking.train_id, booking.class_type]
    );

    const waitingBefore = Number(seatRow.waiting_list_count);
    const cancelledSeats = Number(booking.seats_booked);
    const promoted = Math.min(waitingBefore, cancelledSeats);
    const newlyFreed = cancelledSeats - promoted;

    const refund = Number(booking.fare_amount) * 0.7;
    await conn.query("UPDATE bookings SET booking_status='CANCELLED' WHERE id=?", [bookingId]);
    await conn.query(
      "INSERT INTO cancellations (booking_id,refund_amount,reason,cancelled_by) VALUES (?,?,?,?)",
      [bookingId, refund, "User cancelled", req.user.id]
    );
    await conn.query(
      "UPDATE seat_availability SET available_seats=available_seats+?, waiting_list_count=? WHERE id=?",
      [newlyFreed, waitingBefore - promoted, seatRow.id]
    );

    if (promoted > 0) {
      await conn.query(
        "UPDATE bookings SET booking_status='CONFIRMED' WHERE train_id=? AND class_type=? AND booking_status='WAITLIST' ORDER BY created_at ASC LIMIT ?",
        [booking.train_id, booking.class_type, promoted]
      );
    }

    await conn.commit();
    emitEvent("booking:cancelled", { bookingId, refund, promoted });
    res.json({ message: "Ticket cancelled", refund, promotedFromWaitlist: promoted });
  } catch (error) {
    await conn.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    conn.release();
  }
}
