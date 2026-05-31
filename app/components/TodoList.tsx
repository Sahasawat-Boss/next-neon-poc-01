"use client";

import { useState } from "react";
import TodoItem from "@/app/components/TodoItem";

type TodoImage = { id: number; name: string };

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  description: string | null;
  status: string | null;
  startDate: string;
  dueDate: string | null;
  images: TodoImage[];
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [collapseKey, setCollapseKey] = useState(0);

  if (todos.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-zinc-400">
        No todos yet — add one above.
      </p>
    );
  }

  return (
    <div className="mt-4">
      {/* Collapse All button */}
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setCollapseKey((k) => k + 1)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          Collapse all
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} collapseKey={collapseKey} />
        ))}
      </ul>
    </div>
  );
}
