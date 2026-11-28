import type { HookMeta } from "./types";

export const HOOKS_REGISTRY: HookMeta[] = [
  {
    slug: "use-debounce",
    name: "useDebounce",
    description:
      "Delays updating a reactive value until a specified wait time has elapsed since the last change. Ideal for search inputs, API filtering, and expensive derived computations.",
    category: "Timing",
    tags: ["debounce", "search", "performance", "timer"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 671,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-debounce.ts",
    params: [
      {
        name: "value",
        type: "T",
        required: true,
        description: "The reactive value to debounce.",
      },
      {
        name: "delay",
        type: "number",
        default: "300",
        description: "Debounce wait time in milliseconds.",
      },
    ],
    returns: [
      {
        name: "debouncedValue",
        type: "T",
        description: "The latest value after the debounce delay has elapsed.",
      },
    ],
    examples: [
      {
        title: "Debounced Search Query",
        code: `import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchUsers() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(\`/api/users?q=\${encodeURIComponent(debouncedQuery)}\`);
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search users..."
    />
  );
}`,
      },
    ],
    notes: [
      "Negative delay values are clamped to 0ms.",
      "Pending timers are automatically cleared on unmount or when value/delay changes.",
      "SSR-safe: returns the initial value synchronously without touching browser timers during render.",
    ],
  },
  {
    slug: "use-debounced-callback",
    name: "useDebouncedCallback",
    description:
      "Creates a debounced callback with .cancel() and .flush() controls. Uses a ref for the latest callback so changing dependencies never reset an active timer or cause stale closures.",
    category: "Timing",
    tags: ["debounce", "callback", "flush", "cancel"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2351,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-debounced-callback.ts",
    params: [
      {
        name: "callback",
        type: "(...args: TArgs) => void",
        required: true,
        description: "The function to debounce.",
      },
      {
        name: "delay",
        type: "number",
        default: "300",
        description: "Wait time in milliseconds before invoking callback.",
      },
    ],
    returns: [
      {
        name: "debouncedFn",
        type: "DebouncedFunction<TArgs>",
        description:
          "Stable debounced function exposing .cancel() and .flush() methods.",
      },
    ],
    examples: [
      {
        title: "Auto-save Editor with Flush",
        code: `import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function DraftEditor() {
  const saveDraft = useDebouncedCallback((content: string) => {
    console.log("Saved draft:", content);
  }, 500);

  return (
    <div>
      <textarea onChange={(e) => saveDraft(e.target.value)} />
      <button onClick={() => saveDraft.flush()}>Save Now</button>
    </div>
  );
}`,
      },
    ],
    notes: [
      "Always invokes the latest callback reference without resetting the pending timer.",
      "Call .flush() before form submission or route transitions to commit pending work immediately.",
      "Pending timers are cleared automatically when the component unmounts.",
    ],
  },
  {
    slug: "use-throttle",
    name: "useThrottle",
    description:
      "Limits how often a reactive value updates to at most once per specified interval while guaranteeing the trailing update is emitted.",
    category: "Timing",
    tags: ["throttle", "scroll", "mousemove", "rate-limit"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1114,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-throttle.ts",
    params: [
      {
        name: "value",
        type: "T",
        required: true,
        description: "The reactive value to throttle.",
      },
      {
        name: "interval",
        type: "number",
        default: "300",
        description: "Minimum milliseconds between updates.",
      },
    ],
    returns: [
      {
        name: "throttledValue",
        type: "T",
        description: "The rate-limited value.",
      },
    ],
    examples: [
      {
        title: "Throttled Pointer Coordinates",
        code: `import { useState } from "react";
import { useThrottle } from "@/hooks/use-throttle";

export function PointerTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const throttledPos = useThrottle(pos, 200);

  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {throttledPos.x}, {throttledPos.y}
    </div>
  );
}`,
      },
    ],
    notes: [
      "Guarantees the final trailing value is emitted after rapid bursts stop.",
      "Clears any scheduled trailing timeout on unmount.",
      "Prefer useThrottle over useDebounce for continuous feedback like scroll or drag telemetry.",
    ],
  },
  {
    slug: "use-local-storage",
    name: "useLocalStorage",
    description:
      "Persists React state in window.localStorage with SSR-safe hydration, cross-tab synchronization via storage events, and resilient error handling.",
    category: "State",
    tags: ["storage", "persistence", "ssr-safe", "tabs"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2753,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-local-storage.ts",
    params: [
      {
        name: "key",
        type: "string",
        required: true,
        description: "The localStorage key to read and write.",
      },
      {
        name: "initialValue",
        type: "T",
        required: true,
        description: "Fallback value used during SSR and when storage is empty.",
      },
    ],
    returns: [
      {
        name: "[0] storedValue",
        type: "T",
        description: "The current persisted or fallback state value.",
      },
      {
        name: "[1] setValue",
        type: "(value: T | ((prev: T) => T)) => void",
        description: "Updates React state and writes JSON to localStorage.",
      },
      {
        name: "[2] removeValue",
        type: "() => void",
        description: "Removes the key from localStorage and resets to initialValue.",
      },
    ],
    examples: [
      {
        title: "Persisted User Preferences",
        code: `import { useLocalStorage } from "@/hooks/use-local-storage";

export function SidebarPreference() {
  const [collapsed, setCollapsed, reset] = useLocalStorage("sidebar-collapsed", false);

  return (
    <div>
      <button onClick={() => setCollapsed((prev) => !prev)}>
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
      },
    ],
    notes: [
      "Never reads window.localStorage during initial render, preventing Next.js hydration mismatches.",
      "Gracefully catches SecurityError (blocked storage in private browsing), QuotaExceededError, and malformed JSON.",
      "Automatically syncs state when another browser tab modifies the same key.",
    ],
  },
  {
    slug: "use-toggle",
    name: "useToggle",
    description:
      "Manages boolean state with a stable toggle handler that flips the value or accepts an explicit boolean override.",
    category: "State",
    tags: ["boolean", "switch", "state"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 768,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-toggle.ts",
    params: [
      {
        name: "initialValue",
        type: "boolean",
        default: "false",
        description: "Initial boolean state.",
      },
    ],
    returns: [
      {
        name: "[0] value",
        type: "boolean",
        description: "Current boolean state.",
      },
      {
        name: "[1] toggle",
        type: "(nextValue?: boolean) => void",
        description: "Flips state when called without arguments, or sets nextValue.",
      },
      {
        name: "[2] setValue",
        type: "(value: boolean) => void",
        description: "Direct state setter.",
      },
    ],
    examples: [
      {
        title: "Toggle Switch",
        code: `import { useToggle } from "@/hooks/use-toggle";

export function MuteButton() {
  const [muted, toggleMuted] = useToggle(false);

  return (
    <button onClick={() => toggleMuted()}>
      {muted ? "Unmute" : "Mute"}
    </button>
  );
}`,
      },
    ],
    notes: [
      "Pass toggle directly or wrap in () => toggle() when used as a DOM click handler so MouseEvent is not mistaken for a truthy value.",
      "The toggle function reference is memoized with useCallback and never changes.",
    ],
  },
  {
    slug: "use-previous",
    name: "usePrevious",
    description:
      "Captures and returns the value from the previous committed render, returning undefined on the initial mount.",
    category: "State",
    tags: ["ref", "history", "diff"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 509,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-previous.ts",
    params: [
      {
        name: "value",
        type: "T",
        required: true,
        description: "The current render value to track.",
      },
    ],
    returns: [
      {
        name: "previousValue",
        type: "T | undefined",
        description: "The value from the previous render, or undefined initially.",
      },
    ],
    examples: [
      {
        title: "Detecting Counter Direction",
        code: `import { useState } from "react";
import { usePrevious } from "@/hooks/use-previous";

export function TrendCounter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <span>Now: {count} (was {prevCount ?? "—"})</span>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}`,
      },
    ],
    notes: [
      "Updates inside useEffect after render completes so it always reflects the previous committed render.",
      "Safe under React 18 Strict Mode double-invocation.",
    ],
  },
  {
    slug: "use-media-query",
    name: "useMediaQuery",
    description:
      "Subscribes to a CSS media query via window.matchMedia in an SSR-safe manner and reacts live to viewport or preference changes.",
    category: "DOM & Events",
    tags: ["responsive", "matchMedia", "breakpoint", "ssr-safe"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1363,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-media-query.ts",
    params: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Valid CSS media query string.",
      },
      {
        name: "defaultValue",
        type: "boolean",
        default: "false",
        description: "Value returned during SSR and initial hydration.",
      },
    ],
    returns: [
      {
        name: "matches",
        type: "boolean",
        description: "Whether the media query currently matches.",
      },
    ],
    examples: [
      {
        title: "Responsive Layout Switch",
        code: `import { useMediaQuery } from "@/hooks/use-media-query";

export function ResponsiveNav() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return isDesktop ? <DesktopNav /> : <MobileDrawer />;
}`,
      },
    ],
    notes: [
      "Always renders defaultValue on the server and initial client pass to guarantee zero hydration mismatch.",
      "Includes legacy addListener/removeListener fallback for older Safari versions.",
    ],
  },
  {
    slug: "use-click-outside",
    name: "useClickOutside",
    description:
      "Detects mousedown or touchstart events outside one or more target element refs. Ideal for closing dropdowns, popovers, and custom menus.",
    category: "DOM & Events",
    tags: ["popover", "dropdown", "outside-click", "ref"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1628,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-click-outside.ts",
    params: [
      {
        name: "ref",
        type: "RefObject<T | null> | Array<RefObject<T | null>>",
        required: true,
        description: "Element ref (or array of refs) considered inside.",
      },
      {
        name: "handler",
        type: "(event: MouseEvent | TouchEvent) => void",
        required: true,
        description: "Callback fired when an outside interaction occurs.",
      },
      {
        name: "enabled",
        type: "boolean",
        default: "true",
        description: "Toggles listener attachment (e.g. pass isOpen).",
      },
    ],
    returns: [
      {
        name: "void",
        type: "void",
        description: "Registers and cleans up document listeners automatically.",
      },
    ],
    examples: [
      {
        title: "Dismissible Popover",
        code: `import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

export function Popover() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setOpen(false), open);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <div ref={panelRef}>Popover Content</div>}
    </div>
  );
}`,
      },
    ],
    notes: [
      "Pass `enabled={isOpen}` so document listeners are only attached while the overlay is open.",
      "Accepts an array of refs so both a trigger button and a floating portal panel can be treated as inside.",
      "Ignores disconnected DOM nodes removed during the same event tick.",
    ],
  },
  {
    slug: "use-event-listener",
    name: "useEventListener",
    description:
      "Declaratively attaches typed DOM event listeners to window, document, or an element ref with automatic cleanup and ref-stabilized handlers.",
    category: "DOM & Events",
    tags: ["events", "keyboard", "window", "listener"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2362,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-event-listener.ts",
    params: [
      {
        name: "eventName",
        type: "K",
        required: true,
        description: "DOM event name (inferred from target map).",
      },
      {
        name: "handler",
        type: "(event: EventMap[K]) => void",
        required: true,
        description: "Event callback invoked when event fires.",
      },
      {
        name: "element",
        type: "RefObject<T | null>",
        default: "window",
        description: "Optional element or document ref; defaults to window.",
      },
      {
        name: "options",
        type: "boolean | AddEventListenerOptions",
        description: "Optional capture/passive/once listener options.",
      },
    ],
    returns: [
      {
        name: "void",
        type: "void",
        description: "Handles listener lifecycle automatically.",
      },
    ],
    examples: [
      {
        title: "Escape Key Shortcut",
        code: `import { useEventListener } from "@/hooks/use-event-listener";

export function Modal({ onClose }: { onClose: () => void }) {
  useEventListener("keydown", (event) => {
    if (event.key === "Escape") onClose();
  });

  return <div>Press Escape to close</div>;
}`,
      },
    ],
    notes: [
      "Handler is stored in a ref so inline arrow functions never cause listener detach/re-attach churn.",
      "Overloaded TypeScript signatures provide full event type inference for window, document, and HTMLElement refs.",
    ],
  },
  {
    slug: "use-copy-to-clipboard",
    name: "useCopyToClipboard",
    description:
      "Copies strings to the clipboard using the async Clipboard API with a safe execCommand fallback and timed reset feedback.",
    category: "Utilities",
    tags: ["clipboard", "copy", "feedback"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2872,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-copy-to-clipboard.ts",
    params: [
      {
        name: "resetDelay",
        type: "number",
        default: "2000",
        description: "Milliseconds before isCopied resets to false.",
      },
    ],
    returns: [
      {
        name: "copiedText",
        type: "string | null",
        description: "The last successfully copied string.",
      },
      {
        name: "isCopied",
        type: "boolean",
        description: "True during the resetDelay feedback window.",
      },
      {
        name: "copy",
        type: "(text: string) => Promise<boolean>",
        description: "Copies the provided string and returns success boolean.",
      },
      {
        name: "reset",
        type: "() => void",
        description: "Manually resets isCopied and copiedText.",
      },
    ],
    examples: [
      {
        title: "Copy Button with Feedback",
        code: `import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function CopyToken({ token }: { token: string }) {
  const { isCopied, copy } = useCopyToClipboard(1500);

  return (
    <button onClick={() => copy(token)}>
      {isCopied ? "Copied!" : "Copy Token"}
    </button>
  );
}`,
      },
    ],
    notes: [
      "Falls back to a hidden readonly textarea + execCommand('copy') when navigator.clipboard is unavailable.",
      "Clears pending reset timers on unmount to avoid state updates on unmounted components.",
    ],
  },
  {
    slug: "use-intersection-observer",
    name: "useIntersectionObserver",
    description:
      "Observes element visibility within the viewport or a scrollable container using IntersectionObserver, with optional freezeOnceVisible support.",
    category: "DOM & Events",
    tags: ["observer", "viewport", "lazy-load", "scroll"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2208,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-intersection-observer.ts",
    params: [
      {
        name: "ref",
        type: "RefObject<T | null>",
        required: true,
        description: "Ref to the DOM element to observe.",
      },
      {
        name: "options",
        type: "UseIntersectionObserverOptions",
        default: "{}",
        description: "root, rootMargin, threshold, and freezeOnceVisible.",
      },
    ],
    returns: [
      {
        name: "entry",
        type: "IntersectionObserverEntry | null",
        description: "Latest IntersectionObserverEntry object.",
      },
      {
        name: "isIntersecting",
        type: "boolean",
        description: "Convenience boolean derived from entry.isIntersecting.",
      },
    ],
    examples: [
      {
        title: "Animate Once on Scroll",
        code: `import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export function RevealBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(ref, {
    threshold: 0.2,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref} style={{ opacity: isIntersecting ? 1 : 0 }}>
      Revealed!
    </div>
  );
}`,
      },
    ],
    notes: [
      "Set freezeOnceVisible: true for one-shot reveal animations or lazy-loaded media.",
      "Disconnects the observer cleanly on unmount or when frozen.",
    ],
  },
  {
    slug: "use-disclosure",
    name: "useDisclosure",
    description:
      "Standardizes open, close, and toggle state for modals, drawers, sheets, and accordions with support for both controlled and uncontrolled usage.",
    category: "State",
    tags: ["modal", "drawer", "disclosure", "controlled"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2306,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-disclosure.ts",
    params: [
      {
        name: "options",
        type: "UseDisclosureOptions",
        default: "{}",
        description:
          "defaultOpen, controlled isOpen, onOpen, onClose, and onOpenChange.",
      },
    ],
    returns: [
      {
        name: "isOpen",
        type: "boolean",
        description: "Current open state.",
      },
      {
        name: "open",
        type: "() => void",
        description: "Opens the disclosure if currently closed.",
      },
      {
        name: "close",
        type: "() => void",
        description: "Closes the disclosure if currently open.",
      },
      {
        name: "toggle",
        type: "() => void",
        description: "Toggles between open and closed.",
      },
    ],
    examples: [
      {
        title: "Controlled or Uncontrolled Modal",
        code: `import { useDisclosure } from "@/hooks/use-disclosure";

export function DeleteDialog() {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <button onClick={open}>Delete Account</button>
      {isOpen && (
        <div role="dialog">
          <p>Are you sure?</p>
          <button onClick={close}>Cancel</button>
        </div>
      )}
    </>
  );
}`,
      },
    ],
    notes: [
      "Avoids duplicate onOpen/onClose calls when already in the target state.",
      "Callbacks are stored in refs so open, close, and toggle identities stay stable across renders.",
    ],
  },
  {
    slug: "use-session-storage",
    name: "useSessionStorage",
    description:
      "Persists React state in window.sessionStorage scoped to the current browser tab, with SSR-safe hydration and resilient error handling.",
    category: "State",
    tags: ["session", "storage", "tab", "ssr-safe"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2002,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-session-storage.ts",
    params: [
      {
        name: "key",
        type: "string",
        required: true,
        description: "The sessionStorage key.",
      },
      {
        name: "initialValue",
        type: "T",
        required: true,
        description: "Fallback value used during SSR and when empty.",
      },
    ],
    returns: [
      { name: "[0] storedValue", type: "T", description: "Current persisted or fallback value." },
      { name: "[1] setValue", type: "(value: T | ((prev: T) => T)) => void", description: "Updates state and writes JSON to sessionStorage." },
      { name: "[2] removeValue", type: "() => void", description: "Deletes the key and resets to initialValue." },
    ],
    examples: [
      {
        title: "Tab-Scoped Wizard Draft",
        code: `import { useSessionStorage } from "@/hooks/use-session-storage";

