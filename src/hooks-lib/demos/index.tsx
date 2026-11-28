"use client";

import React from "react";
import { UseDebounceDemo } from "./use-debounce.demo";
import { UseDebouncedCallbackDemo } from "./use-debounced-callback.demo";
import { UseThrottleDemo } from "./use-throttle.demo";
import { UseLocalStorageDemo } from "./use-local-storage.demo";
import { UseToggleDemo } from "./use-toggle.demo";
import { UsePreviousDemo } from "./use-previous.demo";
import { UseMediaQueryDemo } from "./use-media-query.demo";
import { UseClickOutsideDemo } from "./use-click-outside.demo";
import { UseEventListenerDemo } from "./use-event-listener.demo";
import { UseCopyToClipboardDemo } from "./use-copy-to-clipboard.demo";
import { UseIntersectionObserverDemo } from "./use-intersection-observer.demo";
import { UseDisclosureDemo } from "./use-disclosure.demo";
import { UseSessionStorageDemo } from "./use-session-storage.demo";
import { UseCounterDemo } from "./use-counter.demo";
import { UseUndoRedoDemo } from "./use-undo-redo.demo";
import { UseMapDemo } from "./use-map.demo";
import { UseSetDemo } from "./use-set.demo";
import { UseListDemo } from "./use-list.demo";
import { UseStateHistoryDemo } from "./use-state-history.demo";
import { UseCookieDemo } from "./use-cookie.demo";
import { UseQueryStateDemo } from "./use-query-state.demo";
import { UseIntervalDemo } from "./use-interval.demo";
import { UseTimeoutDemo } from "./use-timeout.demo";
import { UseCountdownDemo } from "./use-countdown.demo";
import { UseStopwatchDemo } from "./use-stopwatch.demo";
import { UseIdleDemo } from "./use-idle.demo";
import { UseRafStateDemo } from "./use-raf-state.demo";
import { UseThrottledCallbackDemo } from "./use-throttled-callback.demo";
import { UseDeferredValueDemo } from "./use-deferred-value.demo";
import { UseBreakpointDemo } from "./use-breakpoint.demo";
import { UseHoverDemo } from "./use-hover.demo";
import { UseFocusWithinDemo } from "./use-focus-within.demo";
import { UseFocusTrapDemo } from "./use-focus-trap.demo";
import { UseScrollPositionDemo } from "./use-scroll-position.demo";
import { UseScrollLockDemo } from "./use-scroll-lock.demo";
import { UseScrollDirectionDemo } from "./use-scroll-direction.demo";
import { UseKeyPressDemo } from "./use-key-press.demo";
import { UseHotkeysDemo } from "./use-hotkeys.demo";
import { UseOnlineStatusDemo } from "./use-online-status.demo";
import { UsePageVisibilityDemo } from "./use-page-visibility.demo";
import { UseDocumentTitleDemo } from "./use-document-title.demo";
import { UseFaviconDemo } from "./use-favicon.demo";
import { UseLockBodyScrollDemo } from "./use-lock-body-scroll.demo";
import { UseFullscreenDemo } from "./use-fullscreen.demo";
import { UseTextSelectionDemo } from "./use-text-selection.demo";
import { UseLongPressDemo } from "./use-long-press.demo";
import { UseSwipeDemo } from "./use-swipe.demo";
import { UseMousePositionDemo } from "./use-mouse-position.demo";
import { UseWindowSizeDemo } from "./use-window-size.demo";
import { UseResizeObserverDemo } from "./use-resize-observer.demo";
import { UseMutationObserverDemo } from "./use-mutation-observer.demo";
import { UseElementSizeDemo } from "./use-element-size.demo";
import { UseInViewDemo } from "./use-in-view.demo";
import { UseGeolocationDemo } from "./use-geolocation.demo";
import { UseBatteryDemo } from "./use-battery.demo";
import { UseNetworkStatusDemo } from "./use-network-status.demo";
import { UseOrientationDemo } from "./use-orientation.demo";
import { UsePreferredColorSchemeDemo } from "./use-preferred-color-scheme.demo";
import { UsePrefersReducedMotionDemo } from "./use-prefers-reduced-motion.demo";
import { UseClipboardDemo } from "./use-clipboard.demo";
import { UseSpeechRecognitionDemo } from "./use-speech-recognition.demo";
import { UseSpeechSynthesisDemo } from "./use-speech-synthesis.demo";
import { UseFetchDemo } from "./use-fetch.demo";
import { UseAsyncDemo } from "./use-async.demo";
import { UseMutationDemo } from "./use-mutation.demo";
import { UseInfiniteScrollDemo } from "./use-infinite-scroll.demo";
import { UsePaginationDemo } from "./use-pagination.demo";
import { UsePollingDemo } from "./use-polling.demo";
import { UseOptimisticDemo } from "./use-optimistic.demo";
import { UseWebSocketDemo } from "./use-web-socket.demo";
import { UseEventSourceDemo } from "./use-event-source.demo";
import { UseSearchDemo } from "./use-search.demo";
import { UseQueueDemo } from "./use-queue.demo";

