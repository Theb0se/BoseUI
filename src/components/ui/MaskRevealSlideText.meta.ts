import type { PulseComponentMeta } from "../../types/component";

export const MaskRevealSlideTextMeta: PulseComponentMeta = {
  title: "Mask Reveal Slide Text",
  description:
    "Editorial masked typography where lines of text slide upwards out of an invisible horizontal boundary with high-precision cubic-bezier easing.",
  tagline: "Editorial masked curtain text reveal with cubic-bezier easing.",
  category: "Text",
  badges: ["New", "Editorial", "Curtain Reveal"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "mask reveal text",
    "slide text",
    "curtain text",
    "overflow hidden text",
    "editorial reveal",
  ],
  features: [
    "Horizontal boundary clipping using overflow-hidden container masks.",
    "Bespoke cubic-bezier deceleration curve [0.16, 1, 0.3, 1].",
    "Staggered cascade across multi-line headline statements.",
    "Viewport scroll intersection triggering.",
  ],
  accessibility: [
    "Accessible HTML layout preserve line semantics.",
    "Bypasses sliding translations when reduced motion is preferred.",
  ],
  props: [
    {
      name: "lines",
      type: "string[]",
      description: "Array of lines or sentences to reveal in cascade.",
    },
    {
      name: "stagger",
      type: "number",
      default: "0.12",
      description: "Interval between lines in seconds.",
    },
    {
      name: "delay",
      type: "number",
      default: "0",
      description: "Initial delay before sequence begins (seconds).",
    },
  ],
  usageCode: `import { MaskRevealSlideText } from "@/components/ui/mask-reveal-slide-text";

export function Example() {
  return (
    <MaskRevealSlideText
      lines={[
        "Design with intention.",
        "Engineered with kinetic physics.",
        "Shipped for modern developers.",
      ]}
      className="text-4xl font-bold tracking-tight"
    />
  );
}`,
};

export default MaskRevealSlideTextMeta;
