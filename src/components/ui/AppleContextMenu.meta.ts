import type { PulseComponentMeta } from "../../types/component";

export const AppleContextMenuMeta: PulseComponentMeta = {
  title: "Context Menu & Popover",
  description:
    "Frosted glassmorphic context menu and popover with a directional pointer arrow, hairline-divided action groups, keyboard shortcuts, and red destructive items.",
  tagline: "Blurred popover menu with arrow caret and destructive actions.",
  category: "Overlays",
  badges: ["New", "Frosted Menu", "Context UI"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "context menu",
    "apple popover menu",
    "blurred dropdown menu",
    "destructive menu item",
    "action menu",
  ],
  features: [
    "Frosted `backdrop-blur-xl` panel with a diamond-rotated top pointer arrow.",
    "Supports both left-click button trigger and right-click context menu activation.",
    "Hairline-divided action groups with dedicated red styling for destructive actions.",
  ],
  accessibility: [
    "Uses `role='menu'` and `role='menuitem'` with `aria-haspopup='menu'` and `aria-expanded`.",
    "Dismisses automatically on `Escape` key press or outside pointer click.",
    "Respects `prefers-reduced-motion` for menu scale transitions.",
  ],
  props: [
    {
      name: "groups",
      type: "ContextMenuGroup[]",
      description: "Array of action groups separated by hairline dividers.",
    },
    {
      name: "triggerLabel",
      type: "string",
      default: '"Actions Menu"',
      description: "Label displayed inside the menu trigger button.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial open state when rendered.",
    },
    {
      name: "onSelect",
      type: "(item: ContextMenuItem) => void",
      description: "Callback fired when any menu item is clicked.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the wrapper.",
    },
  ],
  usageCode: `import { AppleContextMenu } from "@/components/ui/apple-context-menu";

export function Example() {
  return (
    <AppleContextMenu
      triggerLabel="Actions Menu"
      onSelect={(item) => console.log("Selected:", item.label)}
    />
  );
}`,
};

export default AppleContextMenuMeta;
