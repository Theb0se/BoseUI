import type { PulseComponentMeta } from "../../types/component";

export const MagneticPopoverMenuMeta: PulseComponentMeta = {
  title: "Magnetic Popover Menu",
  description:
    "Floating command popover menu with origin-scaled spring entry, a shared-layout magnetic row highlight, and keyboard arrow navigation.",
  tagline: "Floating command popover with shared-layout magnetic row highlight.",
  category: "Overlays",
  badges: ["New", "Command Menu", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "magnetic popover menu",
    "animated dropdown menu",
    "command menu popover",
    "framer motion popover",
    "floating menu react",
  ],
  features: [
    "Origin-top-left Hooke's Law spring scale and elevation entry animation.",
    "Shared layoutId highlight pill that glides smoothly between menu items on pointer hover or keyboard focus.",
    "Automatic outside-click and Escape key dismissal.",
  ],
  accessibility: [
    "Implements role='menu' and role='menuitem' with aria-haspopup='menu' and aria-expanded on the trigger.",
    "Supports ArrowUp and ArrowDown keyboard navigation across menu items.",
    "Disables scale and highlight glide animations when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "triggerLabel",
      type: "string",
      default: '"Quick Actions"',
      description: "Text label displayed inside the popover trigger button.",
    },
    {
      name: "items",
      type: "PopoverCommandItem[]",
      description: "Array of command items with id, label, shortcut, and icon.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Spring stiffness coefficient for popover entry and highlight glide.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling popover settle.",
    },
  ],
  usageCode: `import { MagneticPopoverMenu } from "@/components/ui/magnetic-popover-menu";

export function Example() {
  return (
    <MagneticPopoverMenu triggerLabel="Quick Actions" stiffness={380} damping={26} />
  );
}`,
};

export default MagneticPopoverMenuMeta;
