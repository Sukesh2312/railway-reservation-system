import { useEffect, useState } from "react";
import { DashboardPage } from "../SharedPages";
import client from "../../api/client";

export default function CongestionMonitoringDashboard() {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    client.get("/analytics/congestion").then((res) => {
      const c = res.data.summary;
      setStats([
        { label: "Peak Station", value: c.peakStationScore || 0 },
        { label: "Active Alerts", value: c.activeAlerts || 0 },
        { label: "Avg Crowding", value: c.avgCrowding || 0 },
        { label: "Weekend Rush", value: c.weekendRush || 0 }
      ]);
    });
  }, []);
  return <DashboardPage title="Congestion Monitoring Dashboard" stats={stats} />;
}
