import React from "react";
import { useToast } from "../../hooks/useToast";

export default function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-2 text-sm text-white shadow-card ${
            toast.type === "error" ? "bg-red-500" : "bg-slate-900"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}