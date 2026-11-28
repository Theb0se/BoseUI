"use client";

import React, { useState } from "react";
import { useDocumentTitle } from "../hooks/use-document-title";

export function UseDocumentTitleDemo() {
  const [title, setTitle] = useState("useDocumentTitle · BoseUI");
  useDocumentTitle(title, true);

  return (
    <div className="w-full max-w-md space-y-3">
      <label
        htmlFor="doc-title-input"
        className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
      >
        Browser Tab Title (restores original on unmount)
      </label>
      <input
        id="doc-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
      />
    </div>
  );
}
