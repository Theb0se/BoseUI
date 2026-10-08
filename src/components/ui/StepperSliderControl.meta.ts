import type { PulseComponentMeta } from "../../types/component";

export const StepperSliderControlMeta: PulseComponentMeta = {
  title: "Stepper & Slider",
  description:
    "Synchronized precision control pairing a thin-track slider and large round thumb with a tactile (− / +) segmented stepper pill.",
  tagline: "Minimal (− / +) stepper synced with a thin-track slider.",
  category: "Inputs",
  badges: ["New", "Tactile Control", "Synced Input"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "stepper and slider",
    "ios stepper",
    "thin track slider",
    "numeric stepper",
    "range slider",
  ],
  features: [
    "Thin 6px slider track paired with a prominent 24px circular thumb that scales on pointer drag.",
    "Segmented (− | +) pill stepper for exact incremental adjustments.",
    "Supports both controlled (`value`, `onChange`) and uncontrolled (`defaultValue`) modes.",
  ],
  accessibility: [
    "Exposes WAI-ARIA `role='slider'` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.",
    "Supports `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, and `End` keys.",
    "Stepper buttons include descriptive `aria-label` attributes and disabled boundary states.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Display Brightness"',
      description: "Label displayed above the slider track.",
    },
    {
      name: "value",
      type: "number",
      description: "Controlled numeric value.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "65",
      description: "Initial value for uncontrolled mode.",
    },
    {
      name: "min",
      type: "number",
      default: "0",
      description: "Minimum allowed value.",
    },
    {
      name: "max",
      type: "number",
      default: "100",
      description: "Maximum allowed value.",
    },
    {
      name: "step",
      type: "number",
      default: "5",
      description: "Step increment for both slider snapping and (− / +) buttons.",
    },
    {
      name: "unit",
      type: "string",
      default: '"%"',
      description: "Unit suffix displayed next to the numeric value.",
    },
    {
      name: "onChange",
      type: "(value: number) => void",
      description: "Callback fired when the value changes.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables both slider and stepper buttons.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer card.",
    },
  ],
  usageCode: `import { StepperSliderControl } from "@/components/ui/stepper-slider-control";

export function Example() {
  return (
    <StepperSliderControl
      label="Display Brightness"
      defaultValue={65}
      min={0}
      max={100}
      step={5}
      unit="%"
    />
  );
}`,
};

export default StepperSliderControlMeta;
