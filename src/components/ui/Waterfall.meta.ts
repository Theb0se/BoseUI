import type { PulseComponentMeta } from "../../types/component";

export const WaterfallMeta: PulseComponentMeta = {
  title: "Waterfall",
  description:
    "Physics-driven cascading waterfall background rendered on HTML5 Canvas 2D with 240+ layered vertical hydro streaks, gravity-accelerated splash droplets, and a pulsing volumetric mist cloud at the plunge basin.",
  tagline: "Gravity-accelerated hydro streaks and volumetric plunge mist.",
  category: "Backgrounds",
  badges: ["New", "Canvas 2D", "Fluid Physics"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "waterfall background",
    "water cascade canvas",
    "hydro streaks",
    "mist particles",
    "fluid simulation",
    "plunge pool animation",
  ],
  features: [
    "Three depth-sorted hydro streak layers with independent speed, thickness, and additive screen luminance.",
    "Ballistic splash droplets launched upward from the plunge line with real-time gravity decay.",
    "Pulsing volumetric mist puffs and shimmering water surface ripples along the basin floor.",
  ],
  accessibility: [
    "Marks the decorative Canvas 2D element and vignette overlays with `aria-hidden='true'`.",
    "High-contrast glassmorphic HUD controls remain keyboard accessible when no custom children are passed.",
    "Automatically scales to devicePixelRatio (capped at 2x) via ResizeObserver without layout thrashing.",
  ],
  props: [
    {
      name: "flow",
      type: "number",
      default: "1.0",
      description: "Velocity multiplier for falling water streaks and splash kinetics.",
    },
    {
      name: "mistAmount",
      type: "number",
      default: "0.75",
      description: "Opacity and density of the pulsing volumetric mist cloud at the plunge pool line (0 to 1).",
    },
    {
      name: "color",
      type: "string",
      default: '"#38BDF8"',
      description: "Primary hex color tint for the water streaks, subsurface glow, and mist.",
    },
    {
      name: "curtainWidth",
      type: "number",
      default: "0.75",
      description: "Horizontal span of the waterfall curtain relative to the container width (0.3 to 1.0).",
    },
    {
      name: "splashIntensity",
      type: "number",
      default: "1.0",
      description: "Spawn rate multiplier for upward-bouncing splash droplets at the plunge line.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the waterfall canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { Waterfall } from "@/components/ui/waterfall";

export function Example() {
  return (
    <Waterfall
      flow={1.15}
      mistAmount={0.8}
      color="#38BDF8"
      curtainWidth={0.75}
      splashIntensity={1.0}
    />
  );
}`,
};

export default WaterfallMeta;
