"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePageContent } from "@/app/actions";
import { showToast } from "@/lib/toast";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-end rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

type Props = {
  page: string;
  pageLabel: string;
  heading: string;
  description: string;
  hasImage: boolean;
};

export default function CmsForm({ page, pageLabel, heading, description, hasImage }: Props) {
  const [wantClear, setWantClear] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, action] = useActionState(
    async (_: unknown, formData: FormData) => {
      await updatePageContent(formData);
      return Date.now();
    },
    null
  );

  useEffect(() => {
    if (state) {
      showToast("Content saved!");
      setPreview(null);
      setWantClear(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [state]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setWantClear(false);
    setPreview(URL.createObjectURL(file));
  }

  const showCurrentImage = hasImage && !wantClear && !preview;
  const imgSrc = preview ?? (showCurrentImage ? `/api/page-image/${page}?t=${Date.now()}` : null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="page" value={page} />
      <input type="hidden" name="clearImage" value={wantClear ? "1" : "0"} />

      {/* Page badge */}
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          Page
        </span>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {pageLabel}
        </span>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Heading
        </label>
        <input
          name="heading"
          type="text"
          defaultValue={heading}
          required
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Description
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          name="description"
          defaultValue={description}
          rows={3}
          placeholder="A short description shown below the heading…"
          className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
      </div>

      {/* Image */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Image
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        </label>

        {/* Preview */}
        {imgSrc && (
          <div className="relative w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <img
              src={imgSrc}
              alt="Page image"
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setWantClear(true);
                setPreview(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {wantClear && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Image will be removed on save.
            <button type="button" onClick={() => setWantClear(false)} className="underline">
              Undo
            </button>
          </p>
        )}

        {/* File input */}
        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:file:bg-zinc-700 dark:file:text-zinc-300"
        />
      </div>

      <SaveButton />
    </form>
  );
}
