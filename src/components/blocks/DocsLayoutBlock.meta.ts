import type { PulseComponentMeta } from "../../types/component";

export const DocsLayoutBlockMeta: PulseComponentMeta = {
  title: "Docs Layout Block",
  description:
    "A full developer documentation template block featuring a pinned StickySubNav table of contents, FileTree documentation hierarchy sidebar, CopyCodeBlock package manager snippets, and an integrated CommandMenu quick search palette.",
  tagline: "Developer documentation page layout with sub-nav, file tree sidebar, and install code blocks.",
  category: "Navigation",
  badges: ["Block", "Documentation", "Layout", "FileTree", "CodeBlock", "CommandMenu"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "docs layout block",
    "documentation template",
    "file tree sidebar",
    "sticky subnav",
    "copy code block",
    "command menu",
    "developer docs",
  ],
  features: [
    "Pinned StickySubNav header with page breadcrumbs and interactive table of contents tabs.",
    "Interactive FileTree sidebar organizing documentation guides and component categories.",
    "Multi-package manager CopyCodeBlock supporting 1-click clipboard copy for npx, pnpm, and bun.",
    "Integrated CommandMenu palette trigger for instantaneous fuzzy search across docs.",
  ],
  accessibility: [
    "Fully keyboard navigable sidebar tree, code tabs, and navigation links.",
    "All text content complies with WCAG AA 4.5:1 contrast standards.",
    "Screen reader polite live announcements on clipboard copy events.",
    "Reduced-motion friendly with smooth, non-distracting scroll transitions.",
  ],
  props: [
    {
      name: "pageTitle",
      type: "string",
      default: '"Cosmic Launch Hero Block"',
      description: "Title of the active documentation page.",
    },
    {
      name: "category",
      type: "string",
      default: '"Composite Blocks // Landing"',
      description: "Category path or breadcrumb displayed above the title.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DocsLayoutBlock } from "@/components/ui/DocsLayoutBlock";

export function Example() {
  return (
    <DocsLayoutBlock
      pageTitle="Cosmic Launch Hero Block"
    />
  );
}`,
};

export default DocsLayoutBlockMeta;
