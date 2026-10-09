import type { PulseComponentMeta } from "../../types/component";

export const PlusGridBorderMeta: PulseComponentMeta = {
  title: "Plus Grid Border",
  description:
    "Vercel-inspired blueprint grid architecture with precision hairline section borders and interactive corner plus markers that illuminate on pointer proximity.",
  tagline: "Architectural blueprint grid with illuminated corner crosshairs.",
  category: "Cards",
  badges: ["New", "Blueprint", "Interactive Grid"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "plus grid border",
    "vercel grid",
    "blueprint grid",
    "crosshair grid",
    "border intersections",
    "corner plus markers",
  ],
  features: [
    "Precision architectural hairline borders with corner '+' crosshairs at all junction nodes.",
    "Dynamic pointer proximity lighting that illuminates nearby crosses and borders based on mouse coordinates.",
    "Multiple layout presets including 2x2 quadrant and 3-column feature bento showcase.",
    "Interactive configuration toolbar for adjusting cross scale, border glow tone, and hover intensity.",
  ],
  accessibility: [
    "Decorative '+' markers are hidden from assistive technology via aria-hidden.",
    "Cards remain fully keyboard navigable with standard focus-visible rings.",
    "Respects prefers-reduced-motion by keeping illumination static without jitter.",
  ],
  props: [
    {
      name: "items",
      type: "GridCardItem[]",
      description: "Array of content cards to frame inside the plus grid system.",
    },
    {
      name: "glowColor",
      type: "string",
      default: '"cyan"',
      description: "Accent illumination color for the crosshairs and proximity borders.",
    },
    {
      name: "interactiveProximity",
      type: "boolean",
      default: "true",
      description: "Whether mouse pointer distance dynamically illuminates junction crosses.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root grid container.",
    },
  ],
  usageCode: `import { PlusGridBorder } from "@/components/ui/PlusGridBorder";

export function Example() {
  return (
    <PlusGridBorder
      glowColor="cyan"
      interactiveProximity={true}
    />
  );
}`,
};

export default PlusGridBorderMeta;
