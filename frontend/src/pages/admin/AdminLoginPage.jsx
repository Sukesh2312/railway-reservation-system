import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();
  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post("/auth/admin-login", form);
    login(data.token, data.user);
    navigate("/admin/dashboard");
  };
  return (
    <form className="card max-w-md mx-auto space-y-3" onSubmit={submit}>
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <input className="input" placeholder="Admin Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary w-full">Login</button>
    </form>
  );
}
