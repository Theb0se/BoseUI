import type { PulseComponentMeta } from "../../types/component";

export const PopoverCardMeta: PulseComponentMeta = {
  title: "Popover Card",
  description:
    "Floating anchored popover card with configurable side and alignment, spring scale-in physics, outside-click dismissal, and interactive toggle controls.",
  tagline: "Anchored floating popover for quick settings and contextual menus.",
  category: "Overlays",
  badges: ["New", "Anchored UI", "Spring Pop"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "popover card",
    "floating menu",
    "settings popover",
    "dropdown card",
    "contextual overlay",
  ],
  features: [
    "Configurable `side` (top, bottom, left, right) and `align` (start, center, end) positioning.",
    "Outside click and Escape key listeners for immediate dismissal.",
    "Includes interactive spring switch toggles out of the box when no custom children are passed.",
  ],
  accessibility: [
    "Links trigger button to popover dialog via aria-expanded, aria-haspopup, and aria-controls.",
    "Uses role='switch' and aria-checked on interactive preference toggles.",
    "Respects prefers-reduced-motion for entry and exit animations.",
  ],
  props: [
    {
      name: "triggerLabel",
      type: "string",
      default: '"Display Settings"',
      description: "Label displayed inside the popover trigger button.",
    },
    {
      name: "title",
      type: "string",
      default: '"Workspace Preferences"',
      description: "Header title displayed inside the floating card.",
    },
    {
      name: "description",
      type: "string",
      default: '"Adjust real-time notification and layout behavior."',
      description: "Subtitle text displayed under the popover title.",
    },
    {
      name: "side",
      type: '"top" | "bottom" | "left" | "right"',
      default: '"bottom"',
      description: "Side of the trigger where the popover appears.",
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      default: '"center"',
      description: "Alignment along the chosen side.",
    },
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state for the popover.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the popover opens or closes.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom content rendered inside the popover body.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the wrapper.",
    },
  ],
  usageCode: `import { PopoverCard } from "@/components/ui/popover-card";

export function Example() {
  return (
    <PopoverCard
      triggerLabel="Display Settings"
      side="bottom"
      align="center"
    />
  );
}`,
};

export default PopoverCardMeta;
