import { prisma } from "@/lib/prisma";
import CmsForm from "@/app/components/CmsForm";

export default async function CmsPage() {
  const [todosContent, dashboardContent] = await Promise.all([
    prisma.pageContent.findUnique({ where: { page: "todos" } }),
    prisma.pageContent.findUnique({ where: { page: "dashboard" } }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 px-8 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CMS
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Edit content displayed on each page.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* My Todos page */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <CmsForm
              page="todos"
              pageLabel="My Todos (/)"
              heading={todosContent?.heading ?? "My Todos"}
              description={todosContent?.description ?? ""}
              hasImage={!!todosContent?.imageData}
            />
          </div>

          {/* Dashboard page */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <CmsForm
              page="dashboard"
              pageLabel="Dashboard (/dashboard)"
              heading={dashboardContent?.heading ?? "Dashboard"}
              description={dashboardContent?.description ?? ""}
              hasImage={!!dashboardContent?.imageData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
