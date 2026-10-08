import type { PulseComponentMeta } from "../../types/component";

export const AppleSearchFieldMeta: PulseComponentMeta = {
  title: "Search Field",
  description:
    "Rounded iOS-inspired search bar with a magnifier icon, inline clear badge, quick suggestion pills, and a 'Cancel' button that slides in smoothly on focus.",
  tagline: "Rounded search bar with sliding Cancel button and quick chips.",
  category: "Inputs",
  badges: ["New", "Search UX", "Spring Layout"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "search field",
    "ios search bar",
    "sliding cancel search",
    "animated search input",
    "framer motion search",
  ],
  features: [
    "Shared-layout spring compression on the input bar as the 'Cancel' button slides in from the right.",
    "Animated circular clear (`X`) button that appears as soon as the user types.",
    "Reveals filterable quick-suggestion pills while focused.",
  ],
  accessibility: [
    "Uses semantic `type='search'` with `Escape` key bound to clear and dismiss focus.",
    "Includes explicit `aria-label` on the clear button.",
    "Respects `prefers-reduced-motion` for layout and slide transitions.",
  ],
  props: [
    {
      name: "placeholder",
      type: "string",
      default: '"Search components, tokens, or docs..."',
      description: "Placeholder text shown inside the search bar.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled search query value.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '""',
      description: "Initial search query for uncontrolled mode.",
    },
    {
      name: "onChange",
      type: "(query: string) => void",
      description: "Callback fired whenever the search query changes.",
    },
    {
      name: "onCancel",
      type: "() => void",
      description: "Callback fired when the Cancel button or Escape key is pressed.",
    },
    {
      name: "suggestions",
      type: "string[]",
      description: "Quick suggestion chips displayed below the field when active.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer wrapper.",
    },
  ],
  usageCode: `import { AppleSearchField } from "@/components/ui/apple-search-field";

export function Example() {
  return (
    <AppleSearchField
      placeholder="Search components..."
      onChange={(q) => console.log("Query:", q)}
    />
  );
}`,
};

export default AppleSearchFieldMeta;
