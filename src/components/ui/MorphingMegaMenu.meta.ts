import type { PulseComponentMeta } from "../../types/component";

export const MorphingMegaMenuMeta: PulseComponentMeta = {
  title: "Morphing Mega Menu",
  description:
    "Stripe-style floating mega menu popover that fluidly glides across navigation links with spring physics, morphing width, height, and caret position synchronously.",
  tagline: "Stripe-inspired morphing popover navbar with synchronized spring caret.",
  category: "Navigation",
  badges: ["Stripe", "Morphing", "Spring Physics", "Dropdown"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "morphing mega menu",
    "stripe navigation",
    "stripe menu",
    "framer motion popover",
    "animated dropdown",
    "fluid navbar",
  ],
  features: [
    "Single floating popover container that glides smoothly across nav items on hover or focus.",
    "Dynamic width, height, and horizontal offset calculation with Hooke's Law spring physics.",
    "Synchronized sliding top caret pointing directly to the active navigation item.",
    "Crossfading multi-column panels for Products, Solutions, and Developer tooling.",
    "Interactive stage controls to inspect stiffness, damping, and force-pinned previews.",
  ],
  accessibility: [
    "Uses accessible ARIA menubar and role attributes with aria-expanded status.",
    "Supports keyboard navigation and focus triggers across all nav links and panels.",
    "Graceful fallback without layout jumping when JavaScript or motion is reduced.",
  ],
  props: [
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Spring stiffness coefficient for the morphing container and caret translation.",
    },
    {
      name: "damping",
      type: "number",
      default: "30",
      description: "Spring damping coefficient governing oscillation decay.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to append to the stage container.",
    },
  
    {
      name: "embedded",
      type: "boolean",
      defaultValue: "false",
      description: "Whether menu renders embedded within container rather than fixed top",
      required: false,
    },
  ],
  usageCode: `import { MorphingMegaMenu } from "@/components/ui/MorphingMegaMenu";

export function Example() {
  return (
    <div className="w-full">
      <MorphingMegaMenu stiffness={380} damping={30} />
    </div>
  );
}`,
};

export default MorphingMegaMenuMeta;
