import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Constellation Map",
  description:
    "Astronomical SVG star chart plotting authentic geometries for Orion, Cassiopeia, Ursa Major, Cygnus, and Lyra over a celestial Right Ascension and Declination coordinate grid with animated stroke-dashoffset line tracing.",
  tagline: "Precision J2000.0 celestial star chart with animated constellation vectors.",
  category: "Backgrounds",
  badges: ["SVG Vector", "Astrometry", "Interactive"],
  createdAt: "2026-10-08",
  keywords: [
    "constellation map",
    "star chart background",
    "astronomy svg",
    "celestial grid",
    "orion cassiopeia",
  ],
  features: [
    "Authentic stellar coordinates and Bayer designations for Orion, Cassiopeia, Ursa Major, Cygnus, and Lyra.",
    "Staggered SVG pathLength vector animation over a toggleable Right Ascension / Declination grid.",
    "Interactive star nodes displaying apparent visual magnitude and Bayer designation telemetry on hover.",
  ],
  accessibility: [
    "Semantic SVG chart includes an aria-label while background field stars are marked aria-hidden='true'.",
    "Interactive HUD toggles support full keyboard navigation and clear active state indicators.",
  ],
  props: [
    {
      name: "lineColor",
      type: "string",
      default: '"#38BDF8"',
      description: "Stroke color for constellation edges and celestial grid lines.",
    },
    {
      name: "starColor",
      type: "string",
      default: '"#F8FAFC"',
      description: "Fill color for primary constellation star nodes and field stars.",
    },
    {
      name: "drawSpeed",
      type: "number",
      default: "1.0",
      description: "Speed multiplier for the constellation line-drawing animation.",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      description: "Renders Right Ascension meridians, Declination parallels, and the ecliptic arc.",
    },
    {
      name: "showLabels",
      type: "boolean",
      default: "true",
      description: "Displays constellation headers, Bayer designations, and star names.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground overlay content.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { ConstellationMap } from "@/components/ui/ConstellationMap";

export function Example() {
  return (
    <ConstellationMap
      lineColor="#38BDF8"
      starColor="#F8FAFC"
      drawSpeed={1.2}
      showGrid
      showLabels
    />
  );
}`,
};

export default meta;
