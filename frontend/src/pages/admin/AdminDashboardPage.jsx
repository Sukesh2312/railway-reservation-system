import { DashboardPage } from "../SharedPages";

export default function AdminDashboardPage() {
  return <DashboardPage title="Admin Dashboard" stats={[
    { label: "Users", value: 120 },
    { label: "Bookings", value: 340 },
    { label: "Revenue", value: 78 },
    { label: "Occupancy", value: 89 }
  ]} />;
}
