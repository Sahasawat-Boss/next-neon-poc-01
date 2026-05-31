"use client";

import { useState, useRef, useTransition, useActionState, useEffect, useCallback } from "react";
import {
  toggleTodo,
  deleteTodo,
  updateTodoDetails,
  setTodoStatus,
  uploadImage,
  deleteImage,
} from "@/app/actions";
import { showToast } from "@/lib/toast";
import ImageLightbox from "@/app/components/ImageLightbox";

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

export default function TodoItem({ todo, collapseKey = 0 }: { todo: Todo; collapseKey?: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (collapseKey > 0) setOpen(false);
  }, [collapseKey]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const uploadFormRef = useRef<HTMLFormElement>(null);

  // ── Save details form ───────────────────────────────────────────────
  const [saveState, saveAction, savePending] = useActionState(
    async (_: unknown, formData: FormData) => {
      await updateTodoDetails(todo.id, formData);
      return Date.now();
    },
    null
  );
  useEffect(() => {
    if (saveState) showToast("Saved!");
  }, [saveState]);

  // ── Upload form ─────────────────────────────────────────────────────
  const [uploadState, uploadAction, uploadPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      await uploadImage(todo.id, formData);
      return Date.now();
    },
    null
  );
  useEffect(() => {
    if (uploadState) showToast("Image uploaded!");
  }, [uploadState]);

  // ── Handlers ────────────────────────────────────────────────────────
  function handleToggle() {
    startTransition(async () => {
      await toggleTodo(todo.id);
      showToast(todo.completed ? "Marked incomplete" : "Marked complete");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTodo(todo.id);
      showToast("Todo deleted");
    });
  }

  function handleStatus(next: string | null) {
    startTransition(async () => {
      await setTodoStatus(todo.id, next);
      showToast(next ? `Status: ${next}` : "Status cleared");
    });
  }

  function handleDeleteImage(imageId: number) {
    startTransition(async () => {
      await deleteImage(imageId);
      showToast("Image deleted");
    });
  }

  return (
    <>
      <li className={`rounded-lg border border-zinc-100 bg-white transition-opacity dark:border-zinc-800 dark:bg-zinc-900 ${isPending ? "opacity-60" : ""}`}>
        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Toggle complete */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
            className={`cursor-pointer flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
              todo.completed
                ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
                : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-600"
            }`}
          >
            {todo.completed && (
              <svg className="h-3 w-3 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title */}
          <span className={`flex-1 text-sm ${todo.completed ? "text-zinc-400 line-through dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}>
            {todo.title}
          </span>

          {/* Pass / Fail */}
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatus(todo.status === "PASS" ? null : "PASS")}
              className={`cursor-pointer rounded-md px-2.5 py-0.5 text-xs font-medium transition ${
                todo.status === "PASS"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-zinc-100 text-zinc-500 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
              }`}
            >
              Pass
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatus(todo.status === "FAIL" ? null : "FAIL")}
              className={`cursor-pointer rounded-md px-2.5 py-0.5 text-xs font-medium transition ${
                todo.status === "FAIL"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              }`}
            >
              Fail
            </button>
          </div>

          {/* Due date badge */}
          {todo.dueDate && (
            <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Due {todo.dueDate}
            </span>
          )}

          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Collapse" : "Expand"}
            className="cursor-pointer text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <svg className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete"
            className="cursor-pointer text-zinc-300 transition hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Expandable detail section */}
        <div className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">

              {/* Detail form */}
              <form action={saveAction} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Start date</label>
                  <input type="date" name="startDate" defaultValue={todo.startDate} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
                  <textarea name="description" defaultValue={todo.description ?? ""} rows={3} placeholder="Add details…" className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Due date</label>
                  <input type="date" name="dueDate" defaultValue={todo.dueDate ?? ""} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500" />
                </div>
                <button
                  type="submit"
                  disabled={savePending}
                  className="self-end rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {savePending ? "Saving…" : "Save"}
                </button>
              </form>

              {/* Images section */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Images</label>

                {todo.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {todo.images.map((img, i) => (
                      <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={`/api/images/${img.id}`}
                          alt={img.name}
                          className="h-full w-full cursor-pointer object-cover transition group-hover:brightness-75"
                          onClick={() => setLightboxIndex(i)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          aria-label="Delete image"
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload form */}
                <form ref={uploadFormRef} action={uploadAction}>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    id={`upload-${todo.id}`}
                    onChange={() => uploadFormRef.current?.requestSubmit()}
                  />
                </form>
                <label
                  htmlFor={`upload-${todo.id}`}
                  className={`flex cursor-pointer items-center gap-1.5 self-start rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-300 ${uploadPending ? "pointer-events-none opacity-50" : ""}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {uploadPending ? "Uploading…" : "Add image"}
                </label>
              </div>

            </div>
          </div>
        </div>
      </li>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={todo.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </>
  );
}
