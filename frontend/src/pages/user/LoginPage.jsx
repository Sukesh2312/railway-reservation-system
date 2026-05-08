import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await client.post("/auth/login", form);
    login(data.token, data.user);
    toast.success("Login successful");
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-3">
      <h2 className="text-2xl font-bold">User Login</h2>
      <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary w-full">Login</button>
    </form>
  );
}
