"use client";

import { useActionState, useEffect } from "react";
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

type Props = { heading: string; description: string };

export default function CmsForm({ heading, description }: Props) {
  const [state, action] = useActionState(
    async (_: unknown, formData: FormData) => {
      await updatePageContent(formData);
      return Date.now();
    },
    null
  );

  useEffect(() => {
    if (state) showToast("Content saved!");
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="page" value="todos" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Heading
        </label>
        <input
          name="heading"
          type="text"
          defaultValue={heading}
          required
          placeholder="My Todos"
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Description
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          name="description"
          defaultValue={description}
          rows={4}
          placeholder="A short description shown below the heading…"
          className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
      </div>

      <SaveButton />
    </form>
  );
}
