import type { PulseComponentMeta } from "../../types/component";

export const GalaxyNebulaMeta: PulseComponentMeta = {
  title: "Galaxy & Nebula",
  description:
    "Real-time WebGL fragment shader rendering a rotating spiral galaxy and cosmic dust nebula using 5-octave Fractional Brownian Motion (FBM) noise.",
  tagline: "WebGL FBM fractal noise nebula with spiral rotation.",
  category: "Backgrounds",
  badges: ["New", "WebGL Shader", "FBM Noise"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "galaxy nebula background",
    "webgl fbm shader",
    "fractal noise nebula",
    "cosmic space shader",
    "rotating galaxy background",
  ],
  features: [
    "GPU-accelerated WebGL GLSL fragment shader computing 5-octave Fractional Brownian Motion (`fbm`).",
    "Polar coordinate spiral arm warping with a luminous galactic core.",
    "Includes Andromeda, Orion, and Supernova color presets in the interactive preview.",
  ],
  accessibility: [
    "Marks the `<canvas>` shader viewport with `aria-hidden='true'`.",
    "Maintains high-contrast text legibility with subtle drop shadows.",
    "Preset selector buttons support keyboard focus.",
  ],
  props: [
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Time multiplier for internal nebula turbulence.",
    },
    {
      name: "rotationSpeed",
      type: "number",
      default: "0.25",
      description: "Angular velocity of the spiral galaxy arms.",
    },
    {
      name: "primaryColor",
      type: "string",
      default: '"#8B5CF6"',
      description: "Hex color for the inner nebula filaments.",
    },
    {
      name: "secondaryColor",
      type: "string",
      default: '"#06B6D4"',
      description: "Hex color for the outer cosmic dust cloud.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the shader.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { GalaxyNebula } from "@/components/ui/galaxy-nebula";

export function Example() {
  return (
    <GalaxyNebula
      speed={1}
      rotationSpeed={0.25}
      primaryColor="#8B5CF6"
      secondaryColor="#06B6D4"
    />
  );
}`,
};

export default GalaxyNebulaMeta;
