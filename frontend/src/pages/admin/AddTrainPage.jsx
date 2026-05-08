import { useState } from "react";
import client from "../../api/client";

export default function AddTrainPage() {
  const [form, setForm] = useState({ trainNumber: "", trainName: "", sourceStation: "", destinationStation: "", departureTime: "", arrivalTime: "" });
  const submit = async (e) => {
    e.preventDefault();
    await client.post("/admin/trains", form);
    setForm({ trainNumber: "", trainName: "", sourceStation: "", destinationStation: "", departureTime: "", arrivalTime: "" });
  };
  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-2xl font-bold">Add Train</h2>
      {Object.keys(form).map((k) => (
        <input key={k} className="input" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      ))}
      <button className="btn-primary">Add Train</button>
    </form>
  );
}
