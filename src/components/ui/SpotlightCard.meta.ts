import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Spotlight Card",
  description:
    "Minimal surface card with GPU-composited radial cursor illumination, 1px CSS mask border reveal, and optional 3D perspective tilt.",
  tagline: "Cursor-tracked radial spotlight and 1px border illumination.",
  category: "Cards",
  badges: ["Popular", "GPU Composited", "3D Tilt"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "spotlight card",
    "bento card glow",
    "cursor border highlight",
    "framer motion card",
    "minimal black white card",
  ],
  features: [
    "Simultaneous radial surface illumination and 1px CSS mask-composite border reveal.",
    "Zero React re-renders during pointer movement using Framer Motion useMotionTemplate.",
    "Optional damped 3D perspective tilt along X and Y axes.",
  ],
  accessibility: [
    "Decorative radial spotlight and border mask layers are marked aria-hidden='true'.",
    "Automatically disables 3D perspective rotation when prefers-reduced-motion is active.",
    "Preserves full keyboard focus order and semantic child structure.",
  ],
  props: [
    {
      name: "spotlightColor",
      type: "string",
      default: '"rgba(128, 128, 128, 0.14)"',
      description:
        "CSS color value for the internal radial surface illumination.",
    },
    {
      name: "borderColor",
      type: "string",
      default: '"rgba(128, 128, 128, 0.55)"',
      description:
        "CSS color value for the 1px mask-composite border highlight.",
    },
    {
      name: "spotlightRadius",
      type: "number",
      default: "320",
      description: "Radius of the radial spotlight gradient in pixels.",
    },
    {
      name: "enableTilt",
      type: "boolean",
      default: "false",
      description:
        "Enables subtle 3D perspective tilt along X and Y axes on pointer movement.",
    },
  ],
  usageCode: `import { SpotlightCard } from "@/components/ui/spotlight-card";

export function Example() {
  return (
    <SpotlightCard enableTilt>
      <h3 className="text-lg font-semibold">Minimal Surface</h3>
      <p className="mt-2 text-sm text-neutral-500">
        Move your cursor across this surface to reveal the 1px border mask.
      </p>
    </SpotlightCard>
  );
}`,
};

export default meta;
