import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.todoImage.findUnique({
    where: { id: parseInt(id) },
  });
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(image.data, {
    headers: { "Content-Type": image.mimeType },
  });
}
