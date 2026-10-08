import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Isometric City",
  description:
    "Procedural 3D-projected isometric night cityscape rendered on HTML5 Canvas 2D with depth-sorted skyscrapers, flickering office windows, rooftop aviation beacons, and avenue light-streak traffic.",
  tagline: "Procedural isometric night metropolis with live avenue light streaks.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Isometric 3D", "Procedural"],
  createdAt: "2026-10-08",
  keywords: [
    "isometric city",
    "cyberpunk cityscape",
    "procedural buildings canvas",
    "night city background",
    "isometric grid",
  ],
  features: [
    "True painter's-algorithm depth sorting across procedurally generated 3D isometric city blocks.",
    "Hundreds of individual perspective-aligned office windows that subtly toggle on and off alongside rooftop aviation beacons.",
    "Bi-directional headlight and taillight light-streaks gliding smoothly along the isometric avenue grid.",
  ],
  accessibility: [
    "Canvas city projection is marked aria-hidden='true' to prevent screen reader noise.",
    "Interactive palette, window-flicker, and city regeneration buttons support keyboard focus and clear state labels.",
  ],
  props: [
    {
      name: "gridSize",
      type: "number",
      default: "7",
      description: "Number of city blocks generated along each isometric axis (4 to 10).",
    },
    {
      name: "buildingDensity",
      type: "number",
      default: "0.78",
      description: "Probability (0.3 to 1.0) that a grid parcel spawns a tower.",
    },
    {
      name: "trafficSpeed",
      type: "number",
      default: "1.0",
      description: "Velocity multiplier for avenue headlight and taillight streaks.",
    },
    {
      name: "colorPalette",
      type: '"cyberpunk" | "midnight" | "amber"',
      default: '"midnight"',
      description: "Color theme controlling sky gradient, facade shading, and window hues.",
    },
    {
      name: "windowFlicker",
      type: "boolean",
      default: "true",
      description: "Enables stochastic real-time toggling of individual office windows.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the cityscape.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { IsometricCity } from "@/components/ui/IsometricCity";

export function Example() {
  return (
    <IsometricCity
      gridSize={7}
      buildingDensity={0.8}
      trafficSpeed={1.0}
      colorPalette="midnight"
      windowFlicker
    />
  );
}`,
};

export default meta;
