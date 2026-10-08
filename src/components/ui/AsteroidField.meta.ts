import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Asteroid Field",
  description:
    "Deep-space parallax asteroid field and meteor shower on Canvas 2D featuring procedural faceted rock polygons across three depth layers, crater shading, ambient dust motes, and high-speed bolide meteors.",
  tagline: "Three-layer parallax planetesimals with live meteor showers.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Parallax", "Procedural", "Cosmic"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "asteroid field",
    "meteor shower",
    "space debris",
    "parallax background",
    "kuiper belt",
    "shooting stars",
    "procedural rocks",
  ],
  features: [
    "Procedurally generated faceted polygon rocks with directional solar shading and surface craters",
    "Three distinct parallax depth planes (far, mid, near) rotating and drifting at realistic relative speeds",
    "High-speed glowing bolide meteors with linear gradient plasma tails",
    "Three mineral composition palettes: Basalt, Kuiper Ice, and Ferrous Iron",
  ],
  accessibility: [
    "Decorative canvas is marked aria-hidden so screen readers focus on foreground content",
    "Velocity slider allows slowing or pausing orbital drift for motion-sensitive users",
  ],
  props: [
    {
      name: "asteroidCount",
      type: "number",
      default: "32",
      description: "Total number of procedural faceted asteroids across the 3 depth layers.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Parallax drift velocity multiplier.",
    },
    {
      name: "angle",
      type: "number",
      default: "18",
      description: "Drift trajectory angle in degrees.",
    },
    {
      name: "meteorFrequency",
      type: "number",
      default: "0.4",
      description: "Spawn probability multiplier for high-speed glowing meteors.",
    },
    {
      name: "colorTheme",
      type: '"basalt" | "ice" | "iron"',
      default: '"basalt"',
      description: "Mineral color palette applied to asteroids, craters, and meteors.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the asteroid field.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the root container.",
    },
  ],
  usageCode: `import { AsteroidField } from "@/components/ui/AsteroidField";

export function AsteroidFieldDemo() {
  return (
    <AsteroidField
      asteroidCount={32}
      speed={1.0}
      angle={18}
      meteorFrequency={0.4}
      colorTheme="basalt"
    />
  );
}`,
};

export default meta;
