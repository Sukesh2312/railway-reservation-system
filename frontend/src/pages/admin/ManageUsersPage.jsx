import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => { client.get("/admin/users").then((res) => setUsers(res.data.users)); }, []);
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-3">Manage Users</h2>
      <div className="space-y-2">
        {users.map((u) => <div key={u.id} className="bg-slate-800 rounded p-3">{u.name} | {u.email}</div>)}
      </div>
    </div>
  );
}
