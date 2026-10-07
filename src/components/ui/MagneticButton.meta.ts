import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Magnetic Button",
  description:
    "Tactile button with dual-layer spring attraction that gravitates toward the pointer with configurable mass, stiffness, and damping.",
  tagline: "Dual-layer Hooke's Law spring attraction for high-impact CTAs.",
  category: "Buttons",
  badges: ["Signature", "Spring Physics", "A11y Ready"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "magnetic button",
    "framer motion button",
    "spring physics button",
    "react kinetic cta",
    "tailwind button",
  ],
  features: [
    "Dual-layer spring solver displacing both button frame and inner label for realistic parallax depth.",
    "Zero React re-renders during pointer movement via Framer Motion MotionValues.",
    "Minimal monochrome surface variants supporting both light and dark modes.",
  ],
  accessibility: [
    "Renders a semantic native <button> element with full Enter and Space keyboard activation.",
    "High-contrast 2px focus-visible ring for keyboard navigation.",
    "Respects prefers-reduced-motion automatically via Framer Motion's useReducedMotion() hook.",
  ],
  props: [
    {
      name: "strength",
      type: "number",
      default: "0.35",
      description:
        "Multiplier controlling how strongly the button gravitates toward the pointer (0.1 to 1.0).",
    },
    {
      name: "stiffness",
      type: "number",
      default: "180",
      description:
        "Spring stiffness coefficient controlling snap responsiveness.",
    },
    {
      name: "damping",
      type: "number",
      default: "15",
      description:
        "Oscillation damping coefficient preventing excessive bounce on pointer exit.",
    },
    {
      name: "mass",
      type: "number",
      default: "0.2",
      description: "Simulated physical mass of the button element.",
    },
    {
      name: "variant",
      type: '"primary" | "secondary" | "outline" | "glow"',
      default: '"primary"',
      description: "Visual surface treatment preset.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Padding, typography, and border-radius scale.",
    },
  ],
  usageCode: `import { MagneticButton } from "@/components/ui/magnetic-button";
import { Sparkles } from "lucide-react";

export function Example() {
  return (
    <MagneticButton variant="primary" size="lg" strength={0.4}>
      <Sparkles className="h-4 w-4" />
      <span>Deploy Kinetic UI</span>
    </MagneticButton>
  );
}`,
};

export default meta;
