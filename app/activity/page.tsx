import { prisma } from "@/lib/prisma";

const actionMeta: Record<string, { color: string; icon: string }> = {
  Created:          { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "✦" },
  Completed:        { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "✓" },
  Reopened:         { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400", icon: "↩" },
  Deleted:          { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", icon: "✕" },
  "Updated details":{ color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", icon: "✎" },
  "Status cleared": { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400", icon: "○" },
};

function getMeta(action: string) {
  if (action in actionMeta) return actionMeta[action];
  if (action.startsWith("Status → PASS")) return { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: "✓" };
  if (action.startsWith("Status → FAIL")) return { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", icon: "✕" };
  if (action.startsWith("Added image"))   return { color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", icon: "⬆" };
  if (action.startsWith("Removed image")) return { color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", icon: "⬇" };
  return { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400", icon: "•" };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(date);
}

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen bg-zinc-50 px-8 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Activity Log
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Last {logs.length} activities
          </p>
        </div>

        {logs.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-400">
            No activity yet — start using My Todo.
          </p>
        ) : (
          <ol className="relative border-l border-zinc-200 dark:border-zinc-800">
            {logs.map((log: { id: number; todoTitle: string; action: string; createdAt: Date }) => {
              const { color, icon } = getMeta(log.action);
              return (
                <li key={log.id} className="mb-6 ml-5">
                  {/* Dot on timeline */}
                  <span className={`absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ring-4 ring-zinc-50 dark:ring-zinc-950 ${color}`}>
                    {icon}
                  </span>

                  <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {log.todoTitle}
                        </p>
                        <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>
                          {log.action}
                        </span>
                      </div>
                      <time className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                        {formatDate(log.createdAt)}
                      </time>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
