import type { PulseComponentMeta } from "../../types/component";

export const AccordionStackCardsMeta: PulseComponentMeta = {
  title: "Accordion Stack Cards",
  description:
    "Spatial 3D card deck that fans out into a vertical cascade on pointer hover or focus and cycles card order with spring layout projection.",
  tagline: "Spatial 3D card deck with hover cascade and spring cycling.",
  category: "Cards",
  badges: ["New", "3D Stack", "Layout Projection"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "accordion stack cards",
    "stacked card deck",
    "apple wallet cards",
    "framer motion card stack",
    "cascade cards",
  ],
  features: [
    "Depth-scaled 3D card stack that smoothly fans out into an inspectable vertical cascade on hover or keyboard focus.",
    "Click or press Enter/Space on any card to cycle the front card to the back with Hooke's Law layout springs.",
    "Zero external dependencies beyond Framer Motion and Lucide icons.",
  ],
  accessibility: [
    "Each card is keyboard-focusable and automatically expands the stack when focused via Tab.",
    "Supports Enter and Space keys to cycle cards through the deck.",
    "Disables scale depth transformations when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "items",
      type: "StackCardItem[]",
      description:
        "Array of card items containing id, badge, title, metric, and subtitle.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "300",
      description: "Spring stiffness coefficient for deck expansion and card cycling.",
    },
    {
      name: "damping",
      type: "number",
      default: "25",
      description: "Spring damping coefficient controlling stack oscillation decay.",
    },
  ],
  usageCode: `import { AccordionStackCards } from "@/components/ui/accordion-stack-cards";

export function Example() {
  return (
    <AccordionStackCards stiffness={300} damping={25} />
  );
}`,
};

export default AccordionStackCardsMeta;
