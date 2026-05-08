import { useEffect, useState } from "react";
import { DashboardPage } from "../SharedPages";
import client from "../../api/client";

export default function PlatformAssignmentDashboard() {
  const [stats, setStats] = useState([]);
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    client.get("/analytics/platforms").then((res) => {
      const s = res.data.summary;
      setStats([
        { label: "Platforms", value: s.totalPlatforms || 0 },
        { label: "Assigned", value: s.assignedNow || 0 },
        { label: "Conflicts", value: s.conflictsResolved || 0 },
        { label: "Usage %", value: s.usagePercent || 0 }
      ]);
    });
    client.get("/admin/platform-assignments").then((res) => setAssignments(res.data.assignments || []));
  }, []);
  return (
    <div className="space-y-5">
      <DashboardPage title="Platform Assignment Dashboard" stats={stats} />
      <div className="card">
        <h3 className="text-xl font-bold mb-3">Assignment History</h3>
        <div className="space-y-2 max-h-72 overflow-auto">
          {assignments.map((a) => (
            <div className="bg-slate-800 p-2 rounded" key={a.id}>
              {a.train_number} -> Platform {a.platform_number} ({a.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
