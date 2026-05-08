import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function SeatAvailabilityPage() {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  useEffect(() => {
    client.get(`/bookings/seats/${id}`).then((res) => setSeats(res.data.seats));
  }, [id]);
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-3">Seat Availability</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {seats.map((s) => (
          <div key={s.class_type} className="bg-slate-800 rounded-xl p-3">
            <p>{s.class_type}</p>
            <p>Available: {s.available_seats}</p>
            <p>Waiting: {s.waiting_list_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
