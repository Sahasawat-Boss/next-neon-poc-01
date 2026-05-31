import { prisma } from "@/lib/prisma";
import AddTodoForm from "@/app/components/AddTodoForm";
import TodoItem from "@/app/components/TodoItem";

export default async function Home() {
  const rows = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const today = new Date().toISOString().split("T")[0];

  const todos = rows.map((t) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    description: t.description,
    startDate: t.startDate?.toISOString().split("T")[0] ?? today,
    dueDate: t.dueDate ? t.dueDate.toISOString().split("T")[0] : null,
  }));

  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            My Todos
          </h1>
          {todos.length > 0 && (
            <p className="mt-1 text-sm text-zinc-500">
              {completed} / {todos.length} completed
            </p>
          )}
        </div>

        <AddTodoForm today={today} />

        {todos.length === 0 ? (
          <p className="mt-12 text-center text-sm text-zinc-400">
            No todos yet — add one above.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
