"use client";

import { useEffect, useCallback } from "react";

type Image = { id: number; name: string };

type Props = {
  images: Image[];
  index: number;
  onClose: () => void;
  onNav: (index: number) => void;
};

export default function ImageLightbox({ images, index, onClose, onNav }: Props) {
  const current = images[index];

  const prev = useCallback(() => {
    onNav((index - 1 + images.length) % images.length);
  }, [index, images.length, onNav]);

  const next = useCallback(() => {
    onNav((index + 1) % images.length);
  }, [index, images.length, onNav]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
          {index + 1} / {images.length}
        </span>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={`/api/images/${current.id}`}
        alt={current.name}
        className="max-h-[90vh] max-w-[90vw] select-none rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Filename */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
        {current.name}
      </p>
    </div>
  );
}
