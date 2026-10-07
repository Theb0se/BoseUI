import type { PulseComponentMeta } from "../../types/component";

export const KineticRollingCounterMeta: PulseComponentMeta = {
  title: "Kinetic Rolling Counter",
  description:
    "Mechanical odometer numeric ticker where each digit column spins independently along a vertical 0-9 reel using Hooke's Law springs.",
  tagline: "Mechanical odometer ticker with vertical 0-9 spring reels.",
  category: "Text",
  badges: ["New", "Odometer Reel", "Tabular Nums"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "kinetic rolling counter",
    "odometer number ticker",
    "slot machine counter react",
    "framer motion number counter",
    "rolling digits ui",
  ],
  features: [
    "Independent 0–9 vertical digit reels that roll proportionally to the numeric delta in each place value.",
    "Tabular monospace geometry preventing horizontal layout jitter during high-speed increments.",
    "Screen-reader live status region paired with aria-hidden visual reels.",
  ],
  accessibility: [
    "Provides an sr-only role='status' live region announcing the complete number cleanly.",
    "Marks the 0–9 vertical reel strips with aria-hidden='true' to prevent screen readers from reading all 10 digits per column.",
    "Snaps digit reels immediately without vertical travel when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "defaultValue",
      type: "number",
      default: "1248",
      description: "Initial non-negative integer displayed on the odometer.",
    },
    {
      name: "step",
      type: "number",
      default: "17",
      description: "Amount added or subtracted per stepper click.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "340",
      description: "Hooke's Law spring stiffness for vertical digit reel travel.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling reel settle bounce.",
    },
  ],
  usageCode: `import { KineticRollingCounter } from "@/components/ui/kinetic-rolling-counter";

export function Example() {
  return (
    <KineticRollingCounter defaultValue={1248} step={17} stiffness={340} damping={26} />
  );
}`,
};

export default KineticRollingCounterMeta;