export function StepForm() {
  const [draft, setDraft] = useSessionStorage("checkout-draft", "");
  return <input value={draft} onChange={(e) => setDraft(e.target.value)} />;
}`,
      },
    ],
    notes: [
      "Hydrates inside useEffect so SSR HTML never mismatches client storage.",
      "Catches blocked storage and malformed JSON gracefully.",
    ],
  },
  {
    slug: "use-counter",
    name: "useCounter",
    description:
      "Manages numeric counter state with increment, decrement, reset, and set actions plus optional min, max, and step bounds.",
    category: "State",
    tags: ["counter", "number", "clamp", "step"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1938,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-counter.ts",
    params: [
      { name: "initialValue", type: "number", default: "0", description: "Starting numeric value." },
      { name: "options", type: "UseCounterOptions", default: "{}", description: "Optional min, max, and step configuration." },
    ],
    returns: [
      { name: "count", type: "number", description: "Current clamped count." },
      { name: "increment", type: "(by?: number) => void", description: "Increments by step or custom amount." },
      { name: "decrement", type: "(by?: number) => void", description: "Decrements by step or custom amount." },
      { name: "reset", type: "() => void", description: "Resets back to initialValue." },
      { name: "set", type: "(value: number | ((prev: number) => number)) => void", description: "Sets and clamps the count." },
    ],
    examples: [
      {
        title: "Bounded Quantity Selector",
        code: `import { useCounter } from "@/hooks/use-counter";

export function QuantityPicker() {
  const { count, increment, decrement } = useCounter(1, { min: 1, max: 10 });
  return (
    <div>
      <button onClick={() => decrement()}>-</button>
      <span>{count}</span>
      <button onClick={() => increment()}>+</button>
    </div>
  );
}`,
      },
    ],
    notes: ["All updates are automatically clamped between min and max when provided."],
  },
  {
    slug: "use-undo-redo",
    name: "useUndoRedo",
    description:
      "Provides state with full undo/redo history stacks, boolean availability flags, and configurable maximum history capacity.",
    category: "State",
    tags: ["undo", "redo", "history", "editor"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2672,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-undo-redo.ts",
    params: [
      { name: "initialPresent", type: "T", required: true, description: "Initial state value." },
      { name: "maxHistory", type: "number", default: "50", description: "Maximum number of past snapshots to retain." },
    ],
    returns: [
      { name: "state", type: "T", description: "Current active state." },
      { name: "set", type: "(next: T | ((prev: T) => T)) => void", description: "Pushes a new state and clears future." },
      { name: "undo", type: "() => void", description: "Steps backward in history." },
      { name: "redo", type: "() => void", description: "Steps forward in future stack." },
      { name: "reset", type: "(newInitialState?: T) => void", description: "Clears past/future and resets state." },
      { name: "canUndo", type: "boolean", description: "True if past stack is non-empty." },
      { name: "canRedo", type: "boolean", description: "True if future stack is non-empty." },
    ],
    examples: [
      {
        title: "Undoable Canvas Color",
        code: `import { useUndoRedo } from "@/hooks/use-undo-redo";

export function ColorHistory() {
  const { state, set, undo, redo, canUndo, canRedo } = useUndoRedo("#0d9488");
  return (
    <div>
      <button disabled={!canUndo} onClick={undo}>Undo</button>
      <button disabled={!canRedo} onClick={redo}>Redo</button>
      <button onClick={() => set("#2563eb")}>Blue ({state})</button>
    </div>
  );
}`,
      },
    ],
    notes: ["Skips pushing duplicate consecutive entries using Object.is equality."],
  },
  {
    slug: "use-map",
    name: "useMap",
    description:
      "Manages an ES6 Map in React state with immutable set, setAll, remove, clear, and reset helper methods.",
    category: "State",
    tags: ["map", "collection", "dictionary", "state"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1498,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-map.ts",
    params: [
      { name: "initialEntries", type: "Iterable<readonly [K, V]>", default: "[]", description: "Initial key-value pairs." },
    ],
    returns: [
      { name: "[0] map", type: "ReadonlyMap<K, V>", description: "Readonly Map instance." },
      { name: "[1] actions", type: "UseMapActions<K, V>", description: "{ set, setAll, remove, clear, reset }." },
    ],
    examples: [
      {
        title: "Key-Value Settings Map",
        code: `import { useMap } from "@/hooks/use-map";

