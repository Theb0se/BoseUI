import type { PulseComponentMeta } from "../../types/component";

export const KineticStepIndicatorMeta: PulseComponentMeta = {
  title: "Kinetic Step Indicator",
  description:
    "Multi-step workflow progress bar with spring-filled liquid connector tubes, elastic checkmark badges, and direct step jumping.",
  tagline: "Multi-step workflow stepper with liquid spring connector tubes.",
  category: "Navigation",
  badges: ["New", "Stepper UI", "Spring Fill"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "kinetic step indicator",
    "animated stepper react",
    "multi step progress bar",
    "framer motion stepper",
    "workflow progress ui",
  ],
  features: [
    "Origin-left scaleX spring connector tubes that fill and drain smoothly between step nodes.",
    "Direct click-to-jump step buttons paired with sequential Prev and Next controls.",
    "Elastic scale pulse on the currently active step node.",
  ],
  accessibility: [
    "Marks the active step button with aria-current='step' and descriptive step aria-labels.",
    "Supports both direct Tab selection on step nodes and sequential Prev/Next buttons.",
    "Disables connector tube spring oscillation when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "steps",
      type: "StepSpec[]",
      description: "Array of workflow steps containing id, label, and caption.",
    },
    {
      name: "defaultStep",
      type: "number",
      default: "1",
      description: "Initial 0-based active step index.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "320",
      description: "Spring stiffness coefficient for connector tube fill and node scale.",
    },
    {
      name: "damping",
      type: "number",
      default: "25",
      description: "Spring damping coefficient controlling connector fill settle.",
    },
  ],
  usageCode: `import { KineticStepIndicator } from "@/components/ui/kinetic-step-indicator";

export function Example() {
  return (
    <KineticStepIndicator defaultStep={1} stiffness={320} damping={25} />
  );
}`,
};

export default KineticStepIndicatorMeta;
