import type { PulseComponentMeta } from "../../types/component";

export const AccordionMeta: PulseComponentMeta = {
  title: "Accordion",
  description:
    "Smooth collapsible disclosure panels with spring-rotated chevron indicators, single or multiple expansion modes, and full keyboard accessibility.",
  tagline: "Animated collapsible panels with single or multi-expand support.",
  category: "Navigation",
  badges: ["Disclosure", "Collapsible", "Accessible"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "accordion",
    "collapsible",
    "faq component",
    "framer motion accordion",
    "disclosure panel",
  ],
  features: [
    "Smooth height and opacity transitions powered by Framer Motion AnimatePresence.",
    "Supports both single-open and allowMultiple expansion modes.",
    "Optional monospace subtitle badges for each accordion header.",
  ],
  accessibility: [
    "Uses semantic <button> headers with aria-expanded state announcements.",
    "Full Enter and Space keyboard support for toggling panels.",
    "Respects prefers-reduced-motion automatically.",
  ],
  props: [
    {
      name: "items",
      type: "AccordionItem[]",
      description: "Array of accordion items with id, title, optional subtitle, and content.",
    },
    {
      name: "allowMultiple",
      type: "boolean",
      default: "false",
      description: "When true, multiple panels can remain open at the same time.",
    },
    {
      name: "defaultOpenIds",
      type: "string[]",
      default: '["item-1"]',
      description: "Array of item IDs expanded on initial render.",
    },
  ],
  usageCode: `import { Accordion } from "@/components/ui/accordion";

export function Example() {
  return <Accordion allowMultiple={false} />;
}`,
};

export default AccordionMeta;
