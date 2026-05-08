import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../../api/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await client.post("/auth/register", form);
    toast.success("Registered successfully");
    navigate("/login");
  };

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-3">
      <h2 className="text-2xl font-bold">Create Account</h2>
      <input className="input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input className="input" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary w-full">Register</button>
    </form>
  );
}
