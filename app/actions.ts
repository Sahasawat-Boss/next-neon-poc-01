"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePageContent(formData: FormData) {
  const page = formData.get("page") as string;
  const heading = (formData.get("heading") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  if (!page || !heading) return;
  await prisma.pageContent.upsert({
    where: { page },
    update: { heading, description },
    create: { page, heading, description },
  });
  revalidatePath("/");
  revalidatePath("/cms");
}

async function log(todoTitle: string, action: string) {
  await prisma.activityLog.create({ data: { todoTitle, action } });
}

export async function addTodo(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;
  const startDateStr = formData.get("startDate") as string | null;
  await prisma.todo.create({
    data: { title, startDate: startDateStr ? new Date(startDateStr) : new Date() },
  });
  await log(title, "Created");
  revalidatePath("/");
}

export async function toggleTodo(id: number) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return;
  await prisma.todo.update({ where: { id }, data: { completed: !todo.completed } });
  await log(todo.title, todo.completed ? "Reopened" : "Completed");
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const todo = await prisma.todo.findUnique({ where: { id }, select: { title: true } });
  await prisma.todo.delete({ where: { id } });
  if (todo) await log(todo.title, "Deleted");
  revalidatePath("/");
}

export async function setTodoStatus(id: number, status: string | null) {
  const todo = await prisma.todo.findUnique({ where: { id }, select: { title: true } });
  await prisma.todo.update({ where: { id }, data: { status } });
  if (todo) await log(todo.title, status ? `Status → ${status}` : "Status cleared");
  revalidatePath("/");
}

export async function uploadImage(todoId: number, formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return;
  if (!file.type.startsWith("image/")) return;
  const buffer = Buffer.from(await file.arrayBuffer());
  const todo = await prisma.todo.findUnique({ where: { id: todoId }, select: { title: true } });
  await prisma.todoImage.create({
    data: { todoId, data: buffer, mimeType: file.type, name: file.name },
  });
  if (todo) await log(todo.title, `Added image: ${file.name}`);
  revalidatePath("/");
}

export async function deleteImage(imageId: number) {
  const image = await prisma.todoImage.findUnique({
    where: { id: imageId },
    include: { todo: { select: { title: true } } },
  });
  await prisma.todoImage.delete({ where: { id: imageId } });
  if (image) await log(image.todo.title, `Removed image: ${image.name}`);
  revalidatePath("/");
}

export async function updateTodoDetails(id: number, formData: FormData) {
  const description = (formData.get("description") as string)?.trim() || null;
  const dueDateStr = formData.get("dueDate") as string | null;
  const startDateStr = formData.get("startDate") as string | null;
  const todo = await prisma.todo.findUnique({ where: { id }, select: { title: true } });
  await prisma.todo.update({
    where: { id },
    data: {
      description,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });
  if (todo) await log(todo.title, "Updated details");
  revalidatePath("/");
}
