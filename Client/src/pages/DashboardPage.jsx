import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import MiniBarChart from "../components/MiniBarChart";
import SkeletonTable from "../components/ui/Skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ total: 0, open: 0, solved: 0, pending: 0, urgent: 0, createdLast7Days: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/tickets/analytics/summary")
      .then((response) => setSummary(response.data))
      .catch(async () => {
        try {
          const response = await api.get("/tickets");
          const list = response.data;
          setSummary({
            total: list.length,
            open: list.filter((item) => item.status === "Open").length,
            solved: list.filter((item) => ["Resolved", "Closed"].includes(item.status)).length,
            pending: list.filter((item) => ["Pending", "Waiting for User"].includes(item.status)).length,
            urgent: list.filter((item) => item.priority === "Urgent").length,
            createdLast7Days: []
          });
        } catch (error) {
          setSummary({ total: 0, open: 0, solved: 0, pending: 0, urgent: 0, createdLast7Days: [] });
        }
      })
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return <SkeletonTable />;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Reports Dashboard</h2>
        <p className="text-sm text-slate-500">Real-time support performance with weekly trend insights.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="app-card p-4"><p className="text-sm text-slate-500">Total Tickets</p><p className="mt-2 text-3xl font-semibold">{summary.total}</p></article>
        <article className="app-card p-4"><p className="text-sm text-slate-500">Open</p><p className="mt-2 text-3xl font-semibold text-sky-700">{summary.open}</p></article>
        <article className="app-card p-4"><p className="text-sm text-slate-500">Pending</p><p className="mt-2 text-3xl font-semibold text-amber-700">{summary.pending}</p></article>
        <article className="app-card p-4"><p className="text-sm text-slate-500">Solved</p><p className="mt-2 text-3xl font-semibold text-emerald-700">{summary.solved}</p></article>
        <article className="app-card p-4"><p className="text-sm text-slate-500">Urgent</p><p className="mt-2 text-3xl font-semibold text-red-700">{summary.urgent}</p></article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="app-card col-span-2 p-5">
          <h3 className="text-base font-semibold">New Tickets - Last 7 Days</h3>
          <MiniBarChart points={summary.createdLast7Days} />
        </div>
        <div className="app-card p-5">
          <h3 className="text-base font-semibold">Response Stats</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-slate-500">Avg first response</span><strong>42m</strong></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Avg resolution time</span><strong>5h 10m</strong></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Satisfaction</span><strong>96%</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}