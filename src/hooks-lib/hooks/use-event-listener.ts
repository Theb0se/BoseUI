"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Attaches an event listener to `window`, `document`, or a DOM element ref
 * in an SSR-safe manner. Automatically cleans up on unmount and uses a ref
 * for the handler to avoid stale closures and unnecessary re-attachments.
 *
 * @param eventName - The DOM event name to listen for.
 * @param handler - Event handler callback.
 * @param element - Target ref (defaults to `window` when omitted).
 * @param options - Standard `addEventListener` options.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document | null>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement | Document = HTMLElement,
>(
  eventName: KW | KH | KD,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | DocumentEventMap[KD]
      | Event
  ) => void,
  element?: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const targetElement: T | Window | null = element
      ? element.current
      : window;

    if (!targetElement || !targetElement.addEventListener) return;

    const listener: EventListener = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName as string, listener, options);

    return () => {
      targetElement.removeEventListener(eventName as string, listener, options);
    };
  }, [eventName, element, options]);
}