export const HOOK_DEMOS: Record<string, React.ComponentType> = {
  "use-debounce": UseDebounceDemo,
  "use-debounced-callback": UseDebouncedCallbackDemo,
  "use-throttle": UseThrottleDemo,
  "use-local-storage": UseLocalStorageDemo,
  "use-toggle": UseToggleDemo,
  "use-previous": UsePreviousDemo,
  "use-media-query": UseMediaQueryDemo,
  "use-click-outside": UseClickOutsideDemo,
  "use-event-listener": UseEventListenerDemo,
  "use-copy-to-clipboard": UseCopyToClipboardDemo,
  "use-intersection-observer": UseIntersectionObserverDemo,
  "use-disclosure": UseDisclosureDemo,
  "use-session-storage": UseSessionStorageDemo,
  "use-counter": UseCounterDemo,
  "use-undo-redo": UseUndoRedoDemo,
  "use-map": UseMapDemo,
  "use-set": UseSetDemo,
  "use-list": UseListDemo,
  "use-state-history": UseStateHistoryDemo,
  "use-cookie": UseCookieDemo,
  "use-query-state": UseQueryStateDemo,
  "use-interval": UseIntervalDemo,
  "use-timeout": UseTimeoutDemo,
  "use-countdown": UseCountdownDemo,
  "use-stopwatch": UseStopwatchDemo,
  "use-idle": UseIdleDemo,
  "use-raf-state": UseRafStateDemo,
  "use-throttled-callback": UseThrottledCallbackDemo,
  "use-deferred-value": UseDeferredValueDemo,
  "use-breakpoint": UseBreakpointDemo,
  "use-hover": UseHoverDemo,
  "use-focus-within": UseFocusWithinDemo,
  "use-focus-trap": UseFocusTrapDemo,
  "use-scroll-position": UseScrollPositionDemo,
  "use-scroll-lock": UseScrollLockDemo,
  "use-scroll-direction": UseScrollDirectionDemo,
  "use-key-press": UseKeyPressDemo,
  "use-hotkeys": UseHotkeysDemo,
  "use-online-status": UseOnlineStatusDemo,
  "use-page-visibility": UsePageVisibilityDemo,
  "use-document-title": UseDocumentTitleDemo,
  "use-favicon": UseFaviconDemo,
  "use-lock-body-scroll": UseLockBodyScrollDemo,
  "use-fullscreen": UseFullscreenDemo,
  "use-text-selection": UseTextSelectionDemo,
  "use-long-press": UseLongPressDemo,
  "use-swipe": UseSwipeDemo,
  "use-mouse-position": UseMousePositionDemo,
  "use-window-size": UseWindowSizeDemo,
  "use-resize-observer": UseResizeObserverDemo,
  "use-mutation-observer": UseMutationObserverDemo,
  "use-element-size": UseElementSizeDemo,
  "use-in-view": UseInViewDemo,
  "use-geolocation": UseGeolocationDemo,
  "use-battery": UseBatteryDemo,
  "use-network-status": UseNetworkStatusDemo,
  "use-orientation": UseOrientationDemo,
  "use-preferred-color-scheme": UsePreferredColorSchemeDemo,
  "use-prefers-reduced-motion": UsePrefersReducedMotionDemo,
  "use-clipboard": UseClipboardDemo,
  "use-speech-recognition": UseSpeechRecognitionDemo,
  "use-speech-synthesis": UseSpeechSynthesisDemo,
  "use-fetch": UseFetchDemo,
  "use-async": UseAsyncDemo,
  "use-mutation": UseMutationDemo,
  "use-infinite-scroll": UseInfiniteScrollDemo,
  "use-pagination": UsePaginationDemo,
  "use-polling": UsePollingDemo,
  "use-optimistic": UseOptimisticDemo,
  "use-web-socket": UseWebSocketDemo,
  "use-event-source": UseEventSourceDemo,
  "use-search": UseSearchDemo,
  "use-queue": UseQueueDemo,
};

export function HookDemoRenderer({ slug }: { slug: string }) {
  const Demo = HOOK_DEMOS[slug];
  if (!Demo) {
    return (
      <div className="text-xs text-neutral-400">
        No interactive demo available for {slug}.
      </div>
    );
  }
  return <Demo />;
}
