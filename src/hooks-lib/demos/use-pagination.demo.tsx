"use client";

import React from "react";
import { usePagination } from "../hooks/use-pagination";

export function UsePaginationDemo() {
  const { page, totalPages, startIndex, endIndex, hasPrev, hasNext, range, setPage, prev, next } =
    usePagination({ totalItems: 95, pageSize: 10, siblingCount: 1 });

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="font-mono text-xs text-neutral-500">
        Showing items {startIndex + 1}–{endIndex} of 95 (Page {page}/{totalPages})
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={prev}
          disabled={!hasPrev}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-xs disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
        >
          Prev
        </button>

        {range.map((token, idx) =>
          token === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-1.5 font-mono text-xs text-neutral-400">
              ...
            </span>
          ) : (
            <button
              key={token}
              type="button"
              onClick={() => setPage(token)}
              className={`h-8 min-w-8 rounded-lg border px-2 font-mono text-xs font-medium ${
                page === token
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
              }`}
            >
              {token}
            </button>
          )
        )}

        <button
          type="button"
          onClick={next}
          disabled={!hasNext}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-xs disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
        >
          Next
        </button>
      </div>
    </div>
  );
}
