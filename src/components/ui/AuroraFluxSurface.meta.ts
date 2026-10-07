import type { PulseComponentMeta } from "../../types/component";

export const AuroraFluxSurfaceMeta: PulseComponentMeta = {
  title: "Aurora Flux Surface",
  description:
    "GPU-composited ambient aurora canvas where dual radial luminance fields with contrasting spring mass chase the pointer.",
  tagline: "Dual-mass GPU radial aurora surface with zero React re-renders.",
  category: "Backgrounds",
  badges: ["New", "Dual-Mass Spring", "GPU Composited"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "aurora flux surface",
    "ambient glow background",
    "radial gradient cursor",
    "framer motion aurora",
    "hero background surface",
  ],
  features: [
    "Pairs a low-mass leading radial orb (m=0.4) with a high-mass trailing orb (m=1.4) for organic fluidseparation.",
    "Composited directly via Framer Motion useMotionTemplate with zero React state re-renders.",
    "Monochrome architectural dot overlay preserving BoseUI's high-contrast aesthetic.",
  ],
  accessibility: [
    "Marks all ambient luminance and dot texture layers with aria-hidden='true'.",
    "Freezes luminance orb coordinates when prefers-reduced-motion is active.",
    "Preserves WCAG AA contrast inside the foreground container.",
  ],
  props: [
    {
      name: "orbRadius",
      type: "number",
      default: "260",
      description: "Radius of the primary radial luminance field in pixels.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "180",
      description: "Spring stiffness coefficient for the leading luminance orb.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient controlling luminance trail decay.",
    },
  ],
  usageCode: `import { AuroraFluxSurface } from "@/components/ui/aurora-flux-surface";

export function Example() {
  return (
    <AuroraFluxSurface orbRadius={260} stiffness={180} damping={24} />
  );
}`,
};

export default AuroraFluxSurfaceMeta;
