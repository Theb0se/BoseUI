import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Volcano Embers",
  description:
    "Rising volcanic embers and charred thermal ash on Canvas 2D with molten caldera horizon glow, velocity-aligned incandescent spark trails, and turbulent updraft vortices.",
  tagline: "Incandescent sparks and thermal ash rising from a molten horizon.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Nature", "Particles", "Thermal"],
  createdAt: "2026-10-08",
  keywords: [
    "volcano",
    "embers",
    "sparks",
    "fire",
    "magma",
    "ash",
    "thermal",
    "particles",
  ],
  features: [
    "Velocity-aligned incandescent ember streaks with radial bloom halos and cooling curves",
    "Mixed particle simulation combining glowing sparks and charred floating thermal ash",
    "Pulsing molten caldera horizon glow behind a dark basalt rim silhouette",
    "Interactive pointer updraft repulsion and live HUD controls for ember color, updraft, and swirl",
  ],
  accessibility: [
    "Canvas layer uses pointer-events-none so foreground interactive elements remain unobstructed",
    "Interactive HUD presets and sliders support full keyboard focus and manipulation",
  ],
  props: [
    {
      name: "emberCount",
      type: "number",
      default: "110",
      description: "Total number of rising embers and thermal ash particles.",
    },
    {
      name: "updraftSpeed",
      type: "number",
      default: "1.2",
      description: "Vertical thermal updraft velocity multiplier.",
    },
    {
      name: "turbulence",
      type: "number",
      default: "1.0",
      description: "Intensity of horizontal curl turbulence and vortex swirl.",
    },
    {
      name: "emberColor",
      type: "string",
      default: '"#FF6B1A"',
      description: "Primary hex color for the glowing embers and caldera horizon.",
    },
    {
      name: "coreGlow",
      type: "number",
      default: "0.8",
      description: "Intensity of the molten magma glow along the bottom horizon (0 to 1.5).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the embers canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { VolcanoEmbers } from "@/components/ui/VolcanoEmbers";

export default function VolcanoEmbersDemo() {
  return (
    <VolcanoEmbers
      emberCount={110}
      updraftSpeed={1.2}
      turbulence={1.0}
      emberColor="#FF6B1A"
      coreGlow={0.8}
    >
      <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Forged in Magma
        </h1>
        <p className="mt-3 max-w-md text-orange-100/80">
          Incandescent embers and ash rising on turbulent volcanic updrafts.
        </p>
      </div>
    </VolcanoEmbers>
  );
}`,
};

export default meta;
