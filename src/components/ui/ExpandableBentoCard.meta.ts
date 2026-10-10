import type { PulseComponentMeta } from "../../types/component";

export const ExpandableBentoCardMeta: PulseComponentMeta = {
  title: "Expandable Bento Card",
  description:
    "Interactive bento surface that expands inline with Hooke's Law spring height projection to reveal secondary diagnostic modules.",
  tagline: "Inline-expanding bento card with spring height projection.",
  category: "Cards",
  badges: ["New", "Bento UI", "Layout Spring"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "expandable bento card",
    "collapsible card react",
    "framer motion accordion card",
    "bento grid card",
    "spring height animation",
  ],
  features: [
    "Smooth inline height and layout projection powered by Framer Motion layout and AnimatePresence.",
    "Rotational spring chevron indicator synchronized with expansion state.",
    "Zero layout shift on neighboring grid cells when paired with layout-aware containers.",
  ],
  accessibility: [
    "Header trigger is a semantic button with aria-expanded state announcement.",
    "Supports Enter and Space keys to toggle expansion.",
    "Collapses transition duration when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "badge",
      type: "string",
      default: '"RUNTIME_TELEMETRY"',
      description: "Eyebrow badge label displayed above the card heading.",
    },
    {
      name: "title",
      type: "string",
      default: '"GPU Compositor Pipeline"',
      description: "Primary heading text of the bento card.",
    },
    {
      name: "defaultExpanded",
      type: "boolean",
      default: "false",
      description: "Whether the diagnostic drawer is expanded on initial mount.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "320",
      description: "Spring stiffness coefficient for height expansion.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling expansion settle.",
    },
  
    {
      name: "summary",
      type: "string",
      defaultValue: "undefined",
      description: "Short summary text displayed when the card is collapsed",
      required: false,
    },
  ],
  usageCode: `import { ExpandableBentoCard } from "@/components/ui/expandable-bento-card";

export function Example() {
  return (
    <ExpandableBentoCard
      badge="RUNTIME_TELEMETRY"
      title="GPU Compositor Pipeline"
    />
  );
}`,
};

export default ExpandableBentoCardMeta;
