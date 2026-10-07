import type { PulseComponentMeta } from "../../types/component";

export const HolographicFlipCardMeta: PulseComponentMeta = {
  title: "Holographic Flip Card",
  description:
    "Dual-sided 3D interactive card combining spring-damped perspective tilt, specular foil glare tracking, and a 180-degree Y-axis kinetic flip.",
  tagline: "Coupled 3D perspective tilt, foil sheen, and 180° spring flip.",
  category: "Cards",
  badges: ["New", "3D Perspective", "Spring Flip"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "holographic flip card",
    "3d flip card",
    "perspective tilt card",
    "framer motion 3d card",
    "specular glare card",
  ],
  features: [
    "Couples continuous pointer tilt (±maxTilt degrees) with a 180° Y-axis flip in a single unified spring system.",
    "GPU-composited radial specular foil glare tracked via Framer Motion useMotionTemplate.",
    "True 3D preserve-3d backface culling for crisp front and back surfaces.",
  ],
  accessibility: [
    "Implements role='button' with aria-pressed state and descriptive aria-label announcing current card face.",
    "Supports Enter and Space keys to flip between front and back faces.",
    "Disables continuous 3D tilt rotation when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "front",
      type: "React.ReactNode",
      description: "Optional custom React node rendered on the front face.",
    },
    {
      name: "back",
      type: "React.ReactNode",
      description: "Optional custom React node rendered on the back face.",
    },
    {
      name: "maxTilt",
      type: "number",
      default: "12",
      description: "Maximum 3D tilt angle in degrees along X and Y axes.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "220",
      description: "Hooke's Law spring stiffness for 3D tilt and 180° flip.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling rotational oscillation.",
    },
  ],
  usageCode: `import { HolographicFlipCard } from "@/components/ui/holographic-flip-card";

export function Example() {
  return (
    <HolographicFlipCard maxTilt={12} stiffness={220} damping={22} />
  );
}`,
};

export default HolographicFlipCardMeta;
