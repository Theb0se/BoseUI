import type { PulseComponentMeta } from "../../types/component";

export const FlickeringGridMeta: PulseComponentMeta = {
  title: "Flickering Grid",
  description:
    "High-performance HTML5 canvas flickering retro grid background with device-pixel-ratio scaling, probabilistic opacity stepping, and automatic offscreen pausing via IntersectionObserver.",
  tagline: "High-performance canvas retro flickering square grid background.",
  category: "Backgrounds",
  badges: ["Canvas", "Performance", "IntersectionObserver", "DPR Aware"],
  createdAt: "2026-10-31",
  featured: false,
  keywords: [
    "flickering grid",
    "canvas grid",
    "retro grid",
    "matrix squares",
    "flicker background",
    "high performance canvas",
  ],
  features: [
    "GPU-accelerated HTML5 2D canvas rendering with subpixel device-pixel-ratio sharpness.",
    "Dynamic delta-time calibrated probabilistic flickering so frame rate fluctuations do not affect animation speed.",
    "Battery-friendly IntersectionObserver automatically halts requestAnimationFrame loops when scrolled out of view.",
    "Fast SSR-safe color parser with support for hex, rgb, and CSS color names.",
  ],
  accessibility: [
    "Decorative canvas marked with pointer-events-none so it does not intercept user clicks.",
    "Gracefully respects viewport resizing without layout shifts.",
  ],
  props: [
    {
      name: "squareSize",
      type: "number",
      default: "4",
      description: "Dimension of each square cell in CSS pixels.",
    },
    {
      name: "gridGap",
      type: "number",
      default: "6",
      description: "Spacing between adjacent cells in CSS pixels.",
    },
    {
      name: "flickerChance",
      type: "number",
      default: "0.3",
      description: "Probability of a cell recalculating its opacity per second [0..1].",
    },
    {
      name: "color",
      type: "string",
      default: '"rgb(0, 0, 0)"',
      description: "CSS color string for the rendered grid squares.",
    },
    {
      name: "maxOpacity",
      type: "number",
      default: "0.3",
      description: "Maximum opacity ceiling for the grid squares.",
    },
    {
      name: "width",
      type: "number",
      default: "undefined",
      description: "Optional explicit fixed width override in pixels.",
    },
    {
      name: "height",
      type: "number",
      default: "undefined",
      description: "Optional explicit fixed height override in pixels.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into the container.",
    },
  ],
  usageCode: `import { FlickeringGrid } from "@/components/ui/flickering-grid";

export function HeroBackground() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        flickerChance={0.3}
        color="#3b82f6"
        maxOpacity={0.4}
      />
    </div>
  );
}`,
};

export default FlickeringGridMeta;
