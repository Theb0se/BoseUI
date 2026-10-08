import type { PulseComponentMeta } from "../../types/component";

export const CloudsDriftMeta: PulseComponentMeta = {
  title: "Clouds Drift",
  description:
    "Seamless multi-layer CSS cloud parallax background where far, mid, and near cloud formations drift horizontally at independent speeds.",
  tagline: "Multi-layer CSS cloud parallax with day, sunset, and night skies.",
  category: "Backgrounds",
  badges: ["New", "CSS Parallax", "Atmosphere"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "clouds drift background",
    "parallax clouds css",
    "moving sky clouds",
    "weather hero background",
    "infinite cloud loop",
  ],
  features: [
    "Three depth planes (far, mid, near) moving on independent `translate3d(-50%, 0, 0)` infinite loops.",
    "Supports `day`, `sunset`, and `night` atmospheric color palettes.",
    "Pure CSS hardware-accelerated transforms with zero JavaScript animation loop.",
  ],
  accessibility: [
    "Marks decorative cloud layers with `aria-hidden='true'`.",
    "Interactive sky theme switcher buttons support keyboard focus.",
    "Maintains readable foreground contrast across all three sky presets.",
  ],
  props: [
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Horizontal drift speed multiplier.",
    },
    {
      name: "opacity",
      type: "number",
      default: "0.85",
      description: "Overall cloud opacity multiplier (0.2 to 1).",
    },
    {
      name: "variant",
      type: '"day" | "sunset" | "night"',
      default: '"day"',
      description: "Atmospheric sky palette.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the clouds.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { CloudsDrift } from "@/components/ui/clouds-drift";

export function Example() {
  return (
    <CloudsDrift
      variant="day"
      speed={1}
      opacity={0.85}
    />
  );
}`,
};

export default CloudsDriftMeta;
