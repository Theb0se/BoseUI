"use client";

import React, { useState } from "react";
import { useEventSource } from "../hooks/use-event-source";

export function UseEventSourceDemo() {
  const [url, setUrl] = useState<string | null>(null);
  const { status, lastEvent, error, close } = useEventSource(url);

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>SSE Status: {status}</div>
        {lastEvent && <div className="mt-1 text-emerald-500">{lastEvent}</div>}
        {error && <div className="mt-1 text-rose-500">{error}</div>}
      </div>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setUrl("/api/events")}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Connect SSE
        </button>
        <button
          type="button"
          onClick={() => {
            close();
            setUrl(null);
          }}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
