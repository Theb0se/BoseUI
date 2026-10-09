import type { PulseComponentMeta } from "../../types/component";

export const CategoryFilterScrollerMeta: PulseComponentMeta = {
  title: "Category Filter Scroller",
  description:
    "Airbnb-style horizontal scrolling category filter bar with edge gradient fade masks, spring active underline indicator, and tactile left/right chevron navigation.",
  tagline: "Airbnb-inspired horizontal category filter bar with edge fade masks.",
  category: "Navigation",
  badges: ["Airbnb", "Framer Motion", "Navigation", "Scroll Snap"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "category filter scroller",
    "airbnb categories",
    "horizontal scroll tabs",
    "edge fade mask",
    "framer motion layoutId underline",
    "travel categories",
    "filter bar",
  ],
  features: [
    "Horizontally scrolling row of curated category icons with smooth momentum and boundary detection.",
    "Dynamic left and right gradient edge masks that appear only when additional scrollable content exists.",
    "Spring-animated active underline pill that glides across categories using layoutId.",
    "Left and right chevron navigation buttons with spring hover physics.",
    "Responsive card showcase demonstrating reactive content switching on category change.",
  ],
  accessibility: [
    "Buttons have distinct accessible labels for Left and Right scroll actions.",
    "Selected category communicates active status visually and semantically.",
    "Smooth scroll and spring transitions honor reduced motion preferences.",
  ],
  props: [
    {
      name: "defaultCategory",
      type: "string",
      default: '"trending"',
      description: "ID of the category selected on mount.",
    },
    {
      name: "onSelectCategory",
      type: "(category: CategoryItem) => void",
      description: "Callback triggered when a user selects a new category.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS class names for the container wrapper.",
    },
  ],
  usageCode: `import { CategoryFilterScroller } from "@/components/ui/category-filter-scroller";

export function Example() {
  return (
    <CategoryFilterScroller
      defaultCategory="beachfront"
      onSelectCategory={(cat) => console.log("Category selected:", cat.label)}
    />
  );
}`,
};

export default CategoryFilterScrollerMeta;
