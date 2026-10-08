import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Fireflies",
  description:
    "Enchanted twilight forest background with bioluminescent firefly orbs drifting along smooth organic trajectories and pulsing with soft radial halos.",
  tagline: "Bioluminescent twilight fireflies above a layered pine forest.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Nature", "Interactive", "Particles"],
  createdAt: "2026-10-08",
  keywords: [
    "fireflies",
    "forest",
    "bioluminescence",
    "twilight",
    "nature",
    "particles",
    "glow",
    "ambient",
  ],
  features: [
    "Smooth harmonic drift trajectories with depth-sorted parallax layers",
    "Non-linear bioluminescent flash curves with soft radial halos and motion trails",
    "Procedural multi-ridge pine forest silhouette with atmospheric horizon mist",
    "Gentle cursor attraction field and live interactive HUD controls",
  ],
  accessibility: [
    "Decorative Canvas 2D layer marked pointer-events-none so overlay content remains accessible",
    "High-contrast glassmorphic HUD controls with keyboard-focusable range inputs and buttons",
  ],
  props: [
    {
      name: "count",
      type: "number",
      default: "55",
      description: "Total number of glowing firefly orbs in the scene.",
    },
    {
      name: "glowColor",
      type: "string",
      default: '"#D9F99D"',
      description: "Hex color used for the firefly bioluminescent core and halo.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Multiplier for the organic flight velocity of the fireflies.",
    },
    {
      name: "pulseRate",
      type: "number",
      default: "1.0",
      description: "Multiplier for individual firefly brightness pulse frequency.",
    },
    {
      name: "showForest",
      type: "boolean",
      default: "true",
      description: "Whether to render the multi-layered pine forest silhouette at the bottom.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "true",
      description: "Gently attracts nearby fireflies toward the pointer position.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the firefly canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { Fireflies } from "@/components/ui/Fireflies";

export default function FirefliesDemo() {
  return (
    <Fireflies
      count={65}
      glowColor="#D9F99D"
      speed={1.0}
      pulseRate={1.1}
      showForest
      interactive
    >
      <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Into the Quiet Woods
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          Bioluminescent particles drifting through a calm twilight sanctuary.
        </p>
      </div>
    </Fireflies>
  );
}`,
};

export default meta;
