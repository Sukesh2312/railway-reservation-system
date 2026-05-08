import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  useEffect(() => {
    if (!user) return;
    client.get("/analytics/recommendations").then((res) => setRecs(res.data.recommendations || [])).catch(() => {});
  }, [user]);
  return (
    <div className="space-y-6">
      <section className="card text-center py-12">
        <h1 className="text-4xl font-extrabold text-rail-500">Smart Railway Reservation</h1>
        <p className="mt-3 text-slate-300">Book tickets, track availability, and monitor analytics in real-time.</p>
        <Link className="btn-primary mt-5 inline-block" to="/search">Search Trains</Link>
      </section>
      {user && (
        <section className="card">
          <h2 className="text-2xl font-bold mb-3">Smart Recommendations</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {recs.map((r) => (
              <div key={r.id} className="bg-slate-800 rounded-xl p-3">
                <p className="font-semibold">{r.train_number} - {r.train_name}</p>
                <p className="text-sm">{r.source_station} {" -> "} {r.destination_station}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
