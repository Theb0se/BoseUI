import type { PulseComponentMeta } from "../../types/component";

export const RevealCardGridMeta: PulseComponentMeta = {
  title: "Reveal Card Grid",
  description:
    "Interactive feature card grid with dynamic circular ink reveals that expand from the pointer entry coordinates to display vivid marbled fluid textures.",
  tagline: "Interactive feature card grid with coordinate-tracked circular ink reveals.",
  category: "Cards",
  badges: ["Interactive", "Clip-Path", "Fluid Marble", "A11y Ready"],
  createdAt: "2026-10-30",
  featured: true,
  keywords: [
    "reveal card grid",
    "reveal card",
    "circular ink reveal",
    "clip path hover animation",
    "marbled fluid background",
    "feature cards grid",
    "pointer coordinate animation",
    "framer motion cards",
  ],
  features: [
    "Dynamic circular clip-path tracking exact pointer entry coordinates and expanding to corner radius (Math.hypot).",
    "Smooth directional retraction draining ink back toward the exact boundary point where the cursor leaves.",
    "Procedural SVG marbled liquid textures with feTurbulence fractal noise displacement across 6 color palettes.",
    "High-contrast text illumination cross-fading from muted grey to crisp white with dark gradient backing.",
    "Full keyboard accessibility expanding ink from card center on focus, and touch-tap toggling.",
  ],
  accessibility: [
    "Semantic ul and li grid markup with h3 headings and descriptive aria-labels.",
    "Keyboard navigable with visible focus ring and center-origin animation triggers.",
    "Honors prefers-reduced-motion by replacing clip-path calculations with smooth 200ms opacity fades.",
  ],
  props: [
    {
      name: "items",
      type: "RevealCardItem[]",
      default: "DEFAULT_REVEAL_ITEMS",
      description: "Array of feature card data objects with titles, descriptions, icons, and accent colors.",
    },
    {
      name: "title",
      type: "string",
      default: "undefined",
      description: "Optional section header title rendered above the card grid.",
    },
    {
      name: "subtitle",
      type: "string",
      default: "undefined",
      description: "Optional section descriptive subtitle rendered beneath the header title.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged onto the outer grid section.",
    },
  ],
  usageCode: `import { RevealCardGrid } from "@/components/ui/reveal-card-grid";

export function FeaturesDemo() {
  return (
    <div className="bg-[#fcfcfd] dark:bg-neutral-950 py-16">
      <RevealCardGrid
        title="Modern Infrastructure"
        subtitle="Push to main and it's live worldwide before the kettle boils."
      />
    </div>
  );
}`,
};

export default RevealCardGridMeta;
