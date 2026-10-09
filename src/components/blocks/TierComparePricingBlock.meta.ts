import type { PulseComponentMeta } from "../../types/component";

export const TierComparePricingBlockMeta: PulseComponentMeta = {
  title: "Tier Compare Pricing Block",
  description:
    "A clean 3-tier pricing section (Starter, Professional, Enterprise) encased in dynamic SpotlightCard containers with interactive radial cursor tracking, followed by an expandable disclosure drawer revealing a comprehensive ProductCompareTable matrix.",
  tagline: "3-tier pricing section with spotlight hover physics and expandable feature comparison table.",
  category: "Cards",
  badges: ["Block", "Pricing", "Spotlight", "Comparison Table", "Interactive"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "pricing table",
    "tier comparison",
    "spotlight card",
    "feature matrix",
    "saas pricing",
    "expandable disclosure",
    "pricing block",
  ],
  features: [
    "Full-width responsive 3-tier layout highlighting popular choices with distinct visual hierarchy.",
    "Integrated SpotlightCard primitive delivering smooth cursor-following radial spotlight glows.",
    "Smooth AnimatePresence expandable drawer revealing an in-depth ProductCompareTable.",
    "Diff-only filtering in the comparison matrix for rapid decision-making.",
    "Comprehensive feature checklists with check and dash indicators.",
    "Tailwind semantic tokens for flawless dark and light mode rendering.",
  ],
  accessibility: [
    "Keyboard accessible disclosure toggle with correct aria-expanded states.",
    "High-contrast badges and clear hierarchical heading structure (h2, h3).",
    "Semantic table headers and accessible check/dash representations.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Simple, transparent tiers for every ambition"',
      description: "Header title text.",
    },
    {
      name: "description",
      type: "string",
      default: '"No arbitrary lock-ins. Build freely..."',
      description: "Header description text.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes to append to the root block container.",
    },
  ],
  usageCode: `import { TierComparePricingBlock } from "@/components/ui/TierComparePricingBlock";

export function PricingSection() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <TierComparePricingBlock />
    </div>
  );
}`,
};
