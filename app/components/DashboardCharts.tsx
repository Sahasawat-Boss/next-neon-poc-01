"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";

type Props = {
  total: number;
  completed: number;
  pass: number;
  fail: number;
};

const RADIAN = Math.PI / 180;

function renderLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (
    cx == null || cy == null || midAngle == null ||
    innerRadius == null || outerRadius == null || percent == null ||
    percent < 0.05
  ) return null;
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.55;
  const x = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
      {`${(Number(percent) * 100).toFixed(0)}%`}
    </text>
  );
}

export default function DashboardCharts({ total, completed, pass, fail }: Props) {
  const undone = total - completed;
  const none = total - pass - fail;

  const completionData = [
    { name: "Done", value: completed, color: "#22c55e" },
    { name: "Undone", value: undone, color: "#d4d4d8" },
  ].filter((d) => d.value > 0);

  const statusData = [
    { name: "Pass", value: pass, color: "#22c55e" },
    { name: "Fail", value: fail, color: "#ef4444" },
    { name: "None", value: none, color: "#d4d4d8" },
  ].filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-400">
        No todos yet — add some from My Todo.
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {/* Completion chart */}
      <div className="rounded-xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Completion
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={completionData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {completionData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span className="font-semibold text-emerald-600">{completed} Done</span>
          <span className="font-semibold text-zinc-400">{undone} Undone</span>
        </div>
      </div>

      {/* Status chart */}
      <div className="rounded-xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Pass / Fail
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span className="font-semibold text-emerald-600">{pass} Pass</span>
          <span className="font-semibold text-red-500">{fail} Fail</span>
          <span className="font-semibold text-zinc-400">{none} None</span>
        </div>
      </div>
    </div>
  );
}
