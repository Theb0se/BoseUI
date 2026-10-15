import type { PulseComponentMeta } from "../../types/component";

export const InteractivePricingTierDialMeta: PulseComponentMeta = {
  title: "Interactive Pricing Tier Dial",
  description:
    "Logarithmic scrubbable SaaS pricing calculator with dynamic tier switching (Starter, Pro, Growth, Scale), annual discount percentage toggles, and live feature checklists.",
  tagline: "Logarithmic scrubbable pricing slider with dynamic tier switching.",
  category: "Cards",
  badges: ["New", "Fintech", "Pricing", "Interactive"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "pricing slider",
    "saas pricing calculator",
    "tier dial",
    "stripe pricing",
    "usage billing",
    "interactive pricing",
  ],
  features: [
    "Logarithmic user slider adjusting MAU smoothly from 1k to 1M.",
    "Dynamic tier classification: Starter ($0), Pro ($29+), Growth ($129+), and Scale ($499+).",
    "Annual billing toggle with automatic 20% discount deduction.",
    "Dynamic tier feature checklist adapting with plan upgrades.",
    "Responsive, accessible range slider with keyboard step navigation.",
  ],
  accessibility: [
    "Accessible HTML range input with proper aria-label.",
    "High contrast price and tier typography.",
  ],
  props: [
    {
      name: "initialUsers",
      type: "number",
      default: "50000",
      description: "Default starting number of monthly active users.",
    },
    {
      name: "currency",
      type: "string",
      default: '"$"',
      description: "Currency symbol displayed alongside numbers.",
    },
    {
      name: "annualDiscountPercent",
      type: "number",
      default: "20",
      description: "Discount percentage applied when Annual billing is toggled.",
    },
    {
      name: "onSelectPlan",
      type: "(tier: string, price: number, isAnnual: boolean) => void",
      description: "Callback when the CTA plan button is clicked.",
    },
  ],
  usageCode: `import { InteractivePricingTierDial } from "@/components/ui/InteractivePricingTierDial";

export function Example() {
  return (
    <InteractivePricingTierDial
      initialUsers={25000}
      annualDiscountPercent={20}
      onSelectPlan={(tier, price) => console.log(\`Selected \${tier} at $\${price}/mo\`)}
    />
  );
}`,
};

export default InteractivePricingTierDialMeta;
