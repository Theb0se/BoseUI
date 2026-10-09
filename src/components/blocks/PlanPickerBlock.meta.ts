import type { PulseComponentMeta } from "../../types/component";

export const PlanPickerBlockMeta: PulseComponentMeta = {
  title: "Plan Picker with Preview",
  description:
    "Interactive pricing tier selector using spotlight-masked feature cards where hovering over any plan reveals deep architectural specifications and resource quotas.",
  tagline: "Spotlight-masked tier grid with progressive spec disclosure.",
  category: "Cards",
  badges: ["Block", "Pricing", "Spotlight", "Interactive"],
  createdAt: "2026-10-09",
  keywords: [
    "pricing plan picker",
    "spotlight pricing",
    "tier comparison",
    "specs reveal",
    "pricing block",
  ],
  features: [
    "Interactive hover spotlight projection across tier cards.",
    "Progressive disclosure reveals detailed architecture and rate limit quotas on hover.",
    "Integrated annual savings discount toggle.",
    "High-contrast CTA buttons with tactile press states.",
  ],
  accessibility: [
    "Full keyboard navigation with visible focus indicators.",
    "Semantic heading hierarchy and accessible tier labels.",
    "Screen-reader announcements for active plan selection.",
  ],
  props: [
    {
      name: "currency",
      type: '"USD" | "EUR" | "GBP"',
      default: '"USD"',
      description: "Currency code for tier pricing.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS container classes.",
    },
  ],
  usageCode: `import { PlanPickerBlock } from "@/components/ui/PlanPickerBlock";

export default function PricingSection() {
  return <PlanPickerBlock currency="USD" />;
}`,
};
