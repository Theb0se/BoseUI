"use client";

import React, { useRef, useState } from "react";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";

export function UseInfiniteScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(() =>
    Array.from({ length: 8 }, (_, i) => `Item #${i + 1}`)
  );
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = items.length < 32;

  useInfiniteScroll(
    sentinelRef,
    () => {
      setIsLoading(true);
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 6 }, (_, i) => `Item #${prev.length + i + 1}`),
        ]);
        setIsLoading(false);
      }, 450);
    },
    { hasMore, isLoading, root: containerRef.current }
  );

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="font-mono text-[11px] text-neutral-500">
        Loaded {items.length} / 32 items
      </div>
      <div
        ref={containerRef}
        className="h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg bg-white px-3 py-2 font-mono text-xs dark:bg-neutral-950 dark:text-white"
          >
            {item}
          </div>
        ))}
        <div ref={sentinelRef} className="py-2 text-center font-mono text-[11px] text-neutral-400">
          {hasMore ? (isLoading ? "Loading more..." : "Scroll for more") : "All items loaded"}
        </div>
      </div>
    </div>
  );
}
