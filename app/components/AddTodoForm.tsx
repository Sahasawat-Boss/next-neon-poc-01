"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addTodo } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {pending ? "Adding…" : "Add"}
    </button>
  );
}

export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTodo(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="title"
        type="text"
        placeholder="Add a new todo..."
        required
        className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
      />
      <SubmitButton />
    </form>
  );
}
