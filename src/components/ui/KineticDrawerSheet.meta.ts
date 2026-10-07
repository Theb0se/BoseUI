import type { PulseComponentMeta } from "../../types/component";

export const KineticDrawerSheetMeta: PulseComponentMeta = {
  title: "Kinetic Drawer Sheet",
  description:
    "Bottom gesture sheet featuring Peek and Full spring detents, velocity-projected flick transitions, and rubber-band over-drag.",
  tagline: "Multi-detent bottom gesture sheet with rubber-band over-drag.",
  category: "Overlays",
  badges: ["New", "Detent Snap", "Gesture Sheet"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "kinetic drawer sheet",
    "bottom sheet react",
    "ios drawer detent",
    "framer motion bottom sheet",
    "gesture modal",
  ],
  features: [
    "Two-stage detent snapping (Peek and Full) responsive to vertical pan velocity and displacement.",
    "Rubber-band drag elasticity at the top boundary.",
    "Explicit button detent switcher for non-gesture pointer and keyboard accessibility.",
  ],
  accessibility: [
    "Implements role='dialog' and aria-modal='true' with Escape key dismissal.",
    "Includes a dedicated Expand/Peek button so keyboard users can switch detents without dragging.",
    "Disables vertical drag physics when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "triggerLabel",
      type: "string",
      default: '"Open Gesture Drawer"',
      description: "Text rendered inside the drawer trigger button.",
    },
    {
      name: "title",
      type: "string",
      default: '"Multi-Detent Spring Sheet"',
      description: "Heading title displayed inside the drawer sheet.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "320",
      description: "Hooke's Law spring stiffness for sheet entry and detent transitions.",
    },
    {
      name: "damping",
      type: "number",
      default: "28",
      description: "Spring damping coefficient controlling sheet settle.",
    },
  ],
  usageCode: `import { KineticDrawerSheet } from "@/components/ui/kinetic-drawer-sheet";

export function Example() {
  return (
    <KineticDrawerSheet
      triggerLabel="Open Gesture Drawer"
      title="Multi-Detent Spring Sheet"
    />
  );
}`,
};

export default KineticDrawerSheetMeta;
