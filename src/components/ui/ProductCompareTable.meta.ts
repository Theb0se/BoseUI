import type { PulseComponentMeta } from "../../types/component";

export const ProductCompareTableMeta: PulseComponentMeta = {
  title: "Product Compare Table",
  description:
    "Aligned multi-tier product comparison matrix with sticky frosted headers, check and dash indicators, highlighted tier column, and a live 'Show differences only' switch.",
  tagline: "Sticky-header comparison matrix with check/dash indicators.",
  category: "Cards",
  badges: ["New", "Comparison UI", "Sticky Header"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "product compare table",
    "pricing comparison matrix",
    "feature comparison table",
    "sticky table header",
    "check dash table",
  ],
  features: [
    "Sticky frosted-glass column headers (`backdrop-blur-md`) that remain pinned while scrolling specs.",
    "Interactive 'Show differences only' toggle switch to filter out identical rows.",
    "Supports boolean check/dash badges as well as custom text values per tier.",
  ],
  accessibility: [
    "Uses semantic `<table>`, `<thead>`, and `<tbody>` markup for screen-reader table navigation.",
    "Check and dash icons include explicit `aria-label` ('Included' / 'Not included').",
    "Differences toggle uses `role='switch'` and `aria-checked`.",
  ],
  props: [
    {
      name: "tiers",
      type: "CompareTier[]",
      description: "Array of product tiers ({ id, name, price, badge, highlighted }).",
    },
    {
      name: "rows",
      type: "CompareSpecRow[]",
      description: "Array of specification rows mapping each tier id to a boolean or string.",
    },
    {
      name: "allowDiffFilter",
      type: "boolean",
      default: "true",
      description: "Displays the 'Show differences only' toggle bar at the top.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer table card.",
    },
  ],
  usageCode: `import { ProductCompareTable } from "@/components/ui/product-compare-table";

export function Example() {
  return <ProductCompareTable allowDiffFilter />;
}`,
};

export default ProductCompareTableMeta;
