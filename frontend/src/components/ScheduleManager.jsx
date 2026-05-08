import { useEffect, useState } from "react";
import client from "../api/client";

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ trainId: "", runDate: "", expectedArrival: "", expectedDeparture: "", delayMinutes: 0 });

  const load = () => client.get("/admin/schedules").then((res) => setSchedules(res.data.schedules || []));
  useEffect(load, []);

  const add = async (e) => {
    e.preventDefault();
    await client.post("/admin/schedules", form);
    setForm({ trainId: "", runDate: "", expectedArrival: "", expectedDeparture: "", delayMinutes: 0 });
    load();
  };

  return (
    <div className="card space-y-3">
      <h3 className="text-xl font-bold">Manage Schedules</h3>
      <form onSubmit={add} className="grid md:grid-cols-3 gap-2">
        <input className="input" placeholder="Train ID" value={form.trainId} onChange={(e) => setForm({ ...form, trainId: e.target.value })} />
        <input className="input" type="date" value={form.runDate} onChange={(e) => setForm({ ...form, runDate: e.target.value })} />
        <input className="input" type="datetime-local" value={form.expectedArrival} onChange={(e) => setForm({ ...form, expectedArrival: e.target.value })} />
        <input className="input" type="datetime-local" value={form.expectedDeparture} onChange={(e) => setForm({ ...form, expectedDeparture: e.target.value })} />
        <input className="input" type="number" value={form.delayMinutes} onChange={(e) => setForm({ ...form, delayMinutes: Number(e.target.value) })} />
        <button className="btn-primary">Add Schedule</button>
      </form>
      <div className="max-h-64 overflow-auto space-y-2">
        {schedules.map((s) => (
          <div key={s.id} className="bg-slate-800 rounded p-2">
            {s.train_number} {s.train_name} | {s.run_date?.slice(0, 10)} | Delay: {s.delay_minutes} min
          </div>
        ))}
      </div>
    </div>
  );
}
