"use client";

import { useEffect } from "react";

/**
 * Dynamically updates the document's favicon (`<link rel="icon">`) when `href` changes,
 * creating a link element if one does not already exist.
 *
 * @param href - URL or data URI for the favicon.
 */
export function useFavicon(href: string): void {
  useEffect(() => {
    if (typeof document === "undefined" || !href) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = href;
  }, [href]);
}
