import type { PulseComponentMeta } from "../../types/component";

export const ParallaxTiltCardMeta: PulseComponentMeta = {
  title: "Parallax Tilt Card",
  description:
    "Multi-depth 3D spatial card featuring three independent Z-planes that shift at graduated parallax ratios under pointer movement.",
  tagline: "Three-plane spatial parallax card with coupled 3D tilt.",
  category: "Cards",
  badges: ["New", "3D Parallax", "Zero Re-renders"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "parallax tilt card",
    "3d depth card",
    "spatial ui card",
    "framer motion parallax",
    "multi layer tilt card",
  ],
  features: [
    "Three graduated parallax translation planes (±6px, ±16px, ±26px) coupled with ±14° 3D perspective rotation.",
    "Driven entirely by Framer Motion useTransform and useSpring with zero React state re-renders.",
    "Automatic spring return to neutral equilibrium on pointer leave.",
  ],
  accessibility: [
    "Marks decorative background dot matrix planes with aria-hidden='true'.",
    "Disables all 3D rotation and parallax plane displacement when prefers-reduced-motion is active.",
    "Preserves semantic heading and paragraph hierarchy for screen readers.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Spatial Depth Plane"',
      description: "Primary heading rendered on the foreground elevation plane.",
    },
    {
      name: "subtitle",
      type: "string",
      default: '"Three independent Z-planes translate at graduated ratios..."',
      description: "Supporting description text rendered below the title.",
    },
    {
      name: "maxTilt",
      type: "number",
      default: "14",
      description: "Peak 3D tilt angle in degrees along X and Y axes.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "240",
      description: "Hooke's Law spring stiffness for tilt and plane parallax.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling settle oscillation.",
    },
  ],
  usageCode: `import { ParallaxTiltCard } from "@/components/ui/parallax-tilt-card";

export function Example() {
  return (
    <ParallaxTiltCard
      title="Spatial Depth Plane"
      maxTilt={14}
      stiffness={240}
      damping={22}
    />
  );
}`,
};

export default ParallaxTiltCardMeta;
