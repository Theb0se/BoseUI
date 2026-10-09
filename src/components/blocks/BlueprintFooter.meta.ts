import type { PulseComponentMeta } from "../../types/component";

export const BlueprintFooterMeta: PulseComponentMeta = {
  title: "Blueprint Footer",
  description:
    "A Vercel-inspired architectural blueprint footer with hairline grid styling, plus-cross intersection indicators, four structured columns, a tactile KeycapChips ⌘K quick search hint, and an operational system status badge.",
  tagline: "Vercel-inspired architectural blueprint footer with plus-cross markers and keycap chips.",
  category: "Cards",
  badges: ["Block", "Footer", "Blueprint", "Keycap", "Minimal", "Grid"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "blueprint footer",
    "vercel style",
    "plus grid",
    "keycap chips",
    "system status",
    "minimal footer",
    "developer footer",
  ],
  features: [
    "Architectural hairline grid borders with interactive corner plus (+) markers.",
    "Raycast-style KeycapChips command hint promoting instant shortcut discovery.",
    "Four modular column groups with hover background illumination and external link badges.",
    "Live pulsing 'All Systems Operational' pill indicator with sub-millisecond edge latency specs.",
  ],
  accessibility: [
    "High contrast ratios meeting WCAG AA 4.5:1 standards on all links and labels.",
    "Semantic HTML structure using footer, nav, and accessible keyboard-focusable anchors.",
    "Tactile touch targets sized at 44px+ for mobile accessibility.",
    "Reduced-motion friendly with clean CSS transitions and no disorienting motion.",
  ],
  props: [
    {
      name: "columns",
      type: "BlueprintFooterColumn[]",
      description: "Array of structured footer column definitions and links.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the footer root element.",
    },
  ],
  usageCode: `import { BlueprintFooter } from "@/components/ui/BlueprintFooter";

export function Example() {
  return (
    <BlueprintFooter />
  );
}`,
};

export default BlueprintFooterMeta;
