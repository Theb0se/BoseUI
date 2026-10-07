import type { PulseComponentMeta } from "../../types/component";

export const KineticSwipeButtonMeta: PulseComponentMeta = {
  title: "Kinetic Swipe Button",
  description:
    "Slide-to-execute actuator switch with a spring-tethered thumb that locks upon crossing the completion threshold or recoils elastically.",
  tagline: "Slide-to-execute actuator track with elastic spring recoil.",
  category: "Buttons",
  badges: ["New", "Slide Actuator", "Spring Recoil"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "kinetic swipe button",
    "slide to confirm",
    "slide to unlock react",
    "framer motion swipe button",
    "safety switch ui",
  ],
  features: [
    "Pointer-captured horizontal actuator thumb coupled to a Hooke's Law spring.",
    "Snaps into locked confirmation when dragged past the threshold ratio or recoils smoothly to origin if released early.",
    "Includes a one-click reset state after confirmation.",
  ],
  accessibility: [
    "Thumb actuator is a semantic button supporting Enter and Space keys for single-keystroke completion.",
    "Respects prefers-reduced-motion by disabling continuous spring interpolation.",
    "Maintains high-contrast focus-visible ring indicators.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Slide to Deploy Production"',
      description: "Prompt label displayed along the actuator track.",
    },
    {
      name: "completedLabel",
      type: "string",
      default: '"Deployment Triggered"',
      description: "Confirmation label displayed once the swipe completes.",
    },
    {
      name: "threshold",
      type: "number",
      default: "0.78",
      description: "Track fraction (0.5 to 0.95) required to lock confirmation.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "360",
      description: "Spring stiffness coefficient for thumb travel and recoil.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling thumb snap-back.",
    },
  ],
  usageCode: `import { KineticSwipeButton } from "@/components/ui/kinetic-swipe-button";

export function Example() {
  return (
    <KineticSwipeButton
      label="Slide to Deploy Production"
      completedLabel="Deployment Triggered"
      threshold={0.78}
    />
  );
}`,
};

export default KineticSwipeButtonMeta;
