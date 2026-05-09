import React from "react";

export function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

export default function SkeletonTable() {
  return (
    <div className="app-card p-4">
      <SkeletonLine className="mb-3 h-6 w-1/4" />
      <SkeletonLine className="mb-2 h-10 w-full" />
      <SkeletonLine className="mb-2 h-10 w-full" />
      <SkeletonLine className="h-10 w-full" />
    </div>
  );
}