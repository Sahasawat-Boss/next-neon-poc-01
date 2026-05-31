"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;
  await prisma.todo.create({ data: { title } });
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
