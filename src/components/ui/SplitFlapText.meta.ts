import type { PulseComponentMeta } from "../../types/component";

export const SplitFlapTextMeta: PulseComponentMeta = {
  title: "Split Flap Text",
  description:
    "Mechanical departure-board split-flap display that cycles character tiles with staggered 3D rotateX spring hinges.",
  tagline: "Mechanical departure-board tiles with 3D rotateX spring hinges.",
  category: "Text",
  badges: ["New", "3D Flip Tiles", "Staggered Spring"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "split flap text",
    "solari board react",
    "airport departure board ui",
    "3d flip text framer motion",
    "mechanical ticker",
  ],
  features: [
    "Individual character housing cells with a center mechanical split seam and 3D rotateX perspective flips.",
    "Staggered per-tile wave delay creating an authentic Solari departure board cascade.",
    "Click or press Enter/Space to cycle through an array of preset words.",
  ],
  accessibility: [
    "Announces the active word via an sr-only role='status' live region while marking individual character cells aria-hidden='true'.",
    "Board wrapper is a semantic button operable via Enter and Space keys.",
    "Disables 3D rotateX flips when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "words",
      type: "string[]",
      default: '["KINETIC", "PHYSICS", "SPRINGS", "MINIMAL"]',
      description: "Array of words cycled on each split-flap board trigger.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Hooke's Law spring stiffness for 3D tile hinge rotation.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient controlling tile settle bounce.",
    },
  ],
  usageCode: `import { SplitFlapText } from "@/components/ui/split-flap-text";

export function Example() {
  return (
    <SplitFlapText
      words={["KINETIC", "PHYSICS", "SPRINGS", "MINIMAL"]}
      stiffness={380}
      damping={24}
    />
  );
}`,
};

export default SplitFlapTextMeta;
