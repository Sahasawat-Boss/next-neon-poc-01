"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  toggleTodo,
  deleteTodo,
  updateTodoDetails,
  setTodoStatus,
  uploadImage,
  deleteImage,
} from "@/app/actions";
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

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-end rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <label
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 ${
        pending ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {pending ? "Uploading…" : "Add image"}
      <input type="file" name="image" accept="image/*" className="hidden" />
    </label>
  );
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <li className="rounded-lg border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Toggle complete */}
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
                <svg className="h-3 w-3 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Title */}
          <span className={`flex-1 text-sm ${todo.completed ? "text-zinc-400 line-through dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}>
            {todo.title}
          </span>

          {/* Pass / Fail */}
          <div className="flex shrink-0 gap-1">
            <form action={setTodoStatus.bind(null, todo.id)}>
              <input type="hidden" name="status" value={todo.status === "PASS" ? "" : "PASS"} />
              <button type="submit" className={`cursor-pointer rounded-md px-2.5 py-0.5 text-xs font-medium transition ${todo.status === "PASS" ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-zinc-100 text-zinc-500 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"}`}>
                Pass
              </button>
            </form>
            <form action={setTodoStatus.bind(null, todo.id)}>
              <input type="hidden" name="status" value={todo.status === "FAIL" ? "" : "FAIL"} />
              <button type="submit" className={`cursor-pointer rounded-md px-2.5 py-0.5 text-xs font-medium transition ${todo.status === "FAIL" ? "bg-red-500 text-white hover:bg-red-600" : "bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"}`}>
                Fail
              </button>
            </form>
          </div>

          {/* Due date badge */}
          {todo.dueDate && (
            <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Due {todo.dueDate}
            </span>
          )}

          {/* Expand toggle */}
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Collapse" : "Expand"} className="cursor-pointer text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
            <svg className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete */}
          <form action={deleteTodo.bind(null, todo.id)}>
            <button type="submit" aria-label="Delete" className="cursor-pointer text-zinc-300 transition hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>

        {/* Expandable detail section */}
        <div className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">

              {/* Detail form */}
              <form action={updateTodoDetails.bind(null, todo.id)} className="flex flex-col gap-3">
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
                <SaveButton />
              </form>

              {/* Images section */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Images</label>

                {/* Thumbnail grid */}
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
                        {/* Delete image */}
                        <form
                          action={deleteImage.bind(null, img.id)}
                          className="absolute right-1 top-1 opacity-0 transition group-hover:opacity-100"
                        >
                          <button
                            type="submit"
                            aria-label="Delete image"
                            className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload form — auto-submits on file select */}
                <form
                  ref={uploadFormRef}
                  action={uploadImage.bind(null, todo.id)}
                >
                  <UploadButton />
                  {/* trigger submit on file change via hidden input onChange */}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    id={`upload-${todo.id}`}
                    onChange={() => uploadFormRef.current?.requestSubmit()}
                  />
                </form>

                {/* Visible upload trigger */}
                <label
                  htmlFor={`upload-${todo.id}`}
                  className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add image
                </label>
              </div>

            </div>
          </div>
        </div>
      </li>

      {/* Lightbox */}
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
