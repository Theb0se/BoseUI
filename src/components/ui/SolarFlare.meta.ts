import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Solar Flare",
  description:
    "Churning solar photosphere and coronal flare background powered by a custom WebGL fragment shader with domain-warped FBM plasma convection cells, magnetic sunspots, and glowing coronal prominences.",
  tagline: "Real-time WebGL photosphere granulation and coronal mass ejections.",
  category: "Backgrounds",
  badges: ["WebGL", "Shader", "FBM", "Cosmic"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "solar flare",
    "sun surface",
    "photosphere",
    "coronal mass ejection",
    "plasma shader",
    "webgl background",
    "fbm noise",
  ],
  features: [
    "Custom WebGL GLSL fragment shader computing spherical normal projection and limb darkening",
    "Multi-octave domain-warped Fractal Brownian Motion (FBM) for boiling plasma convection granules and sunspot umbrae",
    "Dynamic coronal magnetic loops and radial streamers erupting off the solar limb",
    "Livestellar presets (G-Type Photosphere, Blue Hypergiant, Red Magnetar) and interactive MHD controls",
  ],
  accessibility: [
    "WebGL canvas is marked aria-hidden so screen readers focus on foreground hero content",
    "Includes real-time speed and eruption intensity controls for adjusting visual motion",
  ],
  props: [
    {
      name: "coreColor",
      type: "string",
      default: '"#FFF7CC"',
      description: "Hex color of the hottest incandescent plasma filaments and inner limb.",
    },
    {
      name: "flareColor",
      type: "string",
      default: '"#FF5500"',
      description: "Hex color of the chromosphere and erupting coronal prominences.",
    },
    {
      name: "turbulence",
      type: "number",
      default: "1.0",
      description: "Domain-warping FBM turbulence multiplier for plasma granulation.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Animation speed multiplier for plasma convection and flare loops.",
    },
    {
      name: "eruptionIntensity",
      type: "number",
      default: "1.0",
      description: "Intensity multiplier for coronal arches and solar wind streamers.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the solar shader.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the root container.",
    },
  ],
  usageCode: `import { SolarFlare } from "@/components/ui/SolarFlare";

export function SolarFlareDemo() {
  return (
    <SolarFlare
      coreColor="#FFF7CC"
      flareColor="#FF5500"
      turbulence={1.0}
      speed={1.0}
      eruptionIntensity={1.0}
    />
  );
}`,
};

export default meta;