export function ConfigEditor() {
  const [map, actions] = useMap([["theme", "dark"]]);
  return (
    <button onClick={() => actions.set("theme", "light")}>
      Theme: {map.get("theme")}
    </button>
  );
}`,
      },
    ],
    notes: ["Always clones the Map before mutating so React detects reference changes reliably."],
  },
  {
    slug: "use-set",
    name: "useSet",
    description:
      "Manages an ES6 Set in React state with immutable add, remove, toggle, clear, and reset helper methods.",
    category: "State",
    tags: ["set", "collection", "tags", "selection"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1592,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-set.ts",
    params: [
      { name: "initialValues", type: "Iterable<T>", default: "[]", description: "Initial values in the Set." },
    ],
    returns: [
      { name: "[0] set", type: "ReadonlySet<T>", description: "Readonly Set instance." },
      { name: "[1] actions", type: "UseSetActions<T>", description: "{ add, remove, toggle, clear, reset }." },
    ],
    examples: [
      {
        title: "Multi-Select Filter Chips",
        code: `import { useSet } from "@/hooks/use-set";

export function TagSelector() {
  const [selected, { toggle }] = useSet<string>(["react"]);
  return (
    <button onClick={() => toggle("react")}>
      React ({selected.has("react") ? "Selected" : "Unselected"})
    </button>
  );
}`,
      },
    ],
    notes: ["Avoids unnecessary re-renders when adding an existing item or removing a missing item."],
  },
  {
    slug: "use-list",
    name: "useList",
    description:
      "Manages array state with clean, immutable push, removeAt, updateAt, insertAt, filter, clear, and reset helpers.",
    category: "State",
    tags: ["array", "list", "crud", "state"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1871,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-list.ts",
    params: [
      { name: "initialList", type: "T[]", default: "[]", description: "Initial array items." },
    ],
    returns: [
      { name: "[0] list", type: "T[]", description: "Current array state." },
      { name: "[1] actions", type: "UseListActions<T>", description: "{ set, push, removeAt, updateAt, insertAt, filter, clear, reset }." },
    ],
    examples: [
      {
        title: "Todo List Helpers",
        code: `import { useList } from "@/hooks/use-list";

export function TodoList() {
  const [items, { push, removeAt }] = useList(["Ship hooks"]);
  return (
    <button onClick={() => push("Write tests")}>
      Count: {items.length}
    </button>
  );
}`,
      },
    ],
    notes: ["All action functions are memoized with useCallback and maintain stable identities."],
  },
  {
    slug: "use-state-history",
    name: "useStateHistory",
    description:
      "Tracks a linear history of state values with back, forward, and go(index) rewind navigation.",
    category: "State",
    tags: ["history", "rewind", "timeline", "state"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2748,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-state-history.ts",
    params: [
      { name: "initialValue", type: "T", required: true, description: "Initial state value." },
      { name: "capacity", type: "number", default: "25", description: "Maximum number of history snapshots." },
    ],
    returns: [
      { name: "value", type: "T", description: "Current value at pointer." },
      { name: "set", type: "(next: T | ((prev: T) => T)) => void", description: "Appends a new state entry." },
      { name: "history", type: "T[]", description: "Full array of recorded snapshots." },
      { name: "pointer", type: "number", description: "Active index inside history." },
      { name: "back", type: "(steps?: number) => void", description: "Rewinds by steps." },
      { name: "forward", type: "(steps?: number) => void", description: "Advances by steps." },
      { name: "go", type: "(index: number) => void", description: "Jumps directly to a history index." },
    ],
    examples: [
      {
        title: "Rewindable Step State",
        code: `import { useStateHistory } from "@/hooks/use-state-history";

export function Stepper() {
  const { value, set, back, go, canBack } = useStateHistory("Draft");
  return (
    <div>
      <span>{value}</span>
      <button disabled={!canBack} onClick={() => back()}>Back</button>
      <button onClick={() => go(0)}>Rewind to Start</button>
    </div>
  );
}`,
      },
    ],
    notes: ["Setting a new value while rewound truncates any forward history after the pointer."],
  },
  {
    slug: "use-cookie",
    name: "useCookie",
    description:
      "Reads, writes, and deletes browser cookies in an SSR-safe manner with SameSite, path, and expiration options.",
    category: "Utilities",
    tags: ["cookie", "storage", "ssr-safe", "auth"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2418,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-cookie.ts",
    params: [
      { name: "name", type: "string", required: true, description: "Cookie name." },
      { name: "defaultValue", type: "string", default: '""', description: "Fallback value before mount or when absent." },
    ],
    returns: [
      { name: "[0] value", type: "string", description: "Current cookie value." },
      { name: "[1] setCookie", type: "(newValue: string, options?: UseCookieOptions) => void", description: "Writes cookie to document.cookie." },
      { name: "[2] deleteCookie", type: "() => void", description: "Expires the cookie and resets state." },
    ],
    examples: [
      {
        title: "Persisted Theme Cookie",
        code: `import { useCookie } from "@/hooks/use-cookie";

export function ThemeCookie() {
  const [theme, setTheme, deleteTheme] = useCookie("theme", "system");
  return <button onClick={() => setTheme("dark", { days: 30 })}>{theme}</button>;
}`,
      },
    ],
    notes: ["Reads document.cookie only inside useEffect to prevent SSR hydration mismatches."],
  },
  {
    slug: "use-query-state",
    name: "useQueryState",
    description:
      "Synchronizes a state value with URL query search parameters using the History API, with automatic cleanup when reset to default.",
    category: "Utilities",
    tags: ["url", "search-params", "query", "state"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2023,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-query-state.ts",
    params: [
      { name: "key", type: "string", required: true, description: "URL search parameter key." },
      { name: "defaultValue", type: "string", default: '""', description: "Fallback value when param is missing." },
      { name: "options", type: "UseQueryStateOptions", default: "{ replace: true }", description: "Controls replaceState vs pushState." },
    ],
    returns: [
      { name: "[0] value", type: "string", description: "Current query parameter value." },
      { name: "[1] setQueryValue", type: "(nextValue: string | null) => void", description: "Updates state and URL searchParams." },
    ],
    examples: [
      {
        title: "URL-Synced Filter Tab",
        code: `import { useQueryState } from "@/hooks/use-query-state";

export function FilterBar() {
  const [tab, setTab] = useQueryState("tab", "all");
  return <button onClick={() => setTab("active")}>Active ({tab})</button>;
}`,
      },
    ],
    notes: ["Listens to popstate events so browser Back/Forward buttons keep state in sync."],
  },
  {
    slug: "use-interval",
    name: "useInterval",
    description:
      "Declarative setInterval hook with automatic cleanup, pause support (delay = null), and ref-stabilized callback execution.",
    category: "Timing",
    tags: ["interval", "timer", "polling", "pause"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 770,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-interval.ts",
    params: [
      { name: "callback", type: "() => void", required: true, description: "Function called on every tick." },
      { name: "delay", type: "number | null", required: true, description: "Interval in ms, or null to pause." },
    ],
    returns: [
      { name: "void", type: "void", description: "Manages interval lifecycle automatically." },
    ],
    examples: [
      {
        title: "Pausable Polling Timer",
        code: `import { useState } from "react";
import { useInterval } from "@/hooks/use-interval";

export function Poller() {
  const [count, setCount] = useState(0);
  useInterval(() => setCount((c) => c + 1), 1000);
  return <span>Ticks: {count}</span>;
}`,
      },
    ],
    notes: ["Pass delay={null} to pause the interval without losing component state."],
  },
  {
    slug: "use-timeout",
    name: "useTimeout",
    description:
      "Schedules a timeout callback with imperative reset() and clear() controls and automatic cleanup on unmount.",
    category: "Timing",
    tags: ["timeout", "timer", "delay", "reset"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1242,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-timeout.ts",
    params: [
      { name: "callback", type: "() => void", required: true, description: "Callback invoked after delay." },
      { name: "delay", type: "number | null", required: true, description: "Delay in ms, or null to disable." },
    ],
    returns: [
      { name: "reset", type: "() => void", description: "Clears and reschedules the timeout." },
      { name: "clear", type: "() => void", description: "Cancels any pending timeout." },
    ],
    examples: [
      {
        title: "Auto-Dismiss Banner",
        code: `import { useTimeout } from "@/hooks/use-timeout";

export function AutoDismiss({ onHide }: { onHide: () => void }) {
  const { clear } = useTimeout(onHide, 3000);
  return <button onClick={clear}>Keep Open</button>;
}`,
      },
    ],
    notes: ["Changing callback does not restart the active timeout thanks to ref storage."],
  },
  {
    slug: "use-countdown",
    name: "useCountdown",
    description:
      "Countdown timer hook with start, pause, reset controls, configurable tick interval, and an onComplete callback.",
    category: "Timing",
    tags: ["countdown", "timer", "otp", "resend"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2182,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-countdown.ts",
    params: [
      { name: "initialCount", type: "number", required: true, description: "Starting count value." },
      { name: "options", type: "UseCountdownOptions", default: "{}", description: "intervalMs, autoStart, and onComplete." },
    ],
    returns: [
      { name: "count", type: "number", description: "Remaining count." },
      { name: "isRunning", type: "boolean", description: "Whether the countdown is active." },
      { name: "start", type: "() => void", description: "Starts or resumes the countdown." },
      { name: "pause", type: "() => void", description: "Pauses the countdown." },
      { name: "reset", type: "(nextInitial?: number) => void", description: "Stops and resets count." },
    ],
    examples: [
      {
        title: "Resend OTP Timer",
        code: `import { useCountdown } from "@/hooks/use-countdown";

