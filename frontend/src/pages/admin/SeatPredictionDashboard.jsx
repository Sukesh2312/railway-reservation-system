import { useEffect, useState } from "react";
import { DashboardPage } from "../SharedPages";
import client from "../../api/client";

export default function SeatPredictionDashboard() {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    client.get("/analytics/predictions").then((res) => {
      const p = res.data.summary;
      setStats([
        { label: "High Demand", value: p.highDemandCount || 0 },
        { label: "Low Demand", value: p.lowDemandCount || 0 },
        { label: "Avg Fill Speed", value: p.avgFillSpeed || 0 },
        { label: "Best Booking Hr", value: p.bestBookingWindowHours || 0 }
      ]);
    });
  }, []);
  return <DashboardPage title="Seat Prediction Dashboard" stats={stats} />;
}
