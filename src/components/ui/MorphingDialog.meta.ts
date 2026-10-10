import type { PulseComponentMeta } from "../../types/component";

export const MorphingDialogMeta: PulseComponentMeta = {
  title: "Morphing Dialog",
  description:
    "Origin-morphing modal overlay that expands seamlessly from its trigger button bounding box with spring layout projection and vertical drag-to-dismiss.",
  tagline: "Shared-element origin morphing modal with elastic drag-to-dismiss.",
  category: "Overlays",
  badges: ["New", "Shared Layout", "Gesture Dismiss"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "morphing dialog",
    "shared layout modal",
    "framer motion dialog",
    "expanding card modal",
    "gesture dismiss overlay",
  ],
  features: [
    "Seamless bounding-box morphing between compact trigger and modal dialog via Framer Motion layoutId.",
    "Elastic vertical drag-to-dismiss gesture with velocity and displacement thresholds.",
    "Automatic keyboard focus transfer into the dialog and restoration to the origin trigger on close.",
  ],
  accessibility: [
    "Implements role='dialog', aria-modal='true', aria-labelledby, and aria-describedby.",
    "Supports Escape key dismissal and restores focus to the trigger button upon closing.",
    "Disables layout morphing and drag gestures when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "triggerTitle",
      type: "string",
      default: '"Inspect Spring Telemetry"',
      description: "Primary heading displayed inside the origin trigger button.",
    },
    {
      name: "triggerSubtitle",
      type: "string",
      default: '"Click to expand shared-layout surface"',
      description: "Supporting subtitle displayed inside the origin trigger button.",
    },
    {
      name: "dialogTitle",
      type: "string",
      default: '"Hooke\'s Law Telemetry Architecture"',
      description: "Heading text displayed inside the expanded modal dialog.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "290",
      description: "Hooke's Law spring stiffness for shared layout projection.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient for shared layout projection.",
    },
  
    {
      name: "dialogDescription",
      type: "string",
      defaultValue: "undefined",
      description: "Expanded description text within the dialog modal",
      required: false,
    },
    {
      name: "open",
      type: "boolean",
      defaultValue: "undefined",
      description: "Controlled open/closed state of the dialog",
      required: false,
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      defaultValue: "undefined",
      description: "Callback fired when dialog open state toggles",
      required: false,
    },
  ],
  usageCode: `import { MorphingDialog } from "@/components/ui/morphing-dialog";

export function Example() {
  return (
    <MorphingDialog
      triggerTitle="Inspect Spring Telemetry"
      triggerSubtitle="Click to morph into modal"
      dialogTitle="Hooke's Law Telemetry Architecture"
    />
  );
}`,
};

export default MorphingDialogMeta;
