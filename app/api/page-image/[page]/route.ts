import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  const content = await prisma.pageContent.findUnique({
    where: { page },
    select: { imageData: true, imageMimeType: true },
  });
  if (!content?.imageData) return new Response("Not found", { status: 404 });
  return new Response(content.imageData, {
    headers: { "Content-Type": content.imageMimeType ?? "image/jpeg" },
  });
}
