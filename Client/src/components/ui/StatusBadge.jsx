import React from "react";

const styles = {
  Open: "bg-sky-100 text-sky-700",
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-violet-100 text-violet-700",
  "Waiting for User": "bg-rose-100 text-rose-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-700",
  Low: "bg-cyan-100 text-cyan-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700"
};

export default function StatusBadge({ text }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[text] || "bg-slate-100 text-slate-700"}`}>
      {text}
    </span>
  );
}