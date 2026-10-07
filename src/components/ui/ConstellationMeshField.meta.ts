import type { PulseComponentMeta } from "../../types/component";

export const ConstellationMeshFieldMeta: PulseComponentMeta = {
  title: "Constellation Mesh Field",
  description:
    "Interactive SVG vertex constellation surface that dynamically tethers proximity edges to the pointer with spring-scaled nodes.",
  tagline: "Interactive SVG constellation graph with pointer proximity edges.",
  category: "Backgrounds",
  badges: ["New", "SVG Graph", "Proximity Mesh"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "constellation mesh field",
    "particle network background",
    "connected nodes svg",
    "framer motion background",
    "interactive graph surface",
  ],
  features: [
    "Crisp vector SVG constellation lattice that scales cleanly to any container resolution.",
    "Real-time Euclidean distance culling that draws opacity-graded edges between the pointer and nearby vertices.",
    "Spring-inflated vertex radii when captured within the pointer's connection radius.",
  ],
  accessibility: [
    "Decorative SVG graph layer is marked aria-hidden='true'.",
    "Disables dynamic edge tethering when prefers-reduced-motion is enabled.",
    "Maintains high foreground text contrast inside a translucent HUD card.",
  ],
  props: [
    {
      name: "connectRadius",
      type: "number",
      default: "130",
      description: "Maximum Euclidean distance in viewBox units to connect pointer edges.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the constellation mesh.",
    },
  ],
  usageCode: `import { ConstellationMeshField } from "@/components/ui/constellation-mesh-field";

export function Example() {
  return (
    <ConstellationMeshField connectRadius={130} />
  );
}`,
};

export default ConstellationMeshFieldMeta;
