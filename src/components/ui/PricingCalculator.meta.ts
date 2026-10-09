import type { PulseComponentMeta } from "../../types/component";

export const PricingCalculatorMeta: PulseComponentMeta = {
  title: "Pricing Calculator",
  description:
    "Interactive Stripe-style pricing calculator featuring an API usage volume slider, automatic plan tier recommendation highlights, multi-currency conversion, and an annual billing toggle with 20% discount.",
  tagline: "Interactive tiered pricing calculator with volume slider, currency converter, and plan tier match.",
  category: "Cards" as any,
  badges: ["Stripe", "Pricing", "Calculator", "Interactive", "Data Display"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "pricing calculator",
    "stripe pricing",
    "tiered volume pricing",
    "usage slider",
    "annual discount toggle",
    "saas pricing plan",
  ],
  features: [
    "Interactive transaction / API usage slider scaling continuously from 10k to 5M+ requests.",
    "Real-time cost ticker recalculating tier-based volume discounts and monthly vs. annual billing.",
    "Automatic active plan highlighting (Starter, Growth, Scale, Enterprise) matched to current traffic volume.",
    "Multi-currency conversion support (USD, EUR, GBP) with localized currency symbols.",
    "Preset volume jump shortcuts for rapid instant plan exploration.",
  ],
  accessibility: [
    "Native accessible range input with full ARIA value min, max, and now attributes.",
    "High-contrast plan selection indicators and visible focus styles.",
    "Screen reader readable price announcements and currency indicators.",
  ],
  props: [
    {
      name: "defaultVolume",
      type: "number",
      default: "150000",
      description: "Initial monthly requests/operations volume for the slider.",
    },
    {
      name: "defaultAnnual",
      type: "boolean",
      default: "true",
      description: "Whether annual billing mode (with 20% discount) is enabled initially.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { PricingCalculator } from "@/components/ui/PricingCalculator";

export function Example() {
  return (
    <div className="w-full">
      <PricingCalculator defaultVolume={150000} defaultAnnual={true} />
    </div>
  );
}`,
};

export default PricingCalculatorMeta;
