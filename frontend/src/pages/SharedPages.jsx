import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function GenericInfoPage({ title, description }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
      <h1 className="text-3xl font-bold text-rail-500 mb-3">{title}</h1>
      <p className="text-slate-300">{description}</p>
    </motion.div>
  );
}

export function DashboardPage({ title, stats = [] }) {
  const chartData = stats.map((s) => ({ name: s.label, value: s.value }));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-rail-500">{title}</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <div className="h-2 bg-slate-800 rounded mt-2">
              <div className="h-2 bg-rail-500 rounded" style={{ width: `${Math.min(100, Number(s.value))}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
