import type { PulseComponentMeta } from "../../types/component";

export const GridHorizonMeta: PulseComponentMeta = {
  title: "Grid Horizon",
  description:
    "Pure CSS 3D perspective synthwave horizon using `perspective(320px) rotateX(64deg)` and `background-position-y` animation for an endless wireframe road effect.",
  tagline: "3D perspective synthwave grid with endless scroll and horizon sun.",
  category: "Backgrounds",
  badges: ["New", "Synthwave 3D", "CSS Only"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "grid horizon",
    "synthwave grid css",
    "perspective grid road",
    "outrun sunset background",
    "3d wireframe horizon",
  ],
  features: [
    "Uses CSS `perspective(320px)` and `rotateX(64deg)` to project a 2D repeating grid into a 3D infinite plane.",
    "Segmented scanline sun orb and glowing horizon divider line.",
    "Includes Synthwave, Cyber, and Mono theme switcher pills in the default preview.",
  ],
  accessibility: [
    "Marks decorative 3D grid and sun layers with `aria-hidden='true'`.",
    "High-contrast foreground text with drop-shadow separation.",
    "Theme switcher buttons are keyboard focusable.",
  ],
  props: [
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Scroll velocity multiplier for the grid road.",
    },
    {
      name: "gridColor",
      type: "string",
      default: '"rgba(236, 72, 153, 0.55)"',
      description: "CSS color string for the perspective grid lines.",
    },
    {
      name: "sunColor",
      type: "string",
      default: '"#F97316"',
      description: "Core color of the horizon sun.",
    },
    {
      name: "gridSize",
      type: "number",
      default: "44",
      description: "Grid tile size in pixels.",
    },
    {
      name: "showSun",
      type: "boolean",
      default: "true",
      description: "Toggles the segmented synthwave sun on the horizon.",
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
  usageCode: `import { GridHorizon } from "@/components/ui/grid-horizon";

export function Example() {
  return (
    <GridHorizon
      speed={1}
      gridSize={44}
      showSun
    />
  );
}`,
};

export default GridHorizonMeta;
