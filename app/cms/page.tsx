import { prisma } from "@/lib/prisma";
import CmsForm from "@/app/components/CmsForm";

export default async function CmsPage() {
  const content = await prisma.pageContent.findUnique({
    where: { page: "todos" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 px-8 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CMS
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Edit content shown on the My Todos page.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Page
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              My Todos (/)
            </span>
          </div>
          <CmsForm
            heading={content?.heading ?? "My Todos"}
            description={content?.description ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
