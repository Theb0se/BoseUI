import type { PulseComponentMeta } from "../../types/component";

export const PerspectiveTiltTextMeta: PulseComponentMeta = {
  title: "Perspective Tilt Text",
  description:
    "Large display typography that tilts in 3D perspective with realistic depth layer separation and parallax extrusion shadow.",
  tagline: "3D cursor-tracking display typography with parallax extrusion depth.",
  category: "Text",
  badges: ["New", "3D Typography", "Parallax"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "tilt text",
    "3d typography",
    "parallax text",
    "perspective text",
    "framer motion tilt",
  ],
  features: [
    "Real-time cursor coordinate normalization calculating 3D rotateX and rotateY angles.",
    "Dual-layer transform-style: preserve-3d structure simulating physical material thickness.",
    "Smooth Hooke's Law spring interpolation preventing harsh pointer jitter.",
    "Prefe-reduced-motion fallback disabling 3D transformations.",
  ],
  accessibility: [
    "Extrusion underlayer masked with aria-hidden='true' to avoid double-reading.",
    "Accessible font rendering preserved.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Display text phrase or large metric to render.",
    },
    {
      name: "maxTilt",
      type: "number",
      default: "18",
      description: "Maximum angular tilt limit in degrees.",
    },
    {
      name: "depth",
      type: "number",
      default: "8",
      description: "Parallax extrusion shadow displacement in pixels.",
    },
  ],
  usageCode: `import { PerspectiveTiltText } from "@/components/ui/perspective-tilt-text";

export function Example() {
  return (
    <PerspectiveTiltText
      text="99.9% UPTIME"
      className="text-6xl uppercase"
    />
  );
}`,
};

export default PerspectiveTiltTextMeta;
