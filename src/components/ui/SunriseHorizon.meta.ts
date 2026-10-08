import type { PulseComponentMeta } from "../../types/component";

export const SunriseHorizonMeta: PulseComponentMeta = {
  title: "Sunrise Horizon",
  description:
    "Layered atmospheric sky background that interpolates zenith, horizon, and solar glow gradients along a continuous solar arc from dawn to noon to dusk.",
  tagline: "Dynamic sky gradient with solar arc and horizon silhouettes.",
  category: "Backgrounds",
  badges: ["New", "Atmosphere", "Pure CSS"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "sunrise horizon",
    "sky gradient background",
    "day night cycle css",
    "sunset animation",
    "atmospheric hero background",
  ],
  features: [
    "Interpolates deep navy, violet, amber, and sky-blue stops via a normalized `time` value (0 to 1) or named presets ('dawn', 'noon', 'dusk').",
    "Translates the sun orb and radial horizon bloom along a sinusoidal arc behind SVG mountain silhouettes.",
    "Includes interactive Dawn/Noon/Dusk preset buttons and a live solar-arc scrubber out of the box.",
  ],
  accessibility: [
    "Decorative sky layers and SVG silhouettes are marked with `aria-hidden='true'`.",
    "Interactive time scrubber and play/pause controls include explicit `aria-label` attributes.",
    "Supports pausing continuous sky animation at any time.",
  ],
  props: [
    {
      name: "time",
      type: 'number | "dawn" | "noon" | "dusk"',
      default: '"dawn"',
      description: "Time of day from 0 to 1, or a named preset ('dawn', 'noon', 'dusk').",
    },
    {
      name: "autoplay",
      type: "boolean",
      default: "true",
      description: "Continuously animates the solar arc through the day cycle.",
    },
    {
      name: "sunSize",
      type: "number",
      default: "92",
      description: "Diameter of the sun orb in pixels.",
    },
    {
      name: "grain",
      type: "boolean",
      default: "true",
      description: "Overlays a subtle atmospheric grain texture.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the horizon.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { SunriseHorizon } from "@/components/ui/sunrise-horizon";

export function Example() {
  return (
    <SunriseHorizon
      time="dawn"
      autoplay
      sunSize={96}
      grain
    />
  );
}`,
};

export default SunriseHorizonMeta;
