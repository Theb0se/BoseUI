import type { PulseComponentMeta } from "../../types/component";

export const TopographicRippleSurfaceMeta: PulseComponentMeta = {
  title: "Topographic Ripple Surface",
  description:
    "Concentric contour ring background where pointer movement warps isolines with graduated spring mass and clicks emit a radial ripple.",
  tagline: "Multi-mass concentric contour rings with radial ripple propagation.",
  category: "Backgrounds",
  badges: ["New", "Multi-Mass Springs", "Zero Re-renders"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "topographic ripple surface",
    "contour lines background",
    "parallax rings",
    "framer motion background",
    "isoline wave",
  ],
  features: [
    "Graduated spring stiffness and mass per contour ring so inner isolines track tightly while outer rings trail organically.",
    "Click-triggered radial shockwave that ripples outward across all concentric rings.",
    "Zero React state re-renders during continuous pointer movement.",
  ],
  accessibility: [
    "All decorative contour rings are marked aria-hidden='true'.",
    "Locks contour rings in concentric alignment and disables shockwave scaling when prefers-reduced-motion is active.",
    "Maintains high foreground contrast with a frosted backdrop container.",
  ],
  props: [
    {
      name: "ringCount",
      type: "number",
      default: "6",
      description: "Number of concentric topographic contour rings.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "220",
      description: "Base spring stiffness coefficient for the innermost contour ring.",
    },
    {
      name: "damping",
      type: "number",
      default: "20",
      description: "Base spring damping coefficient for contour displacement.",
    },
  ],
  usageCode: `import { TopographicRippleSurface } from "@/components/ui/topographic-ripple-surface";

export function Example() {
  return (
    <TopographicRippleSurface ringCount={6} stiffness={220} damping={20} />
  );
}`,
};

export default TopographicRippleSurfaceMeta;
