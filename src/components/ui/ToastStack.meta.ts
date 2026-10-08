import type { PulseComponentMeta } from "../../types/component";

export const ToastStackMeta: PulseComponentMeta = {
  title: "Toast Stack",
  description:
    "Stacked viewport notification toasts supporting 6 viewport positions (top/bottom + left/center/right), hover fan-out, and auto-dismiss.",
  tagline: "Viewport-positioned stacked notifications with hover fan-out.",
  category: "Overlays",
  badges: ["6 Positions", "Hover Fan-Out", "Portal"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "toast",
    "notification stack",
    "sonner toast",
    "viewport toast",
    "framer motion toast",
  ],
  features: [
    "Supports 6 viewport positions: top-left, top-center, top-right, bottom-left, bottom-center, and bottom-right.",
    "Renders in a top-level React portal (z-9999) with auto-dismiss that pauses on hover.",
    "Expands smoothly into a full list when hovering over the stacked notifications.",
  ],
  accessibility: [
    "Uses role='region' and aria-live='polite' so screen readers announce incoming toasts.",
    "Each toast includes a keyboard-accessible dismiss button with aria-label.",
    "Respects prefers-reduced-motion for entry and exit transitions.",
  ],
  props: [
    {
      name: "position",
      type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
      default: '"bottom-right"',
      description: "Viewport placement where the toast stack is anchored.",
    },
    {
      name: "initialToasts",
      type: "ToastItem[]",
      default: "[]",
      description: "Initial array of toast notifications rendered in the stack.",
    },
    {
      name: "maxVisible",
      type: "number",
      default: "4",
      description: "Maximum number of toasts visible in the stack at once.",
    },
    {
      name: "autoDismiss",
      type: "boolean",
      default: "true",
      description: "Automatically dismisses toasts after duration (pauses while hovering).",
    },
    {
      name: "duration",
      type: "number",
      default: "4500",
      description: "Time in milliseconds before a toast auto-dismisses.",
    },
    {
      name: "viewportPortal",
      type: "boolean",
      default: "true",
      description: "Renders the toast stack into document.body at z-[9999].",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes applied to the control panel wrapper.",
    },
  ],
  usageCode: `import { ToastStack } from "@/components/ui/toast-stack";

export function Example() {
  return (
    <ToastStack
      position="bottom-right"
      maxVisible={4}
      autoDismiss
      duration={4500}
    />
  );
}`,
};

export default ToastStackMeta;
