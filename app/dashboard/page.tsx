import { prisma } from "@/lib/prisma";
import DashboardCharts from "@/app/components/DashboardCharts";

export default async function DashboardPage() {
  const todos = await prisma.todo.findMany({
    select: { completed: true, status: true },
  });

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pass = todos.filter((t) => t.status === "PASS").length;
  const fail = todos.filter((t) => t.status === "FAIL").length;

  const stats = [
    { label: "Total", value: total, color: "text-zinc-700 dark:text-zinc-300" },
    { label: "Done", value: completed, color: "text-emerald-600" },
    { label: "Undone", value: total - completed, color: "text-zinc-400" },
    { label: "Pass", value: pass, color: "text-emerald-600" },
    { label: "Fail", value: fail, color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 px-8 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>

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
  );
}
