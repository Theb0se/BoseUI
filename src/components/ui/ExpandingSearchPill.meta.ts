import type { PulseComponentMeta } from "../../types/component";

export const ExpandingSearchPillMeta: PulseComponentMeta = {
  title: "Expanding Search Pill",
  description:
    "Airbnb-style compact floating search pill that fluidly morphs with layout springs into an expanded multi-segment drawer with destination, date, and guest selection panels.",
  tagline: "Airbnb-inspired morphing search pill with shared layout springs.",
  category: "Navigation",
  badges: ["Airbnb", "Shared Layout", "Spring Physics", "Search"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "expanding search pill",
    "airbnb search bar",
    "framer motion layoutId",
    "multi-segment search",
    "compact search pill",
    "guest stepper",
    "travel search bar",
  ],
  features: [
    "Compact pill showing dynamic summary for destination, travel dates, and guest headcount.",
    "Framer Motion layoutId morphing between compact pill and expanded multi-segment drawer.",
    "Interactive tabbed popover sheets for destination regions, date presets, and guest steppers.",
    "Live reactive simulated results cards updating as filters and guest parameters change.",
    "Click outside and escape key handling with smooth spring collapse physics.",
  ],
  accessibility: [
    "Interactive segments support standard keyboard navigation (Enter / Space).",
    "Descriptive ARIA labels for search triggers and guest stepper buttons.",
    "Disabled steppers communicate minimum boundaries (e.g. at least 1 adult required).",
  ],
  props: [
    {
      name: "initialDestination",
      type: "string",
      default: '"Anywhere"',
      description: "Default destination text shown in the first segment.",
    },
    {
      name: "initialDateRange",
      type: "string",
      default: '"Any week"',
      description: "Default travel duration or date range string.",
    },
    {
      name: "initialAdults",
      type: "number",
      default: "1",
      description: "Default adult guest count.",
    },
    {
      name: "onSearch",
      type: "(state: SearchState) => void",
      description: "Callback invoked when search is triggered with current parameters.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the container wrapper.",
    },
  ],
  usageCode: `import { ExpandingSearchPill } from "@/components/ui/expanding-search-pill";

export function Example() {
  return (
    <ExpandingSearchPill
      initialDestination="Kyoto, Japan"
      initialDateRange="Autumn Foliage"
      initialAdults={2}
      onSearch={(state) => console.log("Searching stays:", state)}
    />
  );
}`,
};

export default ExpandingSearchPillMeta;
