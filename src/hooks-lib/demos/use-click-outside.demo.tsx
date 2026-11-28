"use client";

import React, { useRef, useState } from "react";
import { useClickOutside } from "../hooks/use-click-outside";

export function UseClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [outsideClicks, setOutsideClicks] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    boxRef,
    () => {
      setIsOpen(false);
      setOutsideClicks((c) => c + 1);
    },
    isOpen
  );

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {isOpen ? "Dropdown Open" : "Open Dropdown"}
        </button>

        {isOpen && (
          <div
            ref={boxRef}
            className="mt-2 w-60 rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="text-xs font-semibold text-neutral-950 dark:text-white">
              Inside Target Element
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Clicking anywhere outside this card closes it automatically.
            </p>
          </div>
        )}
      </div>

      <div className="font-mono text-[11px] text-neutral-500">
        Outside dismissals recorded: {outsideClicks}
      </div>
    </div>
  );
}
