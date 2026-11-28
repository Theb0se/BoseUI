"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WebSocketStatus = "idle" | "connecting" | "open" | "closed" | "error";

export interface UseWebSocketOptions {
  /** Automatically reconnect when closed unexpectedly (default: `true`). */
  reconnect?: boolean;
  /** Reconnect delay in ms (default: `2000`). */
  reconnectIntervalMs?: number;
  /** Max reconnect attempts (default: `5`). */
  maxReconnectAttempts?: number;
  /** Optional callback for incoming messages. */
  onMessage?: (event: MessageEvent) => void;
}

export interface UseWebSocketReturn {
  status: WebSocketStatus;
  lastMessage: string | null;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean;
  close: () => void;
  reconnect: () => void;
}

/**
 * Manages a `WebSocket` connection with automatic reconnect backoff,
 * `send()`, `close()`, and `lastMessage` tracking. Pass `url = null` to stay idle.
 *
 * @param url - WebSocket endpoint URL (`ws://` or `wss://`), or `null`.
 * @param options - Reconnect settings and `onMessage` handler.
 * @returns `{ status, lastMessage, send, close, reconnect }`.
 */
export function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    reconnect: shouldReconnect = true,
    reconnectIntervalMs = 2000,
    maxReconnectAttempts = 5,
    onMessage,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>(
    url ? "connecting" : "idle"
  );
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [connectTrigger, setConnectTrigger] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const manualCloseRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url || typeof window === "undefined" || typeof WebSocket === "undefined") {
      setStatus("idle");
      return;
    }

    manualCloseRef.current = false;
    setStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      attemptsRef.current = 0;
      setStatus("open");
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        setLastMessage(event.data);
      }
      onMessageRef.current?.(event);
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("closed");
      wsRef.current = null;

      if (
        !manualCloseRef.current &&
        shouldReconnect &&
        attemptsRef.current < maxReconnectAttempts
      ) {
        attemptsRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          setConnectTrigger((c) => c + 1);
        }, reconnectIntervalMs);
      }
    };

    return () => {
      manualCloseRef.current = true;
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
      }
      ws.close();
      wsRef.current = null;
    };
  }, [url, shouldReconnect, reconnectIntervalMs, maxReconnectAttempts, connectTrigger]);

  const send = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data);
        return true;
      }
      return false;
    },
    []
  );

  const close = useCallback(() => {
    manualCloseRef.current = true;
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    wsRef.current?.close();
  }, []);

  const reconnect = useCallback(() => {
    attemptsRef.current = 0;
    setConnectTrigger((c) => c + 1);
  }, []);

  return { status, lastMessage, send, close, reconnect };
}
