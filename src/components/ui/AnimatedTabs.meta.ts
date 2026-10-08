import type { PulseComponentMeta } from "../../types/component";

export const AnimatedTabsMeta: PulseComponentMeta = {
  title: "Animated Tabs",
  description:
    "Smooth shared-element sliding pill tabs with animated panel transitions, optional badge counters, and keyboard arrow navigation.",
  tagline: "Sliding pill tabs built with Framer Motion layoutId springs.",
  category: "Navigation",
  badges: ["Shared Layout", "Tabs", "Keyboard Nav"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "animated tabs",
    "sliding tabs",
    "framer motion layoutId",
    "react tabs",
    "tailwind tabs",
  ],
  features: [
    "Shared-element active pill indicator powered by Framer Motion layoutId.",
    "Crossfades tab panel content smoothly on selection change.",
    "Supports badge counts and Left/Right arrow keyboard navigation.",
  ],
  accessibility: [
    "Implements WAI-ARIA role='tablist', role='tab', and role='tabpanel'.",
    "Supports Left and Right arrow keys to switch between tabs.",
    "Respects prefers-reduced-motion automatically.",
  ],
  props: [
    {
      name: "tabs",
      type: "TabItem[]",
      description: "Array of tab items containing id, label, optional badge, and content.",
    },
    {
      name: "defaultTabId",
      type: "string",
      description: "ID of the tab selected on initial render.",
    },
    {
      name: "onChange",
      type: "(tabId: string) => void",
      description: "Callback fired when the user switches tabs.",
    },
  ],
  usageCode: `import { AnimatedTabs } from "@/components/ui/animated-tabs";

export function Example() {
  return <AnimatedTabs />;
}`,
};

export default AnimatedTabsMeta;
