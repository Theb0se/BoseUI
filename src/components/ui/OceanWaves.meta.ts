import type { PulseComponentMeta } from "../../types/component";

export const OceanWavesMeta: PulseComponentMeta = {
  title: "Ocean Waves",
  description:
    "Multi-layered rolling ocean waves rendered on Canvas 2D using multi-harmonic trochoidal wave equations, translucent subsurface ridge scattering, and shimmering crest foam highlights.",
  tagline: "Multi-harmonic parallax ocean swells with subsurface glow.",
  category: "Backgrounds",
  badges: ["New", "Canvas 2D", "Parallax Swells"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "ocean waves background",
    "sea swell animation",
    "parallax water waves",
    "trochoidal wave canvas",
    "subsurface scattering water",
  ],
  features: [
    "5+ stacked parallax wave layers computed via 3-harmonic sine and cosine superposition.",
    "Translucent subsurface turquoise ridge glow with depth-graded ocean color attenuation.",
    "Shimmering white crest foam lines and dynamic peak sparkles along breaking wave ridges.",
  ],
  accessibility: [
    "Marks decorative wave canvas with `aria-hidden='true'`.",
    "Maintains accessible contrast over dark abyssal gradients for hero typography and controls.",
    "Interactive swell and foam controls are keyboard accessible.",
  ],
  props: [
    {
      name: "waveCount",
      type: "number",
      default: "5",
      description: "Number of stacked parallax ocean wave layers (3 to 9).",
    },
    {
      name: "amplitude",
      type: "number",
      default: "28",
      description: "Peak vertical wave height in pixels.",
    },
    {
      name: "frequency",
      type: "number",
      default: "0.008",
      description: "Horizontal wave frequency in radians per pixel.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Animation speed multiplier for wave propagation.",
    },
    {
      name: "oceanColor",
      type: "string",
      default: '"#0284C7"',
      description: "Base hex color used to compute subsurface crest and deep water gradients.",
    },
    {
      name: "foam",
      type: "boolean",
      default: "true",
      description: "Toggles shimmering white foam lines and peak sparkles along wave crests.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the ocean waves.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { OceanWaves } from "@/components/ui/ocean-waves";

export function Example() {
  return (
    <OceanWaves
      waveCount={5}
      amplitude={28}
      frequency={0.008}
      speed={1.0}
      oceanColor="#0284C7"
      foam
    />
  );
}`,
};

export default OceanWavesMeta;
