"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white p-6 text-black dark:bg-[#050505] dark:text-white">
        <div className="max-w-md rounded-3xl border border-neutral-200 p-8 text-center dark:border-[#222222]">
          <h2 className="text-lg font-bold">Application Error</h2>
          <p className="mt-2 text-xs text-neutral-500">
            {error.message || "A critical error occurred."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-5 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
