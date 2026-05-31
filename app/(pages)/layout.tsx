import Sidebar from "@/app/components/Sidebar";
import { prisma } from "@/lib/prisma";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [todosContent, dashboardContent] = await Promise.all([
    prisma.pageContent.findUnique({ where: { page: "todos" }, select: { heading: true } }),
    prisma.pageContent.findUnique({ where: { page: "dashboard" }, select: { heading: true } }),
  ]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 min-w-0">{children}</div>
      <Sidebar
        todoHeading={todosContent?.heading ?? "My Todos"}
        dashboardHeading={dashboardContent?.heading ?? "Dashboard"}
      />
    </div>
  );
}
