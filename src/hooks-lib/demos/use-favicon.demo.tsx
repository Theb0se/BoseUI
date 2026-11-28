"use client";

import React, { useState } from "react";
import { useFavicon } from "../hooks/use-favicon";

const ICONS = [
  {
    label: "Default",
    href: "/boseui-logo.png",
  },
  {
    label: "Emerald Dot",
    href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%2310b981'/></svg>",
  },
  {
    label: "Rose Alert",
    href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f43f5e'/></svg>",
  },
];

export function UseFaviconDemo() {
  const [selected, setSelected] = useState(ICONS[0]);
  useFavicon(selected.href);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {ICONS.map((icon) => (
          <button
            key={icon.label}
            type="button"
            onClick={() => setSelected(icon)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${
              selected.label === icon.label
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            {icon.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Look at your browser tab icon to see the live favicon update.
      </p>
    </div>
  );
}
