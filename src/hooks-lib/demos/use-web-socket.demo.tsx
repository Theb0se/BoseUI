"use client";

import React, { useState } from "react";
import { useWebSocket } from "../hooks/use-web-socket";

export function UseWebSocketDemo() {
  const [url, setUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("ping");
  const { status, lastMessage, send, close, reconnect } = useWebSocket(url, {
    reconnect: false,
  });

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <span>Status: {status}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setUrl("wss://echo.websocket.events");
              reconnect();
            }}
            className="rounded-lg bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-black"
          >
            Connect
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              setUrl(null);
            }}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] dark:border-neutral-800 dark:bg-neutral-950"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <button
          type="button"
          disabled={status !== "open"}
          onClick={() => send(message)}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-black"
        >
          Send
        </button>
      </div>

      <div className="font-mono text-[11px] text-neutral-500">
        Last message: {lastMessage ?? "None"}
      </div>
    </div>
  );
}
