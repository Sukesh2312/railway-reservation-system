import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ManageTrainsPage() {
  const [trains, setTrains] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const load = () => client.get("/admin/trains").then((res) => setTrains(res.data.trains));
  useEffect(load, []);
  const remove = async (id) => { await client.delete(`/admin/trains/${id}`); load(); };
  const save = async () => {
    await client.put(`/admin/trains/${editingId}`, editForm);
    setEditingId(null);
    load();
  };
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-3">Manage Trains</h2>
      <div className="space-y-2">
        {trains.map((t) => (
          <div key={t.id} className="bg-slate-800 rounded p-3 flex justify-between">
            <span>{t.train_number} - {t.train_name}</span>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => { setEditingId(t.id); setEditForm({ trainName: t.train_name, sourceStation: t.source_station, destinationStation: t.destination_station, departureTime: t.departure_time, arrivalTime: t.arrival_time, status: t.status }); }}>Edit</button>
              <button className="btn-primary" onClick={() => remove(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editingId && (
        <div className="mt-4 space-y-2 bg-slate-950 p-3 rounded-xl">
          <h3 className="font-bold">Edit Train #{editingId}</h3>
          <input className="input" value={editForm.trainName || ""} onChange={(e) => setEditForm({ ...editForm, trainName: e.target.value })} />
          <input className="input" value={editForm.sourceStation || ""} onChange={(e) => setEditForm({ ...editForm, sourceStation: e.target.value })} />
          <input className="input" value={editForm.destinationStation || ""} onChange={(e) => setEditForm({ ...editForm, destinationStation: e.target.value })} />
          <input className="input" value={editForm.departureTime || ""} onChange={(e) => setEditForm({ ...editForm, departureTime: e.target.value })} />
          <input className="input" value={editForm.arrivalTime || ""} onChange={(e) => setEditForm({ ...editForm, arrivalTime: e.target.value })} />
          <button className="btn-primary" onClick={save}>Save Changes</button>
        </div>
      )}
    </div>
  );
}
