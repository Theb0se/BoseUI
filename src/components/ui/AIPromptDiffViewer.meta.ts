import type { PulseComponentMeta } from "../../types/component";

export const AIPromptDiffViewerMeta: PulseComponentMeta = {
  title: "AI Prompt Diff Viewer",
  description:
    "Cursor and Copilot inspired inline code and text suggestion comparator with inline additions, deletions, split vs inline views, and keyboard-accessible Accept/Reject actions.",
  tagline: "Cursor-style inline code suggestion diff comparator with split/inline modes.",
  category: "Cards",
  badges: ["New", "AI", "Diff", "Code"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai diff viewer",
    "cursor diff",
    "inline suggestion diff",
    "code comparator",
    "accept reject diff",
    "copilot diff",
  ],
  features: [
    "Inline and 2-column Split view modes.",
    "Syntax-inspired addition (+ green) and deletion (- red) gutter styling.",
    "Native keyboard hotkeys: ⌘Y (Ctrl+Y) to Accept, ⌘N (Ctrl+N) to Reject.",
    "Persistent addition and deletion stats counters.",
    "Accessible buttons with spring feedback and state reset support.",
  ],
  accessibility: [
    "Keyboard accessible with hotkeys and standard focus rings.",
    "High contrast color-safe additions and deletions indicators.",
  ],
  props: [
    {
      name: "filename",
      type: "string",
      default: '"hooks/useCounter.ts"',
      description: "Header file title displayed in titlebar.",
    },
    {
      name: "language",
      type: "string",
      default: '"typescript"',
      description: "Language badge identifier.",
    },
    {
      name: "lines",
      type: "DiffLine[]",
      description: "Array of line objects with type ('unchanged' | 'added' | 'removed') and content.",
    },
    {
      name: "defaultViewMode",
      type: '"inline" | "split"',
      default: '"inline"',
      description: "Initial layout between inline unified diff or split 2-column view.",
    },
    {
      name: "onAccept",
      type: "() => void",
      description: "Callback invoked when user accepts the diff suggestions.",
    },
    {
      name: "onReject",
      type: "() => void",
      description: "Callback invoked when user rejects the diff suggestions.",
    },
  ],
  usageCode: `import { AIPromptDiffViewer } from "@/components/ui/AIPromptDiffViewer";

export function Example() {
  return (
    <AIPromptDiffViewer
      filename="utils/math.ts"
      language="typescript"
      onAccept={() => console.log("Accepted!")}
      onReject={() => console.log("Rejected!")}
    />
  );
}`,
};

export default AIPromptDiffViewerMeta;
