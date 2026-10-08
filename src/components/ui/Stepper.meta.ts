import type { PulseComponentMeta } from "../../types/component";

export const StepperMeta: PulseComponentMeta = {
  title: "Stepper Wizard",
  description:
    "Multi-step onboarding and checkout progress wizard with spring-animated connector bars, clickable step indicators, and directional panel transitions.",
  tagline: "Multi-step progress wizard with spring connector and step transitions.",
  category: "Navigation",
  badges: ["New", "Onboarding UX", "Spring Progress"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "stepper",
    "multi step wizard",
    "onboarding progress",
    "checkout steps",
    "progress indicator",
  ],
  features: [
    "Spring-animated progress bar connecting step nodes with checkmark completion states.",
    "Directional slide transitions when moving forward or backward between steps.",
    "Supports both controlled (`activeStep`, `onStepChange`) and uncontrolled (`defaultStep`) usage.",
  ],
  accessibility: [
    "Marks the active step button with aria-current='step'.",
    "Keyboard-focusable step indicators and navigation buttons.",
    "Respects prefers-reduced-motion for step transitions and progress fills.",
  ],
  props: [
    {
      name: "steps",
      type: "StepItem[]",
      description: "Array of step objects ({ id, title, description, detail }).",
    },
    {
      name: "activeStep",
      type: "number",
      description: "Controlled active step index (0-based).",
    },
    {
      name: "defaultStep",
      type: "number",
      default: "0",
      description: "Initial active step index for uncontrolled mode.",
    },
    {
      name: "onStepChange",
      type: "(stepIndex: number) => void",
      description: "Callback fired whenever the active step changes.",
    },
    {
      name: "onComplete",
      type: "() => void",
      description: "Callback fired when the user completes the final step.",
    },
    {
      name: "allowStepClick",
      type: "boolean",
      default: "true",
      description: "Allows users to jump directly to a step by clicking its node.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer wizard container.",
    },
  ],
  usageCode: `import { Stepper } from "@/components/ui/stepper";

export function Example() {
  return (
    <Stepper
      onStepChange={(step) => console.log("Active step:", step)}
      onComplete={() => console.log("Wizard completed!")}
    />
  );
}`,
};

export default StepperMeta;
