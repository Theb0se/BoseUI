import type { PulseComponentMeta } from "../../types/component";

export const HoldToConfirmButtonMeta: PulseComponentMeta = {
  title: "Hold To Confirm Button",
  description:
    "Press-and-hold safety action button with a spring-pressured progress fill that recoils elastically when released early.",
  tagline: "Press-and-hold safety button with elastic abort recoil.",
  category: "Buttons",
  badges: ["New", "Safety UX", "Spring Recoil"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "hold to confirm button",
    "press and hold button",
    "destructive action button",
    "framer motion progress button",
    "long press button",
  ],
  features: [
    "60fps requestAnimationFrame hold timer coupled to a Hooke's Law spring progress bar.",
    "Elastic recoil that snaps the fill bar back to 0% if the pointer or key is released before completion.",
    "Built-in reset cycle after confirmation so users can test repeated interactions.",
  ],
  accessibility: [
    "Uses aria-live='polite' to announce state transitions between idle, holding, and confirmed.",
    "Supports continuous Spacebar or Enter key hold for full keyboard parity.",
    "Disables scale compression when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Hold to Purge Cache"',
      description: "Resting action label displayed inside the button.",
    },
    {
      name: "confirmedLabel",
      type: "string",
      default: '"Cache Purged"',
      description: "Success label displayed after the hold completes 100%.",
    },
    {
      name: "holdDuration",
      type: "number",
      default: "1400",
      description: "Hold duration in milliseconds required to confirm the action.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "280",
      description: "Spring stiffness coefficient for progress fill and recoil.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient for progress fill and recoil.",
    },
  ],
  usageCode: `import { HoldToConfirmButton } from "@/components/ui/hold-to-confirm-button";

export function Example() {
  return (
    <HoldToConfirmButton
      label="Hold to Purge Cache"
      confirmedLabel="Cache Purged"
      holdDuration={1400}
    />
  );
}`,
};

export default HoldToConfirmButtonMeta;
