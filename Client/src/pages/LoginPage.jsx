import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

const demoAccounts = [
  { role: "admin", email: "admin@helpdesk.com", password: "password123" },
  { role: "agent", email: "agent@helpdesk.com", password: "password123" },
  { role: "user", email: "user@helpdesk.com", password: "password123" }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email || !password || !role) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password, role);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form className="app-card w-full max-w-md space-y-4 p-6" onSubmit={onSubmit}>
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-lg font-bold text-slate-900">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">HelpDesk Lite</h1>
          <p className="text-sm text-slate-500">Sign in to your support workspace</p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="flex gap-2">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="off"
            />
            <Button type="button" variant="secondary" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Role</label>
          <Select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="admin">Admin</option>
            <option value="agent">Support Agent</option>
            <option value="user">Normal User</option>
          </Select>
        </div>

        {error ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          New user? <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Create account</Link>
        </p>

        {/* Collapsible Demo Accounts Section */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition"
          >
            <span className="text-sm font-medium text-slate-700">Demo Accounts</span>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform ${showDemo ? "rotate-180" : ""}`}
            />
          </button>

          {showDemo && (
            <div className="mt-3 space-y-2 px-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemoAccount(account)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition group"
                >
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                  </p>
                  <p className="text-xs text-slate-500 font-mono group-hover:text-slate-600">
                    {account.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}