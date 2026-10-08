import type { PulseComponentMeta } from "../../types/component";

export const SnowfallMeta: PulseComponentMeta = {
  title: "Snowfall",
  description:
    "Depth-sorted Canvas 2D snowfall simulation where larger foreground particles fall faster with higher opacity while drifting horizontally on sine waves.",
  tagline: "Depth-sorted snowfall with horizontal sine drift.",
  category: "Backgrounds",
  badges: ["New", "Weather UI", "Canvas 2D"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "snowfall background",
    "winter snow canvas",
    "falling snow animation",
    "depth parallax snow",
    "weather effect",
  ],
  features: [
    "Couples particle radius, opacity, and fall velocity to a depth factor (`0.2..1.0`) for natural 3D depth perception.",
    "Horizontal sine-wave oscillation (`Math.sin`) combined with configurable wind slant.",
    "Includes a Gentle Flurry / Winter Gale toggle in the default preview.",
  ],
  accessibility: [
    "Marks the `<canvas>` layer with `aria-hidden='true'`.",
    "High-contrast typography over the winter night backdrop.",
    "Interactive mode toggle button supports keyboard focus.",
  ],
  props: [
    {
      name: "flakeCount",
      type: "number",
      default: "140",
      description: "Number of snowflakes rendered on the canvas.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Vertical fall speed multiplier.",
    },
    {
      name: "wind",
      type: "number",
      default: "0.3",
      description: "Horizontal wind velocity factor (-2 to 2).",
    },
    {
      name: "maxSize",
      type: "number",
      default: "4.2",
      description: "Maximum snowflake radius in pixels.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the snowfall.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { Snowfall } from "@/components/ui/snowfall";

export function Example() {
  return (
    <Snowfall
      flakeCount={140}
      speed={1}
      wind={0.3}
    />
  );
}`,
};

export default SnowfallMeta;
