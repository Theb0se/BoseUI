import type { PulseComponentMeta } from "../../types/component";

export const GravityWellPortalMeta: PulseComponentMeta = {
  title: "Gravity Well Portal",
  description:
    "Multi-node gravitational field stage where spring-tethered telemetry badges warp toward or repel from the pointer with polarity inversion.",
  tagline: "Multi-node gravitational attraction and repulsion spring field.",
  category: "Motion",
  badges: ["New", "Vector Field", "Zero Re-renders"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "gravity well portal",
    "magnetic particle field",
    "vector field animation",
    "framer motion physics",
    "repel attract nodes",
  ],
  features: [
    "Simultaneous 2D vector field attraction and repulsion across 6 spring-tethered telemetry nodes.",
    "Click or keyboard toggle to invert field polarity between gravitational pull and radial repulsion.",
    "Zero React state re-renders during pointer movement via Framer Motion useTransform.",
  ],
  accessibility: [
    "Provides a keyboard-focusable polarity toggle button announcing Attract and Repel states.",
    "Marks decorative orbital rings and floating telemetry badges with aria-hidden='true'.",
    "Locks all orbital nodes at their anchor coordinates when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "pullRadius",
      type: "number",
      default: "180",
      description: "Gravitational influence radius in pixels around the cursor.",
    },
    {
      name: "pullStrength",
      type: "number",
      default: "0.55",
      description: "Peak attraction or repulsion displacement factor (0.1 to 0.9).",
    },
    {
      name: "stiffness",
      type: "number",
      default: "240",
      description: "Hooke's Law spring stiffness coefficient for node tethers.",
    },
    {
      name: "damping",
      type: "number",
      default: "20",
      description: "Spring damping coefficient controlling node oscillation decay.",
    },
  ],
  usageCode: `import { GravityWellPortal } from "@/components/ui/gravity-well-portal";

export function Example() {
  return (
    <GravityWellPortal pullRadius={180} pullStrength={0.55} />
  );
}`,
};

export default GravityWellPortalMeta;
