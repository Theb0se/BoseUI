import type { PulseComponentMeta } from "../../types/component";

export const CopyCodeBlockMeta: PulseComponentMeta = {
  title: "Copy Code Block",
  description:
    "Multi-tab CLI and code snippet block with sliding spring package-manager tabs (npx, pnpm, bun, yarn), optional line numbers, and one-click clipboard copy feedback.",
  tagline: "Multi-tab CLI command and code block with instant copy feedback.",
  category: "Cards",
  badges: ["New", "Developer UX", "Clipboard"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "copy code block",
    "cli command switcher",
    "package manager tabs",
    "code snippet card",
    "clipboard button",
  ],
  features: [
    "Spring-animated tab pill indicator for switching between npx, pnpm, bun, and yarn or multiple files.",
    "One-click clipboard copy button with animated Check/Copy icon transition.",
    "Supports single-line CLI prompts ($) as well as multi-line code blocks with line numbers.",
  ],
  accessibility: [
    "Uses native button elements with focus-visible rings for tab switching and clipboard copy.",
    "Provides explicit aria-label on the clipboard button.",
    "Respects prefers-reduced-motion for tab indicator transitions.",
  ],
  props: [
    {
      name: "tabs",
      type: "CodeSnippetTab[]",
      description: "Array of tabs ({ id, label, code, language }) displayed in the header bar.",
    },
    {
      name: "code",
      type: "string",
      description: "Optional single code string when multiple tabs are not needed.",
    },
    {
      name: "title",
      type: "string",
      default: '"Terminal"',
      description: "Header label used when a single `code` prop is provided.",
    },
    {
      name: "showLineNumbers",
      type: "boolean",
      default: "false",
      description: "Displays line numbers next to multi-line code snippets.",
    },
    {
      name: "showPromptPrefix",
      type: "boolean",
      default: "true",
      description: "Displays a `$` terminal prefix before single-line commands.",
    },
    {
      name: "onCopy",
      type: "(copiedText: string) => void",
      description: "Callback fired when the active snippet is copied.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer card.",
    },
  ],
  usageCode: `import { CopyCodeBlock } from "@/components/ui/copy-code-block";

export function Example() {
  return (
    <CopyCodeBlock
      tabs={[
        { id: "npx", label: "npx", code: "npx shadcn@latest add button" },
        { id: "pnpm", label: "pnpm", code: "pnpm dlx shadcn@latest add button" },
        { id: "bun", label: "bun", code: "bunx shadcn@latest add button" },
      ]}
    />
  );
}`,
};

export default CopyCodeBlockMeta;
