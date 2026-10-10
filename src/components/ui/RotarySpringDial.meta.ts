import type { PulseComponentMeta } from "../../types/component";

export const RotarySpringDialMeta: PulseComponentMeta = {
  title: "Rotary Spring Dial",
  description:
    "Synthesizer-inspired tactile rotary knob with a 270-degree spring-damped rotor, vertical drag scrubbing, and keyboard arrow control.",
  tagline: "270° studio rotary knob with spring-damped rotor physics.",
  category: "Inputs",
  badges: ["New", "Rotary Knob", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "rotary spring dial",
    "audio knob react",
    "synthesizer dial ui",
    "framer motion rotary knob",
    "tactile dial input",
  ],
  features: [
    "Maps numeric values across a -135° to +135° (270° total) rotary arc driven by Hooke's Law angular springs.",
    "Precision vertical pointer-capture drag scrubbing standard in pro audio and 3D software.",
    "Full keyboard arrow-key and Home/End accessibility.",
  ],
  accessibility: [
    "Implements role='slider' with aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.",
    "Supports ArrowUp/ArrowRight to increment, ArrowDown/ArrowLeft to decrement, and Home/End keys.",
    "Rotates instantaneously without spring overshoot when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Damping Ratio"',
      description: "Parameter name displayed above the rotary dial.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "65",
      description: "Initial numeric value between min and max.",
    },
    {
      name: "min",
      type: "number",
      default: "0",
      description: "Minimum dial value corresponding to -135 degrees.",
    },
    {
      name: "max",
      type: "number",
      default: "100",
      description: "Maximum dial value corresponding to +135 degrees.",
    },
    {
      name: "step",
      type: "number",
      default: "5",
      description: "Step increment per detent tick.",
    },
    {
      name: "unit",
      type: "string",
      default: '"%"',
      description: "Unit suffix appended to the digital readout.",
    },
  
    {
      name: "stiffness",
      type: "number",
      defaultValue: "240",
      description: "Spring stiffness for dial rotation snapping",
      required: false,
    },
    {
      name: "damping",
      type: "number",
      defaultValue: "24",
      description: "Spring damping coefficient",
      required: false,
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Callback fired when dial angle value changes",
      required: false,
    },
  ],
  usageCode: `import { RotarySpringDial } from "@/components/ui/rotary-spring-dial";

export function Example() {
  return (
    <RotarySpringDial
      label="Damping Ratio"
      defaultValue={65}
      min={0}
      max={100}
      step={5}
      unit="%"
    />
  );
}`,
};

export default RotarySpringDialMeta;
