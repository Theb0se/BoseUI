import type { PulseComponentMeta } from "../../types/component";

export const DrawerMeta: PulseComponentMeta = {
  title: "Drawer",
  description:
    "Slide-over panel and bottom sheet drawer with 4-direction support, drag-to-dismiss gestures, top-level portal rendering, and Escape dismissal.",
  tagline: "Multi-directional slide-over panel and draggable bottom sheet.",
  category: "Overlays",
  badges: ["Slide-Over", "Bottom Sheet", "Portal"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "drawer",
    "slide over",
    "bottom sheet",
    "side panel",
    "framer motion drawer",
    "react sheet",
  ],
  features: [
    "Renders in a top-level document.body portal (z-9999) above all navbars and containers.",
    "Slides from right, left, bottom, or top with directional drag-to-dismiss gestures.",
    "Works both controlled (open/onOpenChange) and uncontrolled with custom triggers.",
  ],
  accessibility: [
    "Renders with role='dialog' and aria-modal='true' and locks background scroll while open.",
    "Closes immediately when pressing the Escape key or clicking the backdrop.",
    "Collapses slide motion to a subtle fade when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "side",
      type: '"right" | "left" | "bottom" | "top"',
      default: '"right"',
      description: "Screen edge from which the drawer slides in.",
    },
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial open state when used uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the drawer opens or closes.",
    },
    {
      name: "title",
      type: "string",
      default: '"Drawer Panel"',
      description: "Heading title displayed in the drawer header.",
    },
    {
      name: "description",
      type: "string",
      description: "Optional helper subtitle below the drawer heading.",
    },
    {
      name: "triggerLabel",
      type: "string",
      default: '"Open Drawer"',
      description: "Label for the default trigger button when no custom trigger is passed.",
    },
    {
      name: "trigger",
      type: "React.ReactNode",
      description: "Custom trigger element that opens the drawer on click.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom content rendered inside the scrollable drawer body.",
    },
    {
      name: "footer",
      type: "React.ReactNode",
      description: "Custom footer actions rendered at the bottom of the drawer.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes applied to the drawer panel.",
    },
  ],
  usageCode: `import { Drawer } from "@/components/ui/drawer";

export function Example() {
  return (
    <div className="flex gap-3">
      <Drawer
        side="right"
        title="Project Settings"
        description="Configure deployment environment variables."
        triggerLabel="Open Right Drawer"
      />
      <Drawer
        side="bottom"
        title="Quick Actions"
        description="Swipe down or press Escape to dismiss."
        triggerLabel="Open Bottom Sheet"
      />
    </div>
  );
}`,
};

export default DrawerMeta;
