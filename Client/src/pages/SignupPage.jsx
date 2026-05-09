import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="app-card w-full max-w-md space-y-4 p-6">
        <div className="text-center mb-4">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-lg font-bold text-slate-900">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Create account</h1>
          <p className="text-sm text-slate-500">Join HelpDesk Lite</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <Input
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            placeholder="Enter your email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <Input
            placeholder="Create a password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            autoComplete="new-password"
          />
          <p className="text-xs text-slate-500 mt-1">At least 8 characters recommended</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Account Type</label>
          <Select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
            <option value="user">Client/User</option>
            <option value="agent">Support Agent</option>
            <option value="admin">Admin</option>
          </Select>
        </div>

        {error ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        
        <Button className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have account? <Link className="text-indigo-600 font-medium hover:underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}