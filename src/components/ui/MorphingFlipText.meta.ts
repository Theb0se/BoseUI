import type { PulseComponentMeta } from "../../types/component";

export const MorphingFlipTextMeta: PulseComponentMeta = {
  title: "Morphing Flip Text",
  description:
    "3D perspective tumbling word cycler that rotates between headline phrases with spring inertia along the X or Y axis.",
  tagline: "3D perspective tumbling word cycler with spring inertia.",
  category: "Text",
  badges: ["New", "3D Typography", "Word Cycler"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "flip text",
    "3d text",
    "word cycler",
    "rotating headline",
    "framer motion flip",
  ],
  features: [
    "3D perspective rotation with spring-tuned entry and exit kinematics.",
    "Dual directional modes: vertical (rotateX roll) and horizontal (rotateY turn).",
    "Clean layout preservation with AnimatePresence mode='wait'.",
    "Automatic timer disposal and memory leak protection.",
  ],
  accessibility: [
    "Readable typographic flow in the document outline.",
    "Bypasses 3D rotations when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "words",
      type: "string[]",
      description: "Array of words/phrases to cycle through.",
    },
    {
      name: "interval",
      type: "number",
      default: "2400",
      description: "Interval in milliseconds between word flips.",
    },
    {
      name: "direction",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      description: "Axis of 3D tumbling rotation.",
    },
  ],
  usageCode: `import { MorphingFlipText } from "@/components/ui/morphing-flip-text";

export function Example() {
  return (
    <h2 className="text-3xl font-semibold">
      Make your product{" "}
      <MorphingFlipText
        words={["delightful", "blazing fast", "unforgettable"]}
        className="text-neutral-900 dark:text-white"
      />
    </h2>
  );
}`,
};

export default MorphingFlipTextMeta;
