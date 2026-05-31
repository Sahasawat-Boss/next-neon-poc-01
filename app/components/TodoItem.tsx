import { toggleTodo, deleteTodo } from "@/app/actions";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <form action={toggleTodo.bind(null, todo.id)}>
        <button
          type="submit"
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
          className={`cursor-pointer flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
            todo.completed
              ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
              : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-600"
          }`}
        >
          {todo.completed && (
            <svg
              className=" h-3 w-3 text-white dark:text-zinc-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </form>

      <span
        className={`flex-1 text-sm  ${
          todo.completed
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {todo.title}
      </span>

      <form action={deleteTodo.bind(null, todo.id)}>
        <button
          type="submit"
          aria-label="Delete"
          className="cursor-pointer text-zinc-300 transition hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </li>
  );
}
