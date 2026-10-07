import type { PulseComponentMeta } from "../../types/component";

export const KineticSliderMeta: PulseComponentMeta = {
  title: "Kinetic Slider",
  description:
    "Elastic range slider featuring velocity-reactive tooltip inertia, logarithmic rubber-band boundary over-drag, and full keyboard accessibility.",
  tagline: "Velocity-tilted HUD badge and rubber-band boundary over-drag.",
  category: "Inputs",
  badges: ["New", "Velocity Physics", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "kinetic slider",
    "elastic range input",
    "framer motion slider",
    "velocity tooltip",
    "rubber band slider",
  ],
  features: [
    "Real-time drag velocity tracking via Framer Motion useVelocity to tilt the floating value badge.",
    "Logarithmic rubber-band resistance when dragging past min or max boundaries.",
    "Tactile thumb squash-and-stretch and dynamic rail thickening on pointer capture.",
  ],
  accessibility: [
    "Implements full WAI-ARIA role='slider' with aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.",
    "Supports ArrowLeft/Right/Up/Down, PageUp/PageDown (10x step), and Home/End keyboard increments.",
    "Disables velocity rotation and rubber-band displacement when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Spring Tension"',
      description: "Accessible label rendered above the slider rail.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "64",
      description: "Initial numeric value for uncontrolled usage.",
    },
    {
      name: "min",
      type: "number",
      default: "0",
      description: "Minimum allowed slider value.",
    },
    {
      name: "max",
      type: "number",
      default: "100",
      description: "Maximum allowed slider value.",
    },
    {
      name: "step",
      type: "number",
      default: "1",
      description: "Numeric increment step size.",
    },
    {
      name: "unit",
      type: "string",
      default: '"%"',
      description: "Unit suffix displayed next to the numeric value.",
    },
  ],
  usageCode: `import { KineticSlider } from "@/components/ui/kinetic-slider";

export function Example() {
  return (
    <KineticSlider
      label="Spring Stiffness"
      defaultValue={72}
      min={0}
      max={100}
      unit="%"
    />
  );
}`,
};

export default KineticSliderMeta;
