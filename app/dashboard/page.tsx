import { prisma } from "@/lib/prisma";
import DashboardCharts from "@/app/components/DashboardCharts";

export default async function DashboardPage() {
  const [content, todos] = await Promise.all([
    prisma.pageContent.findUnique({
      where: { page: "dashboard" },
      select: { heading: true, description: true, imageData: true },
    }),
    prisma.todo.findMany({ select: { completed: true, status: true } }),
  ]);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pass = todos.filter((t) => t.status === "PASS").length;
  const fail = todos.filter((t) => t.status === "FAIL").length;

  const stats = [
    { label: "Total",  value: total,           color: "text-zinc-700 dark:text-zinc-300" },
    { label: "Done",   value: completed,        color: "text-emerald-600" },
    { label: "Undone", value: total - completed,color: "text-zinc-400" },
    { label: "Pass",   value: pass,             color: "text-emerald-600" },
    { label: "Fail",   value: fail,             color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Banner image */}
      {content?.imageData && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src="/api/page-image/dashboard"
            alt="Dashboard banner"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="px-8 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {content?.heading ?? "Dashboard"}
            </h1>
            {content?.description && (
              <p className="mt-1 text-sm text-zinc-500">{content.description}</p>
            )}
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-5 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-100 bg-white px-4 py-4 text-center dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <DashboardCharts
            total={total}
            completed={completed}
            pass={pass}
            fail={fail}
          />
        </div>
      </div>
    </div>
  );
}
