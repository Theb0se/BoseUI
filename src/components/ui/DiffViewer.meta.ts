import type { PulseComponentMeta } from "../../types/component";

export const DiffViewerMeta: PulseComponentMeta = {
  title: "Diff Viewer",
  description:
    "GitHub and GitLab-inspired code difference viewer featuring side-by-side split and unified inspection modes, line gutter numbering, collapsible unchanged regions, and copy diff clipboard actions.",
  tagline: "GitHub/GitLab-style code diff viewer with unified and split view modes.",
  category: "Cards" as any,
  badges: ["New", "Code Diff", "Developer Tools", "Syntax Highlighting"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "diff viewer",
    "git diff",
    "code comparison",
    "unified diff",
    "split diff",
    "git patch",
    "pull request viewer",
  ],
  features: [
    "Side-by-side split and unified single-column view layout modes with instant toggle.",
    "Dual line gutter numbering, deletion red gutters (-), and addition green gutters (+).",
    "Collapsible unchanged code fold markers with expandable hidden line counts.",
    "Multiple diff file presets (TypeScript Auth, Rust Engine, and Prisma Schema).",
    "One-click copy raw unified git patch or patched final source code.",
  ],
  accessibility: [
    "Line gutters include descriptive ARIA attributes and screen-reader accessible deletion/addition prefixes.",
    "Supports full keyboard navigation across fold toggle controls and diff panels.",
    "High-contrast color tokens adhering to WCAG AAA contrast for deletion and addition highlights.",
  ],
  props: [
    {
      name: "initialViewMode",
      type: '"split" | "unified"',
      default: '"unified"',
      description: "Default display layout presentation mode.",
    },
    {
      name: "fileName",
      type: "string",
      default: '"src/auth/session.ts"',
      description: "Filename and file path header for the active diff view.",
    },
    {
      name: "allowCopyDiff",
      type: "boolean",
      default: "true",
      description: "Whether the copy raw diff button is displayed in the header toolbar.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DiffViewer } from "@/components/ui/DiffViewer";

export function Example() {
  return (
    <DiffViewer
      initialViewMode="split"
      fileName="src/auth/session.ts"
    />
  );
}`,
};

export default DiffViewerMeta;
