import { useEffect, useState } from "react";
import client from "../../api/client";
import { DashboardPage } from "../SharedPages";
import ScheduleManager from "../../components/ScheduleManager";

export default function ReportsPage() {
  const [stats, setStats] = useState([]);
  const downloadCsv = async () => {
    const response = await client.get("/admin/reports/csv", { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    client.get("/admin/reports").then((res) => {
      const s = res.data.summary;
      setStats([
        { label: "Total Bookings", value: s.totalBookings || 0 },
        { label: "Revenue", value: s.totalRevenue || 0 },
        { label: "Users", value: s.totalUsers || 0 },
        { label: "Cancellations", value: s.totalCancellations || 0 }
      ]);
    });
  }, []);
  return (
    <div className="space-y-5">
      <DashboardPage title="Reports Dashboard" stats={stats} />
      <div className="card">
        <button className="btn-primary" onClick={downloadCsv}>Download Booking CSV Report</button>
      </div>
      <ScheduleManager />
    </div>
  );
}
