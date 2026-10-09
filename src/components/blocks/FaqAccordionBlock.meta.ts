import type { PulseComponentMeta } from "../../types/component";

export const FaqAccordionBlockMeta: PulseComponentMeta = {
  title: "Searchable FAQ Section",
  description:
    "Comprehensive FAQ block combining instant autocomplete question search with smooth spring-animated accordion disclosure items and an alternative stacked card view.",
  tagline: "Instant search autocomplete with spring accordion disclosures.",
  category: "Cards",
  badges: ["Block", "FAQ", "Accordion", "Searchable"],
  createdAt: "2026-10-09",
  keywords: [
    "faq accordion",
    "searchable faq",
    "faq section block",
    "accordion stack",
    "knowledge base",
  ],
  features: [
    "Real-time autocomplete search filter across questions and answers.",
    "Smooth height and opacity transitions via Framer Motion.",
    "Toggle between standard accordion list and playful stacked cards view.",
    "Category filter badges (General, Billing, Security, Integration).",
  ],
  accessibility: [
    "Full WAI-ARIA accordion pattern with aria-expanded attributes.",
    "Keyboard accessible with Enter/Space to expand panels.",
    "Clear search input label and reset button.",
  ],
  props: [
    {
      name: "allowMultiple",
      type: "boolean",
      default: "false",
      description: "Whether multiple FAQ panels can be open simultaneously.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS container classes.",
    },
  ],
  usageCode: `import { FaqAccordionBlock } from "@/components/ui/FaqAccordionBlock";

export default function FAQSection() {
  return <FaqAccordionBlock allowMultiple={false} />;
}`,
};
