import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../api/client";

export default function TicketBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ classType: "SL", journeyDate: "", seatsBooked: 1, passengerName: "" });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post("/bookings", { trainId: id, ...form });
    navigate(`/payment/${data.booking.id}`);
  };

  return (
    <form onSubmit={submit} className="card max-w-lg mx-auto space-y-3">
      <h2 className="text-2xl font-bold">Book Ticket</h2>
      <input className="input" placeholder="Passenger Name" onChange={(e) => setForm({ ...form, passengerName: e.target.value })} />
      <input className="input" type="date" onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} />
      <select className="input" onChange={(e) => setForm({ ...form, classType: e.target.value })}>
        <option value="SL">Sleeper</option><option value="3A">3A</option><option value="2A">2A</option><option value="1A">1A</option>
      </select>
      <input className="input" type="number" min="1" max="6" defaultValue={1} onChange={(e) => setForm({ ...form, seatsBooked: Number(e.target.value) })} />
      <button className="btn-primary w-full">Proceed to Payment</button>
    </form>
  );
}
