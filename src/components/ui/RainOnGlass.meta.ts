import type { PulseComponentMeta } from "../../types/component";

export const RainOnGlassMeta: PulseComponentMeta = {
  title: "Rain on Glass",
  description:
    "Atmospheric window-pane rain simulation over a blurred bokeh backdrop where droplets slide down with surface-tension stutter, leave bead trails, and refract light.",
  tagline: "Refractive water droplets sliding down a blurred glass pane.",
  category: "Backgrounds",
  badges: ["New", "Weather UI", "Refraction"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "rain on glass",
    "water droplets canvas",
    "rainy window effect",
    "refractive rain animation",
    "weather background",
  ],
  features: [
    "Simulates surface-tension stutter-sliding droplets that spawn smaller trail beads behind them.",
    "Each droplet renders an inverted internal radial gradient and specular rim to mimic glass refraction.",
    "Includes a live Steady Rain / Downpour intensity toggle in the default preview.",
  ],
  accessibility: [
    "Marks decorative bokeh layers and `<canvas>` with `aria-hidden='true'`.",
    "High-contrast typography over the darkened glass surface.",
    "Intensity toggle button is keyboard accessible.",
  ],
  props: [
    {
      name: "dropCount",
      type: "number",
      default: "45",
      description: "Number of primary sliding droplets on the pane.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Gravity slide velocity multiplier.",
    },
    {
      name: "wind",
      type: "number",
      default: "0.05",
      description: "Horizontal wind drift factor (-1 to 1).",
    },
    {
      name: "refraction",
      type: "number",
      default: "0.85",
      description: "Brightness of the internal refractive lens highlight (0 to 1).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the glass.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { RainOnGlass } from "@/components/ui/rain-on-glass";

export function Example() {
  return (
    <RainOnGlass
      dropCount={45}
      speed={1}
      refraction={0.85}
    />
  );
}`,
};

export default RainOnGlassMeta;