export function ResendButton() {
  const { count, isRunning, reset, start } = useCountdown(30, { autoStart: true });
  return (
    <button disabled={isRunning} onClick={() => { reset(30); start(); }}>
      {isRunning ? \`Resend in \${count}s\` : "Resend Code"}
    </button>
  );
}`,
      },
    ],
    notes: ["Automatically stops at 0 and invokes onComplete once."],
  },
  {
    slug: "use-stopwatch",
    name: "useStopwatch",
    description:
      "High-accuracy elapsed time tracker in milliseconds with start, pause, and reset controls.",
    category: "Timing",
    tags: ["stopwatch", "elapsed", "timer", "duration"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1760,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-stopwatch.ts",
    params: [
      { name: "intervalMs", type: "number", default: "50", description: "Display update interval in milliseconds." },
    ],
    returns: [
      { name: "elapsedMs", type: "number", description: "Total elapsed milliseconds." },
      { name: "isRunning", type: "boolean", description: "Whether the stopwatch is running." },
      { name: "start", type: "() => void", description: "Starts or resumes counting." },
      { name: "pause", type: "() => void", description: "Pauses and preserves elapsedMs." },
      { name: "reset", type: "() => void", description: "Stops and resets elapsedMs to 0." },
    ],
    examples: [
      {
        title: "Workout Timer",
        code: `import { useStopwatch } from "@/hooks/use-stopwatch";

export function Timer() {
  const { elapsedMs, start, pause, reset } = useStopwatch();
  return <div>{(elapsedMs / 1000).toFixed(1)}s</div>;
}`,
      },
    ],
    notes: ["Calculates elapsed delta from Date.now() timestamps rather than accumulating interval ticks, preventing drift."],
  },
  {
    slug: "use-idle",
    name: "useIdle",
    description:
      "Detects user inactivity after a configurable timeout across pointer, keyboard, touch, and scroll events.",
    category: "Timing",
    tags: ["idle", "inactivity", "session", "timeout"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1461,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-idle.ts",
    params: [
      { name: "timeoutMs", type: "number", default: "5000", description: "Inactivity duration in milliseconds." },
      { name: "events", type: "Array<keyof WindowEventMap>", default: "DEFAULT_EVENTS", description: "Events that reset the idle timer." },
    ],
    returns: [
      { name: "isIdle", type: "boolean", description: "True when no activity occurred within timeoutMs." },
    ],
    examples: [
      {
        title: "Session Idle Indicator",
        code: `import { useIdle } from "@/hooks/use-idle";

export function StatusBadge() {
  const isIdle = useIdle(60_000);
  return <span>{isIdle ? "Away" : "Active"}</span>;
}`,
      },
    ],
    notes: ["Attaches passive window listeners and cleans up all timers and listeners on unmount."],
  },
  {
    slug: "use-raf-state",
    name: "useRafState",
    description:
      "Batches state updates onto requestAnimationFrame so high-frequency events only trigger at most one React update per frame.",
    category: "Timing",
    tags: ["raf", "animation-frame", "performance", "batch"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1211,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-raf-state.ts",
    params: [
      { name: "initialState", type: "T | (() => T)", required: true, description: "Initial state value." },
    ],
    returns: [
      { name: "[0] state", type: "T", description: "Current frame-synced state." },
      { name: "[1] setRafState", type: "(value: T | ((prev: T) => T)) => void", description: "Schedules a state update for the next animation frame." },
    ],
    examples: [
      {
        title: "Frame-Synced Pointer Coordinates",
        code: `import { useRafState } from "@/hooks/use-raf-state";

export function CanvasTracker() {
  const [pos, setPos] = useRafState({ x: 0, y: 0 });
  return <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>{pos.x}</div>;
}`,
      },
    ],
    notes: ["Cancels any pending requestAnimationFrame handle on unmount."],
  },
  {
    slug: "use-throttled-callback",
    name: "useThrottledCallback",
    description:
      "Callback counterpart to useThrottle that limits invocations to at most once per interval with a guaranteed trailing call.",
    category: "Timing",
    tags: ["throttle", "callback", "rate-limit", "performance"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2057,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-throttled-callback.ts",
    params: [
      { name: "callback", type: "(...args: TArgs) => void", required: true, description: "Callback function to throttle." },
      { name: "interval", type: "number", default: "300", description: "Minimum milliseconds between executions." },
    ],
    returns: [
      { name: "throttledFn", type: "ThrottledFunction<TArgs>", description: "Throttled callback exposing .cancel()." },
    ],
    examples: [
      {
        title: "Throttled Resize Handler",
        code: `import { useThrottledCallback } from "@/hooks/use-throttled-callback";

export function AnalyticsButton() {
  const logClick = useThrottledCallback(() => console.log("Clicked"), 1000);
  return <button onClick={logClick}>Track</button>;
}`,
      },
    ],
    notes: ["Always invokes the latest callback reference and cancels pending trailing timers on unmount."],
  },
  {
    slug: "use-deferred-value",
    name: "useDeferredValue",
    description:
      "Wrapper around React's useDeferredValue that returns both the deferredValue and an isStale boolean for pending UI feedback.",
    category: "State",
    tags: ["concurrent", "search", "filter", "performance"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 812,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-deferred-value.ts",
    params: [
      { name: "value", type: "T", required: true, description: "Urgent value to defer for heavy downstream rendering." },
    ],
    returns: [
      { name: "deferredValue", type: "T", description: "Deferred value from React." },
      { name: "isStale", type: "boolean", description: "True while deferredValue lags behind value." },
    ],
    examples: [
      {
        title: "Deferred Heavy List Search",
        code: `import { useState } from "react";
import { useDeferredValue } from "@/hooks/use-deferred-value";

export function BigList({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const { deferredValue, isStale } = useDeferredValue(query);
  return <div style={{ opacity: isStale ? 0.6 : 1 }}>{deferredValue}</div>;
}`,
      },
    ],
    notes: ["Uses Object.is to compare urgent and deferred values accurately."],
  },
  {
    slug: "use-breakpoint",
    name: "useBreakpoint",
    description:
      "Returns the active Tailwind CSS viewport breakpoint ('base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') in an SSR-safe manner.",
    category: "DOM & Events",
    tags: ["tailwind", "responsive", "breakpoint", "viewport"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1273,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-breakpoint.ts",
    params: [
      { name: "defaultBreakpoint", type: "TailwindBreakpoint", default: '"base"', description: "Initial breakpoint before hydration." },
    ],
    returns: [
      { name: "breakpoint", type: "TailwindBreakpoint", description: "Current Tailwind breakpoint key." },
    ],
    examples: [
      {
        title: "Adaptive Grid Columns",
        code: `import { useBreakpoint } from "@/hooks/use-breakpoint";

export function ResponsiveLabel() {
  const bp = useBreakpoint();
  return <span>Current breakpoint: {bp}</span>;
}`,
      },
    ],
    notes: ["Matches Tailwind's default breakpoints: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)."],
  },
  {
    slug: "use-hover",
    name: "useHover",
    description:
      "Tracks pointer hover state for a referenced DOM element using mouseenter and mouseleave listeners.",
    category: "DOM & Events",
    tags: ["hover", "mouse", "ref", "interaction"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 998,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-hover.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref attached to the target DOM element." },
    ],
    returns: [
      { name: "isHovered", type: "boolean", description: "True while the pointer is over the element." },
    ],
    examples: [
      {
        title: "Hover Card Indicator",
        code: `import { useRef } from "react";
import { useHover } from "@/hooks/use-hover";

export function HoverCard() {
  const ref = useRef<HTMLDivElement>(null);
  const hovered = useHover(ref);
  return <div ref={ref}>{hovered ? "Hovered" : "Idle"}</div>;
}`,
      },
    ],
    notes: ["Uses mouseenter/mouseleave rather than mouseover/mouseout so child elements do not cause flicker."],
  },
  {
    slug: "use-focus-within",
    name: "useFocusWithin",
    description:
      "Tracks whether keyboard or pointer focus is currently inside a container element or any of its descendants.",
    category: "DOM & Events",
    tags: ["focus", "a11y", "form", "container"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1151,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-focus-within.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the container element." },
    ],
    returns: [
      { name: "isFocusWithin", type: "boolean", description: "True when focus is inside the container." },
    ],
    examples: [
      {
        title: "Active Fieldset Highlight",
        code: `import { useRef } from "react";
import { useFocusWithin } from "@/hooks/use-focus-within";

export function SearchGroup() {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useFocusWithin(ref);
  return <div ref={ref} data-focused={focused}><input /></div>;
}`,
      },
    ],
    notes: ["Checks event.relatedTarget on focusout to avoid false blurs when moving between child inputs."],
  },
  {
    slug: "use-focus-trap",
    name: "useFocusTrap",
    description:
      "Traps Tab and Shift+Tab keyboard focus inside a container while active, and restores focus to the trigger element on close.",
    category: "DOM & Events",
    tags: ["focus-trap", "a11y", "modal", "dialog"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2252,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-focus-trap.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the modal or dialog container." },
      { name: "active", type: "boolean", default: "true", description: "Whether the focus trap is enabled." },
    ],
    returns: [
      { name: "void", type: "void", description: "Manages focus cycling and restoration automatically." },
    ],
    examples: [
      {
        title: "Accessible Modal Trap",
        code: `import { useRef } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function Dialog({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  return open ? <div ref={ref} role="dialog"><button>Close</button></div> : null;
}`,
      },
    ],
    notes: ["Restores focus to document.activeElement from before the trap activated."],
  },
  {
    slug: "use-scroll-position",
    name: "useScrollPosition",
    description:
      "Tracks live x and y scroll offsets for the window or a specific scrollable container ref.",
    category: "DOM & Events",
    tags: ["scroll", "offset", "window", "container"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1202,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-scroll-position.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", description: "Optional scrollable container ref (defaults to window)." },
    ],
    returns: [
      { name: "x", type: "number", description: "Horizontal scroll offset in pixels." },
      { name: "y", type: "number", description: "Vertical scroll offset in pixels." },
    ],
    examples: [
      {
        title: "Sticky Header Shadow",
        code: `import { useScrollPosition } from "@/hooks/use-scroll-position";

export function Header() {
  const { y } = useScrollPosition();
  return <header className={y > 20 ? "shadow-md" : ""}>Navbar</header>;
}`,
      },
    ],
    notes: ["Uses passive scroll listeners and starts at { x: 0, y: 0 } during SSR."],
  },
  {
    slug: "use-scroll-lock",
    name: "useScrollLock",
    description:
      "Locks and unlocks document.body scrolling with scrollbar-width padding compensation to prevent layout shift.",
    category: "DOM & Events",
    tags: ["scroll-lock", "modal", "overflow", "body"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1464,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-scroll-lock.ts",
    params: [
      { name: "initialLocked", type: "boolean", default: "false", description: "Whether scroll begins locked." },
    ],
    returns: [
      { name: "isLocked", type: "boolean", description: "Current lock state." },
      { name: "lock", type: "() => void", description: "Locks body scroll." },
      { name: "unlock", type: "() => void", description: "Restores body scroll." },
    ],
    examples: [
      {
        title: "Drawer Scroll Control",
        code: `import { useScrollLock } from "@/hooks/use-scroll-lock";

export function DrawerToggle() {
  const { isLocked, lock, unlock } = useScrollLock();
  return <button onClick={isLocked ? unlock : lock}>Toggle Lock</button>;
}`,
      },
    ],
    notes: ["Restores original overflow and paddingRight styles automatically on unmount."],
  },
  {
    slug: "use-scroll-direction",
    name: "useScrollDirection",
    description:
      "Detects whether the user is scrolling 'up' or 'down' once scroll delta exceeds a configurable pixel threshold.",
    category: "DOM & Events",
    tags: ["scroll", "direction", "navbar", "hide-on-scroll"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1095,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-scroll-direction.ts",
    params: [
      { name: "threshold", type: "number", default: "8", description: "Minimum pixel delta before updating direction." },
    ],
    returns: [
      { name: "direction", type: '"up" | "down" | null', description: "Detected scroll direction, or null initially." },
    ],
    examples: [
      {
        title: "Auto-Hiding Top Bar",
        code: `import { useScrollDirection } from "@/hooks/use-scroll-direction";

export function SmartHeader() {
  const dir = useScrollDirection(10);
  return <header className={dir === "down" ? "-translate-y-full" : ""}>Nav</header>;
}`,
      },
    ],
    notes: ["Threshold prevents jitter from micro-scrolls or rubber-band overscroll."],
  },
  {
    slug: "use-key-press",
    name: "useKeyPress",
    description:
      "Detects whether a single keyboard key is currently pressed down, with automatic reset on window blur.",
    category: "DOM & Events",
    tags: ["keyboard", "key", "press", "input"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1344,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-key-press.ts",
    params: [
      { name: "targetKey", type: "string", required: true, description: "KeyboardEvent.key string to watch (case-insensitive)." },
    ],
    returns: [
      { name: "pressed", type: "boolean", description: "True while the target key is held down." },
    ],
    examples: [
      {
        title: "Shift Key Modifier Check",
        code: `import { useKeyPress } from "@/hooks/use-key-press";

export function DeleteButton() {
  const shiftHeld = useKeyPress("Shift");
  return <button>{shiftHeld ? "Force Delete" : "Delete"}</button>;
}`,
      },
    ],
    notes: ["Resets state on window blur so keys never remain stuck if focus leaves the tab."],
  },
  {
    slug: "use-hotkeys",
    name: "useHotkeys",
    description:
      "Listens for keyboard shortcut combinations like 'mod+k', 'ctrl+shift+p', or 'escape' with automatic input-field ignoring.",
    category: "DOM & Events",
    tags: ["hotkey", "shortcut", "cmd+k", "keyboard"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2836,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-hotkeys.ts",
    params: [
      { name: "combo", type: "string", required: true, description: "Key combination such as 'mod+k' or 'ctrl+shift+s'." },
      { name: "handler", type: "(event: KeyboardEvent) => void", required: true, description: "Callback fired when shortcut matches." },
      { name: "options", type: "UseHotkeysOptions", default: "{}", description: "preventDefault, ignoreInputs, and enabled." },
    ],
    returns: [
      { name: "void", type: "void", description: "Registers and cleans up global keydown listener." },
    ],
    examples: [
      {
        title: "Command Palette Shortcut",
        code: `import { useHotkeys } from "@/hooks/use-hotkeys";

export function PaletteTrigger({ onOpen }: { onOpen: () => void }) {
  useHotkeys("mod+k", () => onOpen());
  return <kbd>⌘K</kbd>;
}`,
      },
    ],
    notes: ["'mod' automatically maps to Cmd (Meta) on macOS and Ctrl on Windows/Linux."],
  },
  {
    slug: "use-online-status",
    name: "useOnlineStatus",
    description:
      "Tracks browser network connectivity using navigator.onLine and online/offline window events.",
    category: "Utilities",
    tags: ["network", "online", "offline", "pwa"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 909,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-online-status.ts",
    params: [],
    returns: [
      { name: "isOnline", type: "boolean", description: "True when the browser reports network connectivity." },
    ],
    examples: [
      {
        title: "Offline Warning Banner",
        code: `import { useOnlineStatus } from "@/hooks/use-online-status";

export function NetworkBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return <div>You are currently offline.</div>;
}`,
      },
    ],
    notes: ["Defaults to true during SSR and syncs with navigator.onLine on mount."],
  },
  {
    slug: "use-page-visibility",
    name: "usePageVisibility",
    description:
      "Tracks whether the current browser tab is visible or hidden using the Page Visibility API.",
    category: "Utilities",
    tags: ["visibility", "tab", "polling", "pause"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 808,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-page-visibility.ts",
    params: [],
    returns: [
      { name: "isVisible", type: "boolean", description: "True when document.visibilityState === 'visible'." },
    ],
    examples: [
      {
        title: "Pause Video When Tab Hidden",
        code: `import { usePageVisibility } from "@/hooks/use-page-visibility";

export function LiveFeed() {
  const visible = usePageVisibility();
  return <span>{visible ? "Live" : "Paused"}</span>;
}`,
      },
    ],
    notes: ["Ideal for pausing background polling, animations, or media playback when tabs are inactive."],
  },
  {
    slug: "use-document-title",
    name: "useDocumentTitle",
    description:
      "Sets document.title declaratively from any component and optionally restores the prior title on unmount.",
    category: "Utilities",
    tags: ["title", "head", "document", "seo"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 947,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-document-title.ts",
    params: [
      { name: "title", type: "string", required: true, description: "New document.title string." },
      { name: "restoreOnUnmount", type: "boolean", default: "false", description: "Restore previous title on unmount." },
    ],
    returns: [
      { name: "void", type: "void", description: "Updates document.title inside useEffect." },
    ],
    examples: [
      {
        title: "Unread Notification Count in Title",
        code: `import { useDocumentTitle } from "@/hooks/use-document-title";

export function InboxTitle({ unread }: { unread: number }) {
  useDocumentTitle(unread > 0 ? \`(\${unread}) Inbox\` : "Inbox", true);
  return null;
}`,
      },
    ],
    notes: ["Only accesses document inside useEffect so it is safe during SSR."],
  },
  {
    slug: "use-favicon",
    name: "useFavicon",
    description:
      "Dynamically updates the document favicon (<link rel='icon'>) to reflect status badges, themes, or notifications.",
    category: "Utilities",
    tags: ["favicon", "head", "icon", "notification"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 635,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-favicon.ts",
    params: [
      { name: "href", type: "string", required: true, description: "URL or data URI for the favicon." },
    ],
    returns: [
      { name: "void", type: "void", description: "Updates or creates the icon link tag." },
    ],
    examples: [
      {
        title: "Dynamic Status Favicon",
        code: `import { useFavicon } from "@/hooks/use-favicon";

export function BuildStatus({ failed }: { failed: boolean }) {
  useFavicon(failed ? "/favicon-error.png" : "/favicon.ico");
  return null;
}`,
      },
    ],
    notes: ["Supports standard image URLs as well as inline SVG data URIs."],
  },
  {
    slug: "use-lock-body-scroll",
    name: "useLockBodyScroll",
    description:
      "Locks background body scrolling while mounted (or while locked is true) using useLayoutEffect and restores original overflow on cleanup.",
    category: "DOM & Events",
    tags: ["scroll", "modal", "overlay", "body"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 687,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-lock-body-scroll.ts",
    params: [
      { name: "locked", type: "boolean", default: "true", description: "Whether body scroll is locked." },
    ],
    returns: [
      { name: "void", type: "void", description: "Locks and restores document.body.style.overflow." },
    ],
    examples: [
      {
        title: "Overlay Scroll Lock",
        code: `import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

export function FullscreenMenu() {
  useLockBodyScroll();
  return <nav>Menu</nav>;
}`,
      },
    ],
    notes: ["Captures the computed overflow value before locking so nested locks restore cleanly."],
  },
  {
    slug: "use-fullscreen",
    name: "useFullscreen",
    description:
      "Controls the browser Fullscreen API with enter, exit, and toggle helpers plus live isFullscreen state tracking.",
    category: "DOM & Events",
    tags: ["fullscreen", "video", "presentation", "dom"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1879,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-fullscreen.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", description: "Optional element ref (defaults to document.documentElement)." },
    ],
    returns: [
      { name: "isFullscreen", type: "boolean", description: "True while an element is in fullscreen mode." },
      { name: "enter", type: "() => Promise<void>", description: "Requests fullscreen on target." },
      { name: "exit", type: "() => Promise<void>", description: "Exits fullscreen mode." },
      { name: "toggle", type: "() => Promise<void>", description: "Toggles fullscreen state." },
    ],
    examples: [
      {
        title: "Fullscreen Video Container",
        code: `import { useRef } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

export function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useFullscreen(ref);
  return <div ref={ref}><button onClick={toggle}>{isFullscreen ? "Exit" : "Expand"}</button></div>;
}`,
      },
    ],
    notes: ["Gracefully catches permission errors if called outside a user gesture."],
  },
  {
    slug: "use-text-selection",
    name: "useTextSelection",
    description:
      "Tracks the currently highlighted text selection on the page via document.getSelection() and selectionchange events.",
    category: "DOM & Events",
    tags: ["selection", "highlight", "text", "clipboard"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 816,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-text-selection.ts",
    params: [],
    returns: [
      { name: "selection", type: "string", description: "Currently selected text string." },
    ],
    examples: [
      {
        title: "Selection Word Counter",
        code: `import { useTextSelection } from "@/hooks/use-text-selection";

export function SelectionBadge() {
  const text = useTextSelection();
  if (!text) return null;
  return <span>{text.length} chars selected</span>;
}`,
      },
    ],
    notes: ["Returns an empty string during SSR and when nothing is highlighted."],
  },
  {
    slug: "use-long-press",
    name: "useLongPress",
    description:
      "Detects long-press gestures across mouse and touch devices and returns event handlers to spread onto any element.",
    category: "DOM & Events",
    tags: ["gesture", "long-press", "touch", "pointer"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2385,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-long-press.ts",
    params: [
      { name: "callback", type: "() => void", required: true, description: "Fired when press exceeds thresholdMs." },
      { name: "options", type: "UseLongPressOptions", default: "{}", description: "thresholdMs (default 500), onStart, and onCancel." },
    ],
    returns: [
      { name: "handlers", type: "UseLongPressHandlers", description: "Mouse and touch handlers to spread onto the element." },
    ],
    examples: [
      {
        title: "Hold to Trigger Action",
        code: `import { useLongPress } from "@/hooks/use-long-press";

export function HoldButton() {
  const handlers = useLongPress(() => alert("Triggered!"), { thresholdMs: 600 });
  return <button {...handlers}>Hold Me</button>;
}`,
      },
    ],
    notes: ["Cleans up pending timers automatically if the component unmounts mid-press."],
  },
  {
    slug: "use-swipe",
    name: "useSwipe",
    description:
      "Detects directional swipe gestures (left, right, up, down) across touch and pointer events with configurable distance threshold.",
    category: "DOM & Events",
    tags: ["swipe", "gesture", "touch", "mobile"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2749,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-swipe.ts",
    params: [
      { name: "options", type: "UseSwipeOptions", default: "{}", description: "threshold (default 40px) and directional callbacks." },
    ],
    returns: [
      { name: "handlers", type: "UseSwipeHandlers", description: "Touch and pointer handlers to spread onto a container." },
    ],
    examples: [
      {
        title: "Swipeable Card Deck",
        code: `import { useSwipe } from "@/hooks/use-swipe";

export function SwipeArea() {
  const handlers = useSwipe({
    onSwipeLeft: () => console.log("Next"),
    onSwipeRight: () => console.log("Prev"),
  });
  return <div {...handlers}>Swipe here</div>;
}`,
      },
    ],
    notes: ["Set touch-none (touch-action: none) on the target element for reliable vertical swipe detection on touchscreens."],
  },
  {
    slug: "use-mouse-position",
    name: "useMousePosition",
    description:
      "Tracks cursor coordinates (x, y) relative to the viewport or relative to an optional target element ref.",
    category: "DOM & Events",
    tags: ["mouse", "cursor", "coordinates", "pointer"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1357,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-mouse-position.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", description: "Optional element ref for local relative coordinates." },
    ],
    returns: [
      { name: "x", type: "number", description: "Horizontal cursor coordinate in pixels." },
      { name: "y", type: "number", description: "Vertical cursor coordinate in pixels." },
    ],
    examples: [
      {
        title: "Local Spotlight Coordinates",
        code: `import { useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

export function SpotlightBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(ref);
  return <div ref={ref}>{x}, {y}</div>;
}`,
      },
    ],
    notes: ["Uses passive mousemove listeners and initializes to { x: 0, y: 0 } during SSR."],
  },
  {
    slug: "use-window-size",
    name: "useWindowSize",
    description:
      "Tracks the browser viewport width and height on resize in an SSR-safe manner.",
    category: "DOM & Events",
    tags: ["window", "viewport", "resize", "dimensions"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 837,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-window-size.ts",
    params: [],
    returns: [
      { name: "width", type: "number", description: "window.innerWidth in pixels." },
      { name: "height", type: "number", description: "window.innerHeight in pixels." },
    ],
    examples: [
      {
        title: "Viewport Dimensions Readout",
        code: `import { useWindowSize } from "@/hooks/use-window-size";

export function ViewportBadge() {
  const { width, height } = useWindowSize();
  return <span>{width} × {height}</span>;
}`,
      },
    ],
    notes: ["Starts at { width: 0, height: 0 } on the server and updates immediately on mount."],
  },
  {
    slug: "use-resize-observer",
    name: "useResizeObserver",
    description:
      "Observes element dimension changes via ResizeObserver, returning live width, height, and the latest ResizeObserverEntry.",
    category: "DOM & Events",
    tags: ["resize", "observer", "dimensions", "layout"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1531,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-resize-observer.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the observed DOM element." },
      { name: "onResize", type: "(entry: ResizeObserverEntry) => void", description: "Optional callback invoked on resize." },
    ],
    returns: [
      { name: "width", type: "number", description: "Observed contentRect width in pixels." },
      { name: "height", type: "number", description: "Observed contentRect height in pixels." },
      { name: "entry", type: "ResizeObserverEntry | null", description: "Latest ResizeObserverEntry." },
    ],
    examples: [
      {
        title: "Responsive Chart Container",
        code: `import { useRef } from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";

export function ChartWrapper() {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(ref);
  return <div ref={ref}>{width} × {height}</div>;
}`,
      },
    ],
    notes: ["Uses a ref for onResize so inline callbacks do not reconnect the observer."],
  },
  {
    slug: "use-mutation-observer",
    name: "useMutationObserver",
    description:
      "Detects DOM attribute, childList, and subtree mutations on a target node via MutationObserver.",
    category: "DOM & Events",
    tags: ["mutation", "observer", "dom", "attributes"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1372,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-mutation-observer.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the target DOM node." },
      { name: "callback", type: "(mutations: MutationRecord[]) => void", required: true, description: "Invoked when mutations occur." },
      { name: "options", type: "MutationObserverInit", default: "{ attributes: true, childList: true, subtree: true }", description: "MutationObserver configuration." },
    ],
    returns: [{ name: "void", type: "void", description: "Disconnects the observer automatically on unmount." }],
    examples: [
      {
        title: "Watch Child Node Changes",
        code: `import { useRef } from "react";
import { useMutationObserver } from "@/hooks/use-mutation-observer";

export function DomWatcher() {
  const ref = useRef<HTMLDivElement>(null);
  useMutationObserver(ref, (records) => console.log(records.length));
  return <div ref={ref} />;
}`,
      },
    ],
    notes: ["Callback is stored in a ref to prevent unnecessary observer teardown/re-observe cycles."],
  },
  {
    slug: "use-element-size",
    name: "useElementSize",
    description:
      "Measures the offsetWidth and offsetHeight of a referenced HTML element, staying synced via ResizeObserver and window resize.",
    category: "DOM & Events",
    tags: ["size", "width", "height", "measure"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1306,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-element-size.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the HTML element to measure." },
    ],
    returns: [
      { name: "width", type: "number", description: "Element offsetWidth in pixels." },
      { name: "height", type: "number", description: "Element offsetHeight in pixels." },
    ],
    examples: [
      {
        title: "Measure Card Dimensions",
        code: `import { useRef } from "react";
import { useElementSize } from "@/hooks/use-element-size";

export function MeasuredBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  return <div ref={ref}>{width}px × {height}px</div>;
}`,
      },
    ],
    notes: ["Falls back to window resize events if ResizeObserver is unavailable."],
  },
  {
    slug: "use-in-view",
    name: "useInView",
    description:
      "Lightweight boolean wrapper around IntersectionObserver with optional once-only trigger support.",
    category: "DOM & Events",
    tags: ["in-view", "intersection", "visibility", "scroll"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1741,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-in-view.ts",
    params: [
      { name: "ref", type: "RefObject<T | null>", required: true, description: "Ref to the target element." },
      { name: "options", type: "UseInViewOptions", default: "{}", description: "root, rootMargin, threshold, and once." },
    ],
    returns: [{ name: "inView", type: "boolean", description: "True when the element is intersecting." }],
    examples: [
      {
        title: "Reveal on Scroll",
        code: `import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";

export function FadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return <div ref={ref}>{inView ? "Visible" : "Hidden"}</div>;
}`,
      },
    ],
    notes: ["When once: true is set, disconnects the observer immediately after first intersection."],
  },
  {
    slug: "use-geolocation",
    name: "useGeolocation",
    description:
      "Retrieves or watches the user's geographic coordinates via navigator.geolocation with loading, error, and refresh controls.",
    category: "Utilities",
    tags: ["geolocation", "gps", "coordinates", "browser"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 3137,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-geolocation.ts",
    params: [
      { name: "options", type: "PositionOptions", default: "{}", description: "enableHighAccuracy, timeout, and maximumAge." },
      { name: "watch", type: "boolean", default: "false", description: "Continuously watch position updates." },
    ],
    returns: [
      { name: "latitude", type: "number | null", description: "Latitude in decimal degrees." },
      { name: "longitude", type: "number | null", description: "Longitude in decimal degrees." },
      { name: "loading", type: "boolean", description: "True while fetching coordinates." },
      { name: "error", type: "string | null", description: "Geolocation error message if denied/unavailable." },
      { name: "refresh", type: "() => void", description: "Imperatively requests current position." },
    ],
    examples: [
      {
        title: "On-Demand Location Lookup",
        code: `import { useGeolocation } from "@/hooks/use-geolocation";

export function LocationButton() {
  const { latitude, longitude, refresh } = useGeolocation();
  return <button onClick={refresh}>{latitude ?? "Get Location"}, {longitude}</button>;
}`,
      },
    ],
    notes: ["Does not prompt for permission on mount unless watch is true; call refresh() on user interaction."],
  },
  {
    slug: "use-battery",
    name: "useBattery",
    description:
      "Subscribes to the Battery Status API (navigator.getBattery) to track charge level and charging state.",
    category: "Utilities",
    tags: ["battery", "power", "device", "sensor"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2725,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-battery.ts",
    params: [],
    returns: [
      { name: "isSupported", type: "boolean", description: "True if navigator.getBattery is supported." },
      { name: "loading", type: "boolean", description: "True while reading initial battery state." },
      { name: "level", type: "number | null", description: "Battery level from 0.0 to 1.0." },
      { name: "charging", type: "boolean | null", description: "True when plugged in and charging." },
    ],
    examples: [
      {
        title: "Battery Level Indicator",
        code: `import { useBattery } from "@/hooks/use-battery";

export function BatteryBadge() {
  const { isSupported, level, charging } = useBattery();
  if (!isSupported || level === null) return null;
  return <span>{Math.round(level * 100)}% {charging ? "⚡" : ""}</span>;
}`,
      },
    ],
    notes: ["Battery Status API is primarily supported in Chromium-based browsers; gracefully reports isSupported: false elsewhere."],
  },
  {
    slug: "use-network-status",
    name: "useNetworkStatus",
    description:
      "Tracks online status plus connection effectiveType, downlink speed, RTT, and saveData via navigator.connection.",
    category: "Utilities",
    tags: ["network", "connection", "bandwidth", "offline"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1788,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-network-status.ts",
    params: [],
    returns: [
      { name: "online", type: "boolean", description: "Whether browser is online." },
      { name: "effectiveType", type: "string | null", description: "Connection type ('4g', '3g', '2g', 'slow-2g')." },
      { name: "downlink", type: "number | null", description: "Estimated bandwidth in Mbps." },
      { name: "rtt", type: "number | null", description: "Estimated round-trip time in ms." },
      { name: "saveData", type: "boolean | null", description: "True if reduced data usage mode is enabled." },
    ],
    examples: [
      {
        title: "Adaptive Video Quality",
        code: `import { useNetworkStatus } from "@/hooks/use-network-status";

export function QualityIndicator() {
  const { online, effectiveType } = useNetworkStatus();
  return <span>{online ? effectiveType ?? "online" : "offline"}</span>;
}`,
      },
    ],
    notes: ["Always reports online status reliably; Network Information fields are null on unsupported browsers."],
  },
  {
    slug: "use-orientation",
    name: "useOrientation",
    description:
      "Tracks device screen orientation angle and type via window.screen.orientation with a viewport aspect-ratio fallback.",
    category: "Utilities",
    tags: ["orientation", "portrait", "landscape", "mobile"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1490,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-orientation.ts",
    params: [],
    returns: [
      { name: "angle", type: "number", description: "Orientation angle in degrees (0, 90, 180, 270)." },
      { name: "type", type: "OrientationType", description: "'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'." },
    ],
    examples: [
      {
        title: "Orientation Display",
        code: `import { useOrientation } from "@/hooks/use-orientation";

export function OrientationBadge() {
  const { type, angle } = useOrientation();
  return <span>{type} ({angle}°)</span>;
}`,
      },
    ],
    notes: ["Falls back to comparing window.innerWidth and window.innerHeight when screen.orientation is unavailable."],
  },
  {
    slug: "use-preferred-color-scheme",
    name: "usePreferredColorScheme",
    description:
      "Detects the OS-level preferred color scheme ('light' or 'dark') using matchMedia in an SSR-safe manner.",
    category: "Utilities",
    tags: ["theme", "dark-mode", "color-scheme", "a11y"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1198,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-preferred-color-scheme.ts",
    params: [
      { name: "defaultScheme", type: '"light" | "dark"', default: '"light"', description: "Fallback scheme during SSR." },
    ],
    returns: [{ name: "scheme", type: '"light" | "dark"', description: "Current system color scheme." }],
    examples: [
      {
        title: "System Theme Listener",
        code: `import { usePreferredColorScheme } from "@/hooks/use-preferred-color-scheme";

export function SystemTheme() {
  const scheme = usePreferredColorScheme();
  return <span>System theme: {scheme}</span>;
}`,
      },
    ],
    notes: ["Includes legacy MediaQueryList.addListener fallback for older Safari versions."],
  },
  {
    slug: "use-prefers-reduced-motion",
    name: "usePrefersReducedMotion",
    description:
      "Subscribes to the (prefers-reduced-motion: reduce) media query for accessible motion fallbacks.",
    category: "Utilities",
    tags: ["a11y", "motion", "reduced-motion", "accessibility"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1111,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-prefers-reduced-motion.ts",
    params: [
      { name: "defaultReduced", type: "boolean", default: "false", description: "Initial value before hydration." },
    ],
    returns: [{ name: "reduced", type: "boolean", description: "True if user prefers reduced motion." }],
    examples: [
      {
        title: "Accessible Animation Guard",
        code: `import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function AnimatedCard() {
  const reduce = usePrefersReducedMotion();
  return <div className={reduce ? "" : "transition-transform duration-300"} />;
}`,
      },
    ],
    notes: ["Returns defaultReduced on the server to prevent hydration mismatches."],
  },
  {
    slug: "use-clipboard",
    name: "useClipboard",
    description:
      "Reads text from and writes text to the system clipboard via navigator.clipboard.readText and writeText.",
    category: "Utilities",
    tags: ["clipboard", "paste", "read", "write"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1816,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-clipboard.ts",
    params: [],
    returns: [
      { name: "text", type: "string | null", description: "Latest read or written clipboard text." },
      { name: "error", type: "string | null", description: "Permission or browser support error message." },
      { name: "read", type: "() => Promise<string | null>", description: "Reads text from the clipboard." },
      { name: "write", type: "(value: string) => Promise<boolean>", description: "Writes text to the clipboard." },
    ],
    examples: [
      {
        title: "Paste From Clipboard Button",
        code: `import { useClipboard } from "@/hooks/use-clipboard";

export function PasteButton() {
  const { text, read } = useClipboard();
  return <button onClick={read}>Paste: {text ?? "empty"}</button>;
}`,
      },
    ],
    notes: ["navigator.clipboard.readText() requires a secure HTTPS context and explicit user permission."],
  },
  {
    slug: "use-speech-recognition",
    name: "useSpeechRecognition",
    description:
      "Captures voice-to-text transcripts using the Web Speech Recognition API with start, stop, reset, and automatic abort on unmount.",
    category: "Utilities",
    tags: ["speech", "voice", "microphone", "transcript"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 3801,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-speech-recognition.ts",
    params: [
      { name: "options", type: "UseSpeechRecognitionOptions", default: "{}", description: "lang, continuous, and interimResults." },
    ],
    returns: [
      { name: "isSupported", type: "boolean", description: "True if SpeechRecognition is available." },
      { name: "isListening", type: "boolean", description: "True while microphone is active." },
      { name: "transcript", type: "string", description: "Recognized speech transcript." },
      { name: "error", type: "string | null", description: "Recognition error code if failed." },
      { name: "start", type: "() => void", description: "Starts listening." },
      { name: "stop", type: "() => void", description: "Stops listening." },
      { name: "reset", type: "() => void", description: "Clears transcript and error." },
    ],
    examples: [
      {
        title: "Voice Search Input",
        code: `import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export function VoiceMic() {
  const { isListening, transcript, start, stop } = useSpeechRecognition();
  return <button onClick={isListening ? stop : start}>{transcript || "Speak"}</button>;
}`,
      },
    ],
    notes: ["Automatically aborts active recognition sessions when the component unmounts."],
  },
  {
    slug: "use-speech-synthesis",
    name: "useSpeechSynthesis",
    description:
      "Speaks text aloud using the Web Speech Synthesis API (window.speechSynthesis), exposing voices, speak(), and cancel().",
    category: "Utilities",
    tags: ["speech", "tts", "audio", "accessibility"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2450,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-speech-synthesis.ts",
    params: [],
    returns: [
      { name: "isSupported", type: "boolean", description: "True if speechSynthesis is supported." },
      { name: "isSpeaking", type: "boolean", description: "True while utterance is playing." },
      { name: "voices", type: "SpeechSynthesisVoice[]", description: "Available system voices." },
      { name: "speak", type: "(text: string, options?: UseSpeechSynthesisOptions) => void", description: "Speaks the provided text." },
      { name: "cancel", type: "() => void", description: "Stops any active speech." },
    ],
    examples: [
      {
        title: "Read Aloud Button",
        code: `import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

export function ReadAloud() {
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  return <button onClick={() => (isSpeaking ? cancel() : speak("Hello!"))}>Read</button>;
}`,
      },
    ],
    notes: ["Cancels pending speech automatically on unmount."],
  },
  {
    slug: "use-fetch",
    name: "useFetch",
    description:
      "Fetches JSON with AbortController cancellation, configurable retries, and optional in-memory response caching.",
    category: "Data & Async",
    tags: ["fetch", "abort", "retry", "cache"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 3664,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-fetch.ts",
    params: [
      { name: "url", type: "string | null", required: true, description: "Request URL, or null to skip." },
      { name: "options", type: "UseFetchOptions", default: "{}", description: "RequestInit plus retries, retryDelayMs, cacheResponse, enabled." },
    ],
    returns: [
      { name: "data", type: "T | null", description: "Parsed JSON response." },
      { name: "error", type: "Error | null", description: "Error object if request failed." },
      { name: "loading", type: "boolean", description: "True while request is in flight." },
      { name: "refetch", type: "() => void", description: "Clears cache for URL and re-fetches." },
      { name: "abort", type: "() => void", description: "Aborts the current request." },
    ],
    examples: [
      {
        title: "Cached API Fetch with Retry",
        code: `import { useFetch } from "@/hooks/use-fetch";

export function UserProfile() {
  const { data, loading, error } = useFetch<{ name: string }>("/api/me", {
    retries: 2,
    cacheResponse: true,
  });
  if (loading) return <span>Loading...</span>;
  if (error) return <span>{error.message}</span>;
  return <span>{data?.name}</span>;
}`,
      },
    ],
    notes: ["Automatically aborts in-flight fetch calls when url changes or the component unmounts."],
  },
  {
    slug: "use-async",
    name: "useAsync",
    description:
      "Executes any async function with loading, data, error, and status state while preventing race conditions.",
    category: "Data & Async",
    tags: ["async", "promise", "loading", "error"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2355,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-async.ts",
    params: [
      { name: "asyncFunction", type: "(...args: TArgs) => Promise<T>", required: true, description: "Async function to execute." },
      { name: "immediate", type: "boolean", default: "false", description: "Run immediately on mount." },
    ],
    returns: [
      { name: "execute", type: "(...args: TArgs) => Promise<T | null>", description: "Invokes the async function." },
      { name: "status", type: '"idle" | "pending" | "success" | "error"', description: "Current lifecycle status." },
      { name: "loading", type: "boolean", description: "True while status === 'pending'." },
      { name: "data", type: "T | null", description: "Resolved value." },
      { name: "error", type: "Error | null", description: "Rejected error." },
      { name: "reset", type: "() => void", description: "Resets back to idle." },
    ],
    examples: [
      {
        title: "Imperative Async Action",
        code: `import { useAsync } from "@/hooks/use-async";

export function ExportButton() {
  const { execute, loading } = useAsync(async () => fetch("/api/export"));
  return <button disabled={loading} onClick={() => execute()}>Export</button>;
}`,
      },
    ],
    notes: ["Tracks invocation IDs so stale overlapping promises never overwrite newer results."],
  },
  {
    slug: "use-mutation",
    name: "useMutation",
    description:
      "Handles imperative POST/PUT/DELETE mutations with loading, error, isSuccess, and onSuccess/onError/onSettled callbacks.",
    category: "Data & Async",
    tags: ["mutation", "post", "put", "form"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2958,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-mutation.ts",
    params: [
      { name: "mutationFn", type: "(variables: TVariables) => Promise<TData>", required: true, description: "Async mutation function." },
      { name: "options", type: "UseMutationOptions<TData, TVariables>", default: "{}", description: "onSuccess, onError, and onSettled callbacks." },
    ],
    returns: [
      { name: "mutate", type: "(variables: TVariables) => Promise<TData | null>", description: "Triggers the mutation." },
      { name: "data", type: "TData | null", description: "Latest mutation result." },
      { name: "error", type: "Error | null", description: "Error if mutation failed." },
      { name: "loading", type: "boolean", description: "True while mutation is running." },
      { name: "isSuccess", type: "boolean", description: "True after successful completion." },
      { name: "reset", type: "() => void", description: "Resets mutation state." },
    ],
    examples: [
      {
        title: "Create Item Mutation",
        code: `import { useMutation } from "@/hooks/use-mutation";

export function CreateTodo() {
  const { mutate, loading } = useMutation((title: string) =>
    fetch("/api/todos", { method: "POST", body: JSON.stringify({ title }) })
  );
  return <button disabled={loading} onClick={() => mutate("New")}>Add</button>;
}`,
      },
    ],
    notes: ["Guards state updates with a mounted ref so unmounted components never trigger warnings."],
  },
  {
    slug: "use-infinite-scroll",
    name: "useInfiniteScroll",
    description:
      "Observes a sentinel element via IntersectionObserver and triggers onLoadMore when the user reaches the end of a list.",
    category: "Data & Async",
    tags: ["infinite-scroll", "pagination", "feed", "observer"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1768,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-infinite-scroll.ts",
    params: [
      { name: "sentinelRef", type: "RefObject<T | null>", required: true, description: "Ref attached to bottom sentinel element." },
      { name: "onLoadMore", type: "() => void", required: true, description: "Callback invoked to load the next page." },
      { name: "options", type: "UseInfiniteScrollOptions", required: true, description: "hasMore, isLoading, rootMargin, and root." },
    ],
    returns: [{ name: "void", type: "void", description: "Manages IntersectionObserver lifecycle automatically." }],
    examples: [
      {
        title: "Infinite Feed Sentinel",
        code: `import { useRef } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export function Feed({ hasMore, loadMore }: { hasMore: boolean; loadMore: () => void }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(sentinelRef, loadMore, { hasMore });
  return <div ref={sentinelRef} />;
}`,
      },
    ],
    notes: ["Automatically pauses observation when hasMore is false or isLoading is true."],
  },
  {
    slug: "use-pagination",
    name: "usePagination",
    description:
      "Manages pagination state with next, prev, first, last, startIndex/endIndex bounds, and an ellipsis-aware range array.",
    category: "Data & Async",
    tags: ["pagination", "page", "range", "table"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 3093,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-pagination.ts",
    params: [
      { name: "options", type: "UsePaginationOptions", required: true, description: "totalItems, pageSize, initialPage, and siblingCount." },
    ],
    returns: [
      { name: "page", type: "number", description: "Current 1-based page number." },
      { name: "totalPages", type: "number", description: "Total page count." },
      { name: "startIndex", type: "number", description: "Zero-based start slice index." },
      { name: "endIndex", type: "number", description: "Exclusive end slice index." },
      { name: "range", type: "PaginationToken[]", description: "Array of page numbers and 'ellipsis' tokens." },
      { name: "setPage / next / prev", type: "() => void", description: "Navigation helpers." },
    ],
    examples: [
      {
        title: "Paginated Data Slice",
        code: `import { usePagination } from "@/hooks/use-pagination";

export function PagedList({ items }: { items: string[] }) {
  const { startIndex, endIndex, next, prev, hasPrev, hasNext } = usePagination({
    totalItems: items.length,
    pageSize: 10,
  });
  return (
    <div>
      {items.slice(startIndex, endIndex).map((i) => <div key={i}>{i}</div>)}
      <button disabled={!hasPrev} onClick={prev}>Prev</button>
      <button disabled={!hasNext} onClick={next}>Next</button>
    </div>
  );
}`,
      },
    ],
    notes: ["Automatically clamps page numbers if totalItems shrinks dynamically."],
  },
  {
    slug: "use-polling",
    name: "usePolling",
    description:
      "Repeats an async request at a fixed interval while preventing overlapping in-flight requests.",
    category: "Data & Async",
    tags: ["polling", "interval", "async", "refresh"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2688,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-polling.ts",
    params: [
      { name: "fetcher", type: "() => Promise<T>", required: true, description: "Async function returning fresh data." },
      { name: "options", type: "UsePollingOptions", default: "{}", description: "intervalMs, enabled, and immediate." },
    ],
    returns: [
      { name: "data", type: "T | null", description: "Latest resolved data." },
      { name: "error", type: "Error | null", description: "Latest error if failed." },
      { name: "isPolling", type: "boolean", description: "Whether polling is active." },
      { name: "start / stop / pollNow", type: "() => void", description: "Polling lifecycle controls." },
    ],
    examples: [
      {
        title: "Live Job Status Poller",
        code: `import { usePolling } from "@/hooks/use-polling";

export function JobStatus() {
  const { data, stop } = usePolling(() => fetch("/api/job").then((r) => r.json()), {
    intervalMs: 3000,
  });
  return <button onClick={stop}>{JSON.stringify(data)}</button>;
}`,
      },
    ],
    notes: ["Skips scheduled ticks if a previous poll request is still in flight."],
  },
  {
    slug: "use-optimistic",
    name: "useOptimistic",
    description:
      "Applies immediate optimistic UI updates while an async commit runs, automatically rolling back on failure.",
    category: "Data & Async",
    tags: ["optimistic", "rollback", "ui", "async"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 1972,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-optimistic.ts",
    params: [
      { name: "initialState", type: "T", required: true, description: "Initial committed state." },
    ],
    returns: [
      { name: "state", type: "T", description: "Current optimistic or committed state." },
      { name: "isPending", type: "boolean", description: "True while commitFn is executing." },
      { name: "error", type: "Error | null", description: "Error if the commit rolled back." },
      { name: "applyOptimistic", type: "(optimisticValue, commitFn) => Promise<boolean>", description: "Applies optimistic update and commits asynchronously." },
    ],
    examples: [
      {
        title: "Optimistic Like Counter",
        code: `import { useOptimistic } from "@/hooks/use-optimistic";

export function LikeButton() {
  const { state, applyOptimistic } = useOptimistic(10);
  return (
    <button onClick={() => applyOptimistic((n) => n + 1, async () => 11)}>
      ♥ {state}
    </button>
  );
}`,
      },
    ],
    notes: ["Captures a snapshot before applying the optimistic value so failed requests revert cleanly."],
  },
  {
    slug: "use-web-socket",
    name: "useWebSocket",
    description:
      "Manages a WebSocket connection with automatic reconnect, send(), close(), and lastMessage state.",
    category: "Data & Async",
    tags: ["websocket", "realtime", "socket", "reconnect"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 3950,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-web-socket.ts",
    params: [
      { name: "url", type: "string | null", required: true, description: "WebSocket URL, or null to stay idle." },
      { name: "options", type: "UseWebSocketOptions", default: "{}", description: "reconnect, reconnectIntervalMs, maxReconnectAttempts, onMessage." },
    ],
    returns: [
      { name: "status", type: "WebSocketStatus", description: "'idle' | 'connecting' | 'open' | 'closed' | 'error'." },
      { name: "lastMessage", type: "string | null", description: "Latest string message received." },
      { name: "send", type: "(data) => boolean", description: "Sends a message when open." },
      { name: "close / reconnect", type: "() => void", description: "Connection controls." },
    ],
    examples: [
      {
        title: "Realtime Echo Client",
        code: `import { useWebSocket } from "@/hooks/use-web-socket";

export function LiveSocket() {
  const { status, lastMessage, send } = useWebSocket("wss://echo.websocket.events");
  return <button onClick={() => send("hello")}>{status}: {lastMessage}</button>;
}`,
      },
    ],
    notes: ["Closes the socket and cancels pending reconnect timers automatically on unmount."],
  },
  {
    slug: "use-event-source",
    name: "useEventSource",
    description:
      "Subscribes to Server-Sent Events (SSE) using the native EventSource API with automatic cleanup on unmount.",
    category: "Data & Async",
    tags: ["sse", "event-source", "streaming", "realtime"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2261,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-event-source.ts",
    params: [
      { name: "url", type: "string | null", required: true, description: "SSE endpoint URL, or null." },
      { name: "options", type: "UseEventSourceOptions", default: "{}", description: "withCredentials and onMessage callback." },
    ],
    returns: [
      { name: "status", type: "EventSourceStatus", description: "'idle' | 'connecting' | 'open' | 'error' | 'closed'." },
      { name: "lastEvent", type: "string | null", description: "Latest event payload." },
      { name: "error", type: "string | null", description: "Error message on connection failure." },
      { name: "close", type: "() => void", description: "Closes the EventSource stream." },
    ],
    examples: [
      {
        title: "Server-Sent Notifications",
        code: `import { useEventSource } from "@/hooks/use-event-source";

export function StreamViewer() {
  const { status, lastEvent } = useEventSource("/api/stream");
  return <div>{status}: {lastEvent}</div>;
}`,
      },
    ],
    notes: ["Pass url={null} to defer connecting until an auth token or room ID is ready."],
  },
  {
    slug: "use-search",
    name: "useSearch",
    description:
      "Combines controlled query state, debouncing, race-condition guarding, and async search results into one hook.",
    category: "Data & Async",
    tags: ["search", "debounce", "autocomplete", "async"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2359,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-search.ts",
    params: [
      { name: "searchFn", type: "(query: string) => Promise<T[]> | T[]", required: true, description: "Search function returning matching items." },
      { name: "options", type: "UseSearchOptions", default: "{}", description: "delayMs (default 300) and minLength (default 1)." },
    ],
    returns: [
      { name: "query", type: "string", description: "Current search input value." },
      { name: "setQuery", type: "(q: string) => void", description: "Updates query string." },
      { name: "results", type: "T[]", description: "Matched results array." },
      { name: "loading", type: "boolean", description: "True while debouncing or searching." },
      { name: "error", type: "Error | null", description: "Error if searchFn throws." },
      { name: "clear", type: "() => void", description: "Clears query and results." },
    ],
    examples: [
      {
        title: "Debounced Async Search",
        code: `import { useSearch } from "@/hooks/use-search";

export function SearchBox() {
  const { query, setQuery, results, loading } = useSearch((q) =>
    fetch(\`/api/search?q=\${q}\`).then((r) => r.json())
  );
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
      },
    ],
    notes: ["Discards out-of-order responses using a monotonically incrementing request ID."],
  },
  {
    slug: "use-queue",
    name: "useQueue",
    description:
      "Executes asynchronous tasks sequentially in strict FIFO order, tracking pending count, processing state, and results.",
    category: "Data & Async",
    tags: ["queue", "fifo", "sequential", "async"],
    isNew: true,
    ssrSafe: true,
    sizeBytes: 2283,
    dependencies: [],
    filePath: "src/hooks-lib/hooks/use-queue.ts",
    params: [],
    returns: [
      { name: "pending", type: "number", description: "Number of tasks waiting in the queue." },
      { name: "isProcessing", type: "boolean", description: "True while a task is currently running." },
      { name: "results", type: "T[]", description: "Completed task results in order." },
      { name: "enqueue", type: "(task: () => Promise<T>) => void", description: "Adds an async task to the queue." },
      { name: "clear", type: "() => void", description: "Clears queued tasks and results." },
    ],
    examples: [
      {
        title: "Sequential File Upload Queue",
        code: `import { useQueue } from "@/hooks/use-queue";

export function UploadQueue() {
  const { pending, isProcessing, enqueue } = useQueue<string>();
  return (
    <button onClick={() => enqueue(async () => "uploaded")}>
      {isProcessing ? \`Processing (\${pending} waiting)\` : "Queue Job"}
    </button>
  );
}`,
      },
    ],
    notes: ["Guarantees at most one task runs at a time even when enqueue() is called in rapid bursts."],
  },
];

export function getHookBySlug(slug: string): HookMeta | undefined {
  const normalized = slug.trim().toLowerCase();
  return HOOKS_REGISTRY.find(
    (hook) =>
      hook.slug.toLowerCase() === normalized ||
      hook.name.toLowerCase() === normalized
  );
}
