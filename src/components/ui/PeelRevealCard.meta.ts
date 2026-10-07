import type { PulseComponentMeta } from "../../types/component";

export const PeelRevealCardMeta: PulseComponentMeta = {
  title: "Peel Reveal Card",
  description:
    "Dual-layer vault card with a spring-hinged top cover that peels upward on hover or keyboard activation to reveal sensitive credentials.",
  tagline: "Spring-hinged top cover that peels back to reveal vault data.",
  category: "Cards",
  badges: ["New", "Vault Reveal", "Spring Hinge"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "peel reveal card",
    "secret key reveal ui",
    "api key card react",
    "framer motion reveal card",
    "curtain peel animation",
  ],
  features: [
    "Spring-hinged cover sheet that lifts upward with 3D rotateX perspective on hover or click.",
    "Built-in one-click clipboard copy button inside the underlying vault layer.",
    "Full keyboard toggle support via Enter and Space keys.",
  ],
  accessibility: [
    "Cover layer implements role='button' with aria-expanded and descriptive aria-label.",
    "Underlying Copy Key button is directly focusable via Tab.",
    "Disables 3D tilt and spring oscillation when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Production Secret Key"',
      description: "Heading text displayed on the protective cover layer.",
    },
    {
      name: "secretValue",
      type: "string",
      default: '"bose_live_98f72a41c09e3b1d"',
      description: "Hidden string revealed inside the vault layer when peeled.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "300",
      description: "Spring stiffness coefficient for the curtain peel motion.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient controlling curtain settle.",
    },
  ],
  usageCode: `import { PeelRevealCard } from "@/components/ui/peel-reveal-card";

export function Example() {
  return (
    <PeelRevealCard
      title="Production Secret Key"
      secretValue="bose_live_98f72a41c09e3b1d"
    />
  );
}`,
};

export default PeelRevealCardMeta;
