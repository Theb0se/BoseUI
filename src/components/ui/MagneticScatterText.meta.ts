import type { PulseComponentMeta } from "../../types/component";

export const MagneticScatterTextMeta: PulseComponentMeta = {
  title: "Magnetic Scatter Text",
  description:
    "Anti-gravity typography where characters scatter elastically away from cursor proximity, then snap back with Hooke's Law spring harmonics.",
  tagline: "Cursor repulsion scatter typography with spring recoil mechanics.",
  category: "Text",
  badges: ["New", "Physics", "Interactive"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "scatter text",
    "magnetic text",
    "physics text",
    "cursor repulsion text",
    "spring text",
  ],
  features: [
    "Vector angle repulsion calculating exact cursor Euclidean distance per letter.",
    "Hooke's Law recoil springs returning glyphs to their structural baseline.",
    "Customizable dispersion radius and kinetic repulsion strength.",
    "Prefe-reduced-motion compatibility.",
  ],
  accessibility: [
    "Underlying string remains continuous in DOM.",
    "Disabled physics displacement when reduced motion is preferred.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Text phrase to animate with repulsion physics.",
    },
    {
      name: "radius",
      type: "number",
      default: "100",
      description: "Repulsion influence radius in pixels around pointer.",
    },
    {
      name: "strength",
      type: "number",
      default: "40",
      description: "Force multiplier pushing letters away.",
    },
  ],
  usageCode: `import { MagneticScatterText } from "@/components/ui/magnetic-scatter-text";

export function Example() {
  return (
    <MagneticScatterText
      text="Hover over these letters to scatter them"
      className="text-3xl font-bold"
    />
  );
}`,
};

export default MagneticScatterTextMeta;
