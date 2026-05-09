import React from "react";

export default function MiniBarChart({ points = [] }) {
  const max = Math.max(1, ...points.map((p) => Number(p.count || 0)));
  const filled = points.length ? points : Array.from({ length: 7 }, (_, i) => ({ day: `D${i + 1}`, count: 0 }));

  return (
    <div className="mt-4 flex h-44 items-end gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 pb-3 pt-4">
      {filled.map((point) => {
        const height = Math.max(8, Math.round((point.count / max) * 110));
        return (
          <div key={point.day} className="flex flex-1 flex-col items-center">
            <div className="w-full rounded-t-md bg-emerald-500/90 transition hover:bg-emerald-500" style={{ height }} />
            <span className="mt-2 text-[11px] text-slate-500">{point.day.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}