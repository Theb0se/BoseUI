import type { PulseComponentMeta } from "../../types/component";

export const WaterRipplesMeta: PulseComponentMeta = {
  title: "Water Ripples",
  description:
    "Interactive water surface ripple simulation combining a real-time 2D finite-difference wave-equation height-map buffer with expanding specular caustic refraction rings triggered by cursor wakes, clicks, and ambient droplets.",
  tagline: "Interactive 2D wave-equation height-map and specular ripple rings.",
  category: "Backgrounds",
  badges: ["New", "Interactive", "Wave Physics"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "water ripples background",
    "interactive water canvas",
    "2d wave equation",
    "rain drop ripples",
    "cursor wake effect",
  ],
  features: [
    "Real-time 2D finite-difference height-map solver computing surface normal refraction per pixel.",
    "High-DPI concentric specular harmonic rings that expand and constructively interfere.",
    "Responds to pointer wakes, click impacts, and toggleable periodic rain droplets.",
  ],
  accessibility: [
    "Marks the simulation canvas with `aria-hidden='true'`.",
    "Stop-propagates pointer events on HUD controls so slider adjustments do not trigger unwanted splashes.",
    "Supports non-interactive ambient mode via `interactive={false}`.",
  ],
  props: [
    {
      name: "damping",
      type: "number",
      default: "0.97",
      description: "Wave energy retention multiplier per simulation step (0.90 to 0.995).",
    },
    {
      name: "rippleRadius",
      type: "number",
      default: "140",
      description: "Maximum expansion radius in pixels for spawned concentric specular rings.",
    },
    {
      name: "ambientDrops",
      type: "boolean",
      default: "true",
      description: "Automatically drops periodic rain ripples onto the water surface.",
    },
    {
      name: "color",
      type: "string",
      default: '"#38BDF8"',
      description: "Hex color tint for refracted surface normals and specular caustic rings.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "true",
      description: "Enables pointer movement wakes and click splash disturbances.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the water surface.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { WaterRipples } from "@/components/ui/water-ripples";

export function Example() {
  return (
    <WaterRipples
      damping={0.97}
      rippleRadius={140}
      ambientDrops
      color="#38BDF8"
      interactive
    />
  );
}`,
};

export default WaterRipplesMeta;
