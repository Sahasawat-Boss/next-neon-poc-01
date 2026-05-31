"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;
  const startDateStr = formData.get("startDate") as string | null;
  await prisma.todo.create({
    data: {
      title,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });
  revalidatePath("/");
}

export async function toggleTodo(id: number) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return;
  await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
}

export async function setTodoStatus(id: number, formData: FormData) {
  const next = formData.get("status") as string | null;
  await prisma.todo.update({ where: { id }, data: { status: next || null } });
  revalidatePath("/");
}

export async function uploadImage(todoId: number, formData: FormData) {
  const file = formData.get("image") as File;
  if (!file || file.size === 0) return;
  if (!file.type.startsWith("image/")) return;
  const buffer = Buffer.from(await file.arrayBuffer());
  await prisma.todoImage.create({
    data: { todoId, data: buffer, mimeType: file.type, name: file.name },
  });
  revalidatePath("/");
}

export async function deleteImage(imageId: number) {
  await prisma.todoImage.delete({ where: { id: imageId } });
  revalidatePath("/");
}

export async function updateTodoDetails(id: number, formData: FormData) {
  const description = (formData.get("description") as string)?.trim() || null;
  const dueDateStr = formData.get("dueDate") as string | null;
  const startDateStr = formData.get("startDate") as string | null;
  await prisma.todo.update({
    where: { id },
    data: {
      description,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      startDate: startDateStr ? new Date(startDateStr) : new Date(),
    },
  });
  revalidatePath("/");
}
