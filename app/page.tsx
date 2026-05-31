import Link from "next/link";

const menu = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "View stats and charts",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-100 dark:border-blue-900/50",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/todos",
    label: "My Todos",
    description: "Manage your tasks",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-100 dark:border-emerald-900/50",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/activity",
    label: "Activity Log",
    description: "Track recent changes",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-100 dark:border-violet-900/50",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/cms",
    label: "CMS",
    description: "Edit page content",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900/50",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-lg dark:from-zinc-100 dark:to-zinc-200">
            <svg className="h-7 w-7 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Neon DB POC
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Next.js + Neon DB proof of concept
          </p>
        </div>

        {/* Menu cards */}
        <div className="grid grid-cols-2 gap-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group rounded-2xl border ${item.border} ${item.bg} p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${item.color} text-white shadow-sm`}
              >
                {item.icon}
              </div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.label}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
