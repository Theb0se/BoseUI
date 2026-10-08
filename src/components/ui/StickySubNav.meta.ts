import type { PulseComponentMeta } from "../../types/component";

export const StickySubNavMeta: PulseComponentMeta = {
  title: "Sticky Sub-Nav",
  description:
    "Product-level frosted sticky sub-navigation bar that smoothly slides into view once the hero section scrolls out, pairing the product title on the left with a 'Buy' CTA pill on the right.",
  tagline: "Product sub-navigation bar that appears on scroll with Buy CTA.",
  category: "Navigation",
  badges: ["New", "Sticky Header", "E-Commerce UX"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "sticky sub nav",
    "apple product navbar",
    "sticky buy bar",
    "scroll reveal header",
    "product navigation bar",
  ],
  features: [
    "Automatically reveals with a spring slide-down animation (`backdrop-blur-xl`) once the hero section scrolls past.",
    "Displays product title on the left, section links in the center, and price + 'Buy' CTA pill on the right.",
    "Includes a self-contained scrollable demo viewport so you can test the scroll trigger immediately.",
  ],
  accessibility: [
    "Uses semantic `<header>` and `<nav>` landmarks.",
    "Interactive Buy button announces confirmation state visually and via text.",
    "Respects `prefers-reduced-motion` for header entry and exit transitions.",
  ],
  props: [
    {
      name: "productTitle",
      type: "string",
      default: '"Studio Display Pro"',
      description: "Product name displayed on the left side of the sticky bar.",
    },
    {
      name: "priceLabel",
      type: "string",
      default: '"$1,599"',
      description: "Price string displayed next to the Buy button.",
    },
    {
      name: "ctaLabel",
      type: "string",
      default: '"Buy"',
      description: "Label inside the primary right-hand CTA pill.",
    },
    {
      name: "links",
      type: "SubNavLink[]",
      description: "Array of navigation links ({ id, label }) shown in the bar.",
    },
    {
      name: "onBuy",
      type: "() => void",
      description: "Callback fired when the Buy button is clicked.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer container.",
    },
  ],
  usageCode: `import { StickySubNav } from "@/components/ui/sticky-sub-nav";

export function Example() {
  return (
    <StickySubNav
      productTitle="Studio Display Pro"
      priceLabel="$1,599"
      ctaLabel="Buy"
    />
  );
}`,
};

export default StickySubNavMeta;
