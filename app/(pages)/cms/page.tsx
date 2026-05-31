import { prisma } from "@/lib/prisma";
import CmsTabs from "@/app/components/CmsTabs";

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

        <CmsTabs
          dashboard={{
            page: "dashboard",
            pageLabel: "Dashboard (/dashboard)",
            heading: dashboardContent?.heading ?? "Dashboard",
            description: dashboardContent?.description ?? "",
            hasImage: !!dashboardContent?.imageData,
          }}
          todos={{
            page: "todos",
            pageLabel: "Task (/todos)",
            heading: todosContent?.heading ?? "My Todos",
            description: todosContent?.description ?? "",
            hasImage: !!todosContent?.imageData,
          }}
        />
      </div>
    </div>
  );
}
