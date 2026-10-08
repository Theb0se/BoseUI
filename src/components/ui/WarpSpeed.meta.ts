import type { PulseComponentMeta } from "../../types/component";

export const WarpSpeedMeta: PulseComponentMeta = {
  title: "Warp Speed",
  description:
    "3D hyperspace starfield using perspective projection (`screenX = x / z`, `screenY = y / z`), delta-time streak rendering, a cursor-following vanishing point, and a warp jump accelerator.",
  tagline: "3D hyperspace tunnel with warp jump and cursor vanishing point.",
  category: "Backgrounds",
  badges: ["New", "3D Projection", "Canvas 2D"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "warp speed background",
    "hyperspace starfield",
    "star wars jump effect",
    "3d star projection canvas",
    "space tunnel animation",
  ],
  features: [
    "Projects `(x, y, z)` coordinates each frame using `x / z` perspective division and draws velocity streaks from the previous frame.",
    "Smoothly ramps velocity 5x when `warp` mode is engaged.",
    "Vanishing point smoothly tracks the user's pointer or locks to a custom `center` coordinate.",
  ],
  accessibility: [
    "Marks the `<canvas>` layer with `aria-hidden='true'`.",
    "Interactive 'Engage Warp Jump' toggle button is keyboard accessible.",
    "Maintains high-contrast text legibility over the `#03050C` space canvas.",
  ],
  props: [
    {
      name: "speed",
      type: "number",
      default: "180",
      description: "Base forward Z-axis travel speed.",
    },
    {
      name: "starCount",
      type: "number",
      default: "320",
      description: "Number of 3D stars inside the projection volume.",
    },
    {
      name: "streakLength",
      type: "number",
      default: "1.4",
      description: "Length multiplier for each star's motion-blur streak.",
    },
    {
      name: "warp",
      type: "boolean",
      default: "false",
      description: "Ramps velocity up 5x for the hyperspace jump effect.",
    },
    {
      name: "center",
      type: "{ x: number; y: number }",
      default: "{ x: 0.5, y: 0.5 }",
      description: "Normalized vanishing point coordinates (0 to 1).",
    },
    {
      name: "followCursor",
      type: "boolean",
      default: "true",
      description: "Steers the vanishing point toward the cursor on hover.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the warp tunnel.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { WarpSpeed } from "@/components/ui/warp-speed";

export function Example() {
  return (
    <WarpSpeed
      speed={180}
      starCount={320}
      streakLength={1.4}
      followCursor
    />
  );
}`,
};

export default WarpSpeedMeta;
