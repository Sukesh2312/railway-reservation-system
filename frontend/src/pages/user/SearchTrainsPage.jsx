import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";

export default function SearchTrainsPage() {
  const [query, setQuery] = useState({ source: "", destination: "", journeyDate: "" });
  const [trains, setTrains] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    client.get("/trains/cities").then((res) => setCities(res.data.cities || [])).catch(() => setCities([]));
  }, []);

  const search = async (e) => {
    e.preventDefault();
    const { data } = await client.get("/trains/search", { params: query });
    setTrains(data.trains);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={search} className="card grid md:grid-cols-4 gap-3">
        <select className="input" value={query.source} onChange={(e) => setQuery({ ...query, source: e.target.value })}>
          <option value="">Select Source City</option>
          {cities.map((city) => <option key={`src-${city}`} value={city}>{city}</option>)}
        </select>
        <select className="input" value={query.destination} onChange={(e) => setQuery({ ...query, destination: e.target.value })}>
          <option value="">Select Destination City</option>
          {cities.map((city) => <option key={`dst-${city}`} value={city}>{city}</option>)}
        </select>
        <input className="input" type="date" onChange={(e) => setQuery({ ...query, journeyDate: e.target.value })} />
        <button className="btn-primary">Search</button>
      </form>
      <div className="grid gap-3">
        {trains.map((t) => (
          <div className="card flex justify-between items-center" key={t.id}>
            <div>
              <h3 className="font-bold">{t.train_number} - {t.train_name}</h3>
              <p>{t.source_station} to {t.destination_station}</p>
            </div>
            <div className="flex gap-2">
              <Link className="btn-primary" to={`/trains/${t.id}`}>Details</Link>
              <Link className="btn-primary" to={`/book/${t.id}`}>Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
