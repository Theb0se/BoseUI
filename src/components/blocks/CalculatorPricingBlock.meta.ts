import type { PulseComponentMeta } from "../../types/component";

export const CalculatorPricingBlockMeta: PulseComponentMeta = {
  title: "Calculator Pricing Block",
  description:
    "Full-featured SaaS pricing calculator block composing LiquidPillTabs for monthly/annual billing cycle toggle with discount badge, dynamic traffic volume slider, RollingNumberTicker for real-time cost estimation, and an adaptive feature tier checklist.",
  tagline: "Dynamic usage-based pricing block with liquid pill billing toggle and rolling number ticker.",
  category: "Cards",
  badges: ["Block", "Pricing", "Calculator", "Interactive", "Framer Motion"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "pricing block",
    "pricing calculator",
    "usage pricing",
    "liquid pill tabs",
    "rolling number ticker",
    "saas pricing table",
    "volume slider",
  ],
  features: [
    "Full pricing block composition with header, billing switcher, interactive slider, and plan breakdown card.",
    "Integrated LiquidPillTabs for fluid spring-animated monthly vs. annual discount switching.",
    "RollingNumberTicker for smooth, slot-machine style price change animations on slider interaction.",
    "Dynamic tier classification automatically mapping traffic volume to Starter, Growth, or Scale tiers.",
    "Accessible range slider with preset shortcut buttons for instant jumps to popular scales.",
    "Full dark and light mode support with semantic Tailwind tokens.",
  ],
  accessibility: [
    "Native accessible range input with labelled attributes and keyboard scrubbing.",
    "Keyboard tab navigation across billing cycle tabs and preset buttons.",
    "Screen reader readable price announcements and high-contrast status icons.",
  ],
  props: [
    {
      name: "defaultVolume",
      type: "number",
      default: "250000",
      description: "Initial monthly request/operations volume for the calculator slider.",
    },
    {
      name: "defaultBilling",
      type: '"monthly" | "annual"',
      default: '"annual"',
      description: "Initial billing cycle option.",
    },
    {
      name: "title",
      type: "string",
      default: '"Predictable pricing scaled to your traffic"',
      description: "Header title text.",
    },
    {
      name: "description",
      type: "string",
      default: '"No opaque lock-ins or overage penalties..."',
      description: "Subtitle description text.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes to append to the root block container.",
    },
  ],
  usageCode: `import { CalculatorPricingBlock } from "@/components/ui/CalculatorPricingBlock";

export function PricingSection() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <CalculatorPricingBlock
        defaultVolume={250000}
        defaultBilling="annual"
      />
    </div>
  );
}`,
};
