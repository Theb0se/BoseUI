import type { PulseComponentMeta } from "../../types/component";

export const InteractiveCodeDiffMeta: PulseComponentMeta = {
  title: "Interactive Code Diff",
  description:
    "Monospace developer diff card with line gutters, hunk headers, collapsible code blocks, unified versus split 2-column layouts, and copy hunk controls.",
  tagline: "Split and Unified developer syntax code diff comparator.",
  category: "Cards",
  badges: ["New", "DevTools", "Code", "Git"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "code diff",
    "git diff",
    "syntax comparator",
    "split diff",
    "unified diff",
    "developer tools",
  ],
  features: [
    "Unified and Split 2-column layout toggle.",
    "Collapsible hunk headers with line range metadata (@@ -18,6 +18,10 @@).",
    "Distinct addition (+ green) and deletion (- red) gutter styling.",
    "One-click copy raw git diff format to clipboard.",
    "Responsive horizontal scrolling for wide code lines.",
  ],
  accessibility: [
    "Color-blind safe addition and deletion indicators with explicit + and - symbols.",
    "Collapsible hunk buttons with keyboard access.",
  ],
  props: [
    {
      name: "filename",
      type: "string",
      default: '"src/server/auth.ts"',
      description: "File path displayed in the diff header.",
    },
    {
      name: "compareRange",
      type: "string",
      default: '"main...feature/audit-logs"',
      description: "Git branch or commit comparison range.",
    },
    {
      name: "hunks",
      type: "CodeDiffHunk[]",
      description: "Array of hunk objects containing headers and line items.",
    },
    {
      name: "defaultMode",
      type: '"unified" | "split"',
      default: '"unified"',
      description: "Initial layout mode.",
    },
  ],
  usageCode: `import { InteractiveCodeDiff } from "@/components/ui/InteractiveCodeDiff";

export function Example() {
  return (
    <InteractiveCodeDiff
      filename="src/auth.ts"
      compareRange="main...feature/sso"
      defaultMode="unified"
    />
  );
}`,
};

export default InteractiveCodeDiffMeta;
