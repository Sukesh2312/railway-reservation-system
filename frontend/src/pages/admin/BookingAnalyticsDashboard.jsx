import { useEffect, useState } from "react";
import { DashboardPage } from "../SharedPages";
import client from "../../api/client";

export default function BookingAnalyticsDashboard() {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    client.get("/analytics/bookings").then((res) => {
      const b = res.data.summary;
      setStats([
        { label: "Total Bookings", value: b.totalBookings || 0 },
        { label: "Revenue", value: b.revenue || 0 },
        { label: "Cancellations", value: b.cancellations || 0 },
        { label: "Occupancy", value: b.occupancy || 0 }
      ]);
    });
  }, []);
  return <DashboardPage title="Booking Analytics Dashboard" stats={stats} />;
}
