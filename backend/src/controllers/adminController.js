import pool from "../config/db.js";
import { assignBestPlatform } from "../services/platformService.js";
import { emitEvent } from "../utils/socket.js";

export async function addTrain(req, res) {
  const { trainNumber, trainName, sourceStation, destinationStation, departureTime, arrivalTime } = req.body;
  await pool.query(
    "INSERT INTO trains (train_number,train_name,source_station,destination_station,departure_time,arrival_time,total_seats,status) VALUES (?,?,?,?,?,?,?,?)",
    [trainNumber, trainName, sourceStation, destinationStation, departureTime, arrivalTime, 500, "ACTIVE"]
  );
  res.status(201).json({ message: "Train added" });
}

export async function allTrains(req, res) {
  const [trains] = await pool.query("SELECT * FROM trains ORDER BY id DESC");
  res.json({ trains });
}

export async function updateTrain(req, res) {
  const { trainName, sourceStation, destinationStation, departureTime, arrivalTime, status } = req.body;
  await pool.query(
    "UPDATE trains SET train_name=?,source_station=?,destination_station=?,departure_time=?,arrival_time=?,status=? WHERE id=?",
    [trainName, sourceStation, destinationStation, departureTime, arrivalTime, status, req.params.id]
  );
  res.json({ message: "Train updated" });
}

export async function deleteTrain(req, res) {
  await pool.query("DELETE FROM trains WHERE id=?", [req.params.id]);
  res.json({ message: "Train deleted" });
}

export async function allUsers(req, res) {
  const [users] = await pool.query("SELECT id,name,email,phone,created_at FROM users ORDER BY id DESC");
  res.json({ users });
}

export async function autoAssignPlatform(req, res) {
  const { trainId, arrivalTime, departureTime } = req.body;
  const [platforms] = await pool.query("SELECT * FROM platforms");
  const best = assignBestPlatform(platforms, { arrival_time: arrivalTime, departure_time: departureTime });
  await pool.query(
    "INSERT INTO platform_assignments (train_id,platform_id,arrival_time,departure_time,status,assigned_by) VALUES (?,?,?,?,?,?)",
    [trainId, best.id, arrivalTime, departureTime, "AUTO", req.user.id]
  );
  await pool.query("UPDATE platforms SET current_train_id=?,available_from=?,status='ASSIGNED' WHERE id=?", [trainId, departureTime, best.id]);
  emitEvent("platform:assigned", { trainId, platformId: best.id, type: "AUTO" });
  res.json({ message: "Platform assigned", platform: best });
}

export async function manualOverridePlatform(req, res) {
  const { assignmentId, newPlatformId, arrivalTime, departureTime } = req.body;
  const [[assignment]] = await pool.query("SELECT * FROM platform_assignments WHERE id=?", [assignmentId]);
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  await pool.query(
    "UPDATE platform_assignments SET platform_id=?,arrival_time=?,departure_time=?,status='MANUAL',assigned_by=? WHERE id=?",
    [newPlatformId, arrivalTime || assignment.arrival_time, departureTime || assignment.departure_time, req.user.id, assignmentId]
  );
  await pool.query("UPDATE platforms SET current_train_id=?,available_from=?,status='ASSIGNED' WHERE id=?", [assignment.train_id, departureTime || assignment.departure_time, newPlatformId]);
  emitEvent("platform:assigned", { trainId: assignment.train_id, platformId: newPlatformId, type: "MANUAL" });
  res.json({ message: "Platform override applied" });
}

export async function assignmentHistory(req, res) {
  const [rows] = await pool.query(
    "SELECT pa.*, t.train_number, p.platform_number FROM platform_assignments pa JOIN trains t ON pa.train_id=t.id JOIN platforms p ON pa.platform_id=p.id ORDER BY pa.assigned_at DESC LIMIT 100"
  );
  res.json({ assignments: rows });
}

export async function reportsSummary(req, res) {
  const [[bookings]] = await pool.query("SELECT COUNT(*) totalBookings, COALESCE(SUM(fare_amount),0) totalRevenue FROM bookings");
  const [[users]] = await pool.query("SELECT COUNT(*) totalUsers FROM users");
  const [[trains]] = await pool.query("SELECT COUNT(*) totalTrains FROM trains");
  const [[cancelled]] = await pool.query("SELECT COUNT(*) totalCancellations FROM bookings WHERE booking_status='CANCELLED'");
  res.json({ summary: { ...bookings, ...users, ...trains, ...cancelled } });
}

export async function createSchedule(req, res) {
  const { trainId, runDate, expectedArrival, expectedDeparture, delayMinutes = 0 } = req.body;
  const arrival = String(expectedArrival).replace("T", " ");
  const departure = String(expectedDeparture).replace("T", " ");
  await pool.query(
    "INSERT INTO train_schedule (train_id,run_date,expected_arrival,expected_departure,delay_minutes) VALUES (?,?,?,?,?)",
    [trainId, runDate, arrival, departure, delayMinutes]
  );
  res.status(201).json({ message: "Schedule created" });
}

export async function listSchedules(req, res) {
  const [rows] = await pool.query(
    "SELECT ts.*, t.train_number, t.train_name FROM train_schedule ts JOIN trains t ON ts.train_id=t.id ORDER BY ts.run_date DESC, ts.id DESC"
  );
  res.json({ schedules: rows });
}

export async function exportCsvReport(req, res) {
  const [rows] = await pool.query(
    "SELECT b.id,b.pnr_number,u.name user_name,t.train_number,b.journey_date,b.class_type,b.seats_booked,b.booking_status,b.fare_amount,b.created_at FROM bookings b JOIN users u ON b.user_id=u.id JOIN trains t ON b.train_id=t.id ORDER BY b.created_at DESC"
  );
  const header = "booking_id,pnr,user,train,journey_date,class,seats,status,fare,created_at";
  const lines = rows.map((r) =>
    [r.id, r.pnr_number, r.user_name, r.train_number, r.journey_date, r.class_type, r.seats_booked, r.booking_status, r.fare_amount, new Date(r.created_at).toISOString()].join(",")
  );
  const csv = [header, ...lines].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=booking-report.csv");
  return res.send(csv);
}
