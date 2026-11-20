import type { PulseComponentMeta } from "../../types/component";

export const MegaMenuMeta: PulseComponentMeta = {
  title: "Mega Menu",
  description:
    "Kinetic multi-column navigation mega menu featuring spring category tabs, directional sliding content panels, interactive feature cards, and quick link references.",
  tagline: "Kinetic multi-column navigation menu with spring category tabs and feature cards.",
  category: "Navigation",
  badges: ["New", "Multi-column", "Interactive", "A11y Ready"],
  createdAt: "2026-11-20",
  featured: false,
  keywords: [
    "mega menu",
    "navigation dropdown",
    "multi-column navigation",
    "flyout menu",
    "framer motion mega menu",
    "rich menu",
  ],
  features: [
    "Shared layoutId active category pill for frictionless tab switching with spring physics.",
    "Direction-aware horizontal sliding content transitions between categories.",
    "Rich multi-column layout with feature cards, icon badges, descriptions, and CTA banners.",
    "Quick links rail for documentation, GitHub, and community shortcuts.",
    "Click outside and Escape key auto-dismissal.",
  ],
  accessibility: [
    "Accessible trigger button with aria-haspopup='true' and aria-expanded state.",
    "Full keyboard navigation and auto-focus retention.",
    "Instant fallback transitions when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "categories",
      type: "MegaMenuCategory[]",
      default: "DEFAULT_CATEGORIES",
      description: "Array of categorized mega menu sections containing items and featured cards.",
    },
    {
      name: "activeCategory",
      type: "string",
      description: "Controlled identifier for the currently active tab category.",
    },
    {
      name: "triggerLabel",
      type: "string",
      default: '"Explore Platform"',
      description: "Text label displayed on the mega menu activator button.",
    },
    {
      name: "onCategoryChange",
      type: "(categoryId: string) => void",
      description: "Callback invoked when the active tab category changes.",
    },
  ],
  usageCode: `import { MegaMenu } from "@/components/ui/MegaMenu";

export function Example() {
  return (
    <div className="flex justify-center p-8">
      <MegaMenu triggerLabel="Explore Products" />
    </div>
  );
}`,
};

export default MegaMenuMeta;
