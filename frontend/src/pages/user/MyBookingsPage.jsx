import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { client.get("/bookings/my").then((res) => setBookings(res.data.bookings)); }, []);
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-3">My Bookings</h2>
      <div className="space-y-2">
        {bookings.map((b) => (
          <div className="bg-slate-800 p-3 rounded-xl flex justify-between" key={b.id}>
            <div>{b.pnr_number} | {b.booking_status} | {b.journey_date}</div>
            <Link className="btn-primary" to={`/cancel/${b.id}`}>Cancel</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
