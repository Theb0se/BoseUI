import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes safely without style conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copies a string to the system clipboard with fallback support.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const succeeded = document.execCommand("copy");
    textArea.remove();
    return succeeded;
  } catch {
    return false;
  }
}

export const SITE_CONFIG = {
  name: "BoseUI",
  version: "1.0.0",
  tagline: "Kinetic React Components Engineered to Make Interfaces Feel Alive",
  description:
    "140+ free, open-source animated React primitives built with Framer Motion, Tailwind CSS, and TypeScript. Install with one shadcn command and own the code.",
  url: "https://boseui.site",
  ogImage: "/OG.png",
  author: {
    name: "Rishabh Bose",
    portfolio: "https://theb0se.vercel.app/",
    github: "https://github.com/Theb0se",
    linkedin: "https://www.linkedin.com/in/rishabhbose3107/",
    repo: "https://github.com/Theb0se/bose-ui",
  },
} as const;

