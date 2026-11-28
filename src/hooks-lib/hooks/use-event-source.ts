"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type EventSourceStatus = "idle" | "connecting" | "open" | "error" | "closed";

export interface UseEventSourceOptions {
  withCredentials?: boolean;
  onMessage?: (event: MessageEvent) => void;
}

export interface UseEventSourceReturn {
  status: EventSourceStatus;
  lastEvent: string | null;
  error: string | null;
  close: () => void;
}

/**
 * Subscribes to Server-Sent Events (SSE) using the browser `EventSource` API
 * with automatic cleanup on unmount. Pass `url = null` to stay disconnected.
 *
 * @param url - SSE endpoint URL, or `null`.
 * @param options - `withCredentials` and `onMessage` handler.
 * @returns `{ status, lastEvent, error, close }`.
 */
export function useEventSource(
  url: string | null,
  options: UseEventSourceOptions = {}
): UseEventSourceReturn {
  const { withCredentials = false, onMessage } = options;

  const [status, setStatus] = useState<EventSourceStatus>(
    url ? "connecting" : "idle"
  );
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sourceRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url || typeof window === "undefined" || typeof EventSource === "undefined") {
      setStatus("idle");
      return;
    }

    setStatus("connecting");
    setError(null);

    const es = new EventSource(url, { withCredentials });
    sourceRef.current = es;

    es.onopen = () => {
      setStatus("open");
      setError(null);
    };

    es.onmessage = (event) => {
      setLastEvent(typeof event.data === "string" ? event.data : String(event.data));
      onMessageRef.current?.(event);
    };

    es.onerror = () => {
      setStatus("error");
      setError("EventSource connection error.");
    };

    return () => {
      es.close();
      sourceRef.current = null;
    };
  }, [url, withCredentials]);

  const close = useCallback(() => {
    sourceRef.current?.close();
    sourceRef.current = null;
    setStatus("closed");
  }, []);

  return { status, lastEvent, error, close };
}
