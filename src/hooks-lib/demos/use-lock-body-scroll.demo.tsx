"use client";

import React, { useState } from "react";
import { useLockBodyScroll } from "../hooks/use-lock-body-scroll";

function ScrollLockModal({ onClose }: { onClose: () => void }) {
  useLockBodyScroll(true);

  return (
    <div className="rounded-2xl border border-neutral-900 bg-white p-5 shadow-lg dark:border-white dark:bg-neutral-950">
      <div className="text-xs font-semibold text-neutral-950 dark:text-white">
        Body Scroll Locked
      </div>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Background scrolling is prevented while this component is mounted.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
      >
        Close &amp; Unlock
      </button>
    </div>
  );
}

export function UseLockBodyScrollDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      {open ? (
        <ScrollLockModal onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Mount Scroll-Locked Overlay
        </button>
      )}
    </div>
  );
}
