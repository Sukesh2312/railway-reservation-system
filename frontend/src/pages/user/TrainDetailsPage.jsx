import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../../api/client";

export default function TrainDetailsPage() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  useEffect(() => {
    client.get(`/trains/${id}`).then((res) => setTrain(res.data.train));
  }, [id]);
  if (!train) return <div className="card">Loading train details...</div>;
  return (
    <div className="card">
      <h2 className="text-2xl font-bold">{train.train_name} ({train.train_number})</h2>
      <p className="mt-2">Route: {train.source_station} - {train.destination_station}</p>
      <p>Departure: {train.departure_time} | Arrival: {train.arrival_time}</p>
      <div className="mt-4 flex gap-3">
        <Link className="btn-primary" to={`/seat-availability/${id}`}>Check Seats</Link>
        <Link className="btn-primary" to={`/book/${id}`}>Book Now</Link>
      </div>
    </div>
  );
}
