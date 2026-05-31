"use client";

import { useEffect, useState } from "react";
import type { ToastType } from "@/lib/toast";

type Toast = { id: number; message: string; type: ToastType; visible: boolean };

let nextId = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type, visible: true }]);

      // start fade-out after 2.5s, remove after 3s
      setTimeout(
        () => setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t))),
        2500
      );
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3100
      );
    };

    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-500 ${
            t.visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          } ${
            t.type === "success"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-red-500 text-white"
          }`}
        >
          {t.type === "success" ? (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
