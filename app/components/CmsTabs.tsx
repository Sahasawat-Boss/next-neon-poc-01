"use client";

import { useState } from "react";
import CmsForm from "./CmsForm";

type TabContent = {
  page: string;
  pageLabel: string;
  heading: string;
  description: string;
  hasImage: boolean;
};

const tabs = [
  {
    key: "dashboard",
    label: "Dashboard",
    route: "/dashboard",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: "todos",
    label: "Task",
    route: "/todos",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function CmsTabs({
  dashboard,
  todos,
}: {
  dashboard: TabContent;
  todos: TabContent;
}) {
  const [active, setActive] = useState<"dashboard" | "todos">("dashboard");

  const content = active === "dashboard" ? dashboard : todos;

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-800/60">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key as "dashboard" | "todos")}
            className={`cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === tab.key
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              {tab.route}
            </span>
          </button>
        ))}
      </div>

      {/* Form panel */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CmsForm key={active} {...content} />
      </div>
    </div>
  );
}
