"use client";

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
  if (todos.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-zinc-400">
        No todos yet — add one above.
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
