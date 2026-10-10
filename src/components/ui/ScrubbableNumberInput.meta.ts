import type { PulseComponentMeta } from "../../types/component";

export const ScrubbableNumberInputMeta: PulseComponentMeta = {
  title: "Scrubbable Number Input",
  description:
    "Figma and Blender-inspired tactile numeric input with horizontal pointer drag scrubbing, elastic housing displacement, and kinetic digit roll.",
  tagline: "Horizontal pointer scrubbing with elastic housing tug and digit roll.",
  category: "Inputs",
  badges: ["New", "Tactile Scrub", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "scrubbable number input",
    "figma number input",
    "drag to scrub input",
    "kinetic spinbutton",
    "framer motion input",
  ],
  features: [
    "Horizontal pointer-capture scrubbing anywhere on the pill with Shift (5x) and Alt (0.2x) precision modifiers.",
    "Hooke's Law horizontal housing tug that visualizes scrub tension and snaps back on release.",
    "Directional vertical slot-machine digit transitions powered by AnimatePresence.",
  ],
  accessibility: [
    "Implements WAI-ARIA role='spinbutton' with aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.",
    "Supports ArrowUp/ArrowDown/ArrowLeft/ArrowRight (plus Shift 10x multiplier) and Home/End keys.",
    "Includes explicit + and - stepper buttons for single-tap touch and assistive control.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Stiffness"',
      description: "Field label displayed inside the left scrub handle.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "240",
      description: "Initial numeric value for uncontrolled usage.",
    },
    {
      name: "min",
      type: "number",
      default: "0",
      description: "Minimum allowed numeric value.",
    },
    {
      name: "max",
      type: "number",
      default: "1000",
      description: "Maximum allowed numeric value.",
    },
    {
      name: "step",
      type: "number",
      default: "5",
      description: "Numeric increment per scrub step or button press.",
    },
    {
      name: "unit",
      type: "string",
      default: '"N/m"',
      description: "Unit label rendered alongside the numeric value.",
    },
  
    {
      name: "value",
      type: "number",
      defaultValue: "undefined",
      description: "Controlled numeric value",
      required: false,
    },
    {
      name: "pixelsPerStep",
      type: "number",
      defaultValue: "8",
      description: "Mouse scrub sensitivity in pixels moved per step increment",
      required: false,
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Callback fired when numeric value updates",
      required: false,
    },
  ],
  usageCode: `import { ScrubbableNumberInput } from "@/components/ui/scrubbable-number-input";

export function Example() {
  return (
    <ScrubbableNumberInput
      label="Stiffness"
      defaultValue={240}
      min={20}
      max={600}
      step={5}
      unit="N/m"
    />
  );
}`,
};

export default ScrubbableNumberInputMeta;
