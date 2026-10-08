import type { PulseComponentMeta } from "../../types/component";

export const ShootingStarsMeta: PulseComponentMeta = {
  title: "Shooting Stars",
  description:
    "Atmospheric meteor shower background that spawns diagonal shooting stars with glowing heads and transparent gradient tails at configurable intervals.",
  tagline: "Diagonal shooting stars with gradient tails and lifecycle fade.",
  category: "Backgrounds",
  badges: ["New", "Space UI", "Canvas 2D"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "shooting stars background",
    "meteor shower animation",
    "falling stars css canvas",
    "space hero background",
    "streak animation",
  ],
  features: [
    "Spawns meteors at randomized coordinates and intervals with a glowing head and fading linear-gradient tail.",
    "Configurable trajectory `angle`, `frequency`, `color`, and `maxConcurrent` limit.",
    "Automatically cleans up each meteor after its ~1-second lifecycle.",
  ],
  accessibility: [
    "Marks decorative `<canvas>` and starfield layers with `aria-hidden='true'`.",
    "Maintains crisp white text legibility over the `#05070F` space backdrop.",
    "Interactive 'Spawn Meteor' trigger is keyboard accessible.",
  ],
  props: [
    {
      name: "frequency",
      type: "number",
      default: "2.5",
      description: "Average number of shooting stars spawned per second.",
    },
    {
      name: "angle",
      type: "number",
      default: "35",
      description: "Diagonal travel angle in degrees.",
    },
    {
      name: "color",
      type: "string",
      default: '"#FFFFFF"',
      description: "Hex or RGB color of the meteor head and tail.",
    },
    {
      name: "maxConcurrent",
      type: "number",
      default: "6",
      description: "Maximum number of shooting stars visible at the same time.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the meteor shower.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { ShootingStars } from "@/components/ui/shooting-stars";

export function Example() {
  return (
    <ShootingStars
      frequency={2.5}
      angle={35}
      color="#FFFFFF"
      maxConcurrent={6}
    />
  );
}`,
};

export default ShootingStarsMeta;
