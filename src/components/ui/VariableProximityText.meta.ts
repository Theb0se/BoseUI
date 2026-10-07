import type { PulseComponentMeta } from "../../types/component";

export const VariableProximityTextMeta: PulseComponentMeta = {
  title: "Variable Proximity Text",
  description:
    "Interactive kinetic typography where each glyph interpolates vertical lift, scale, and contrast based on real-time 2D cursor proximity.",
  tagline: "Real-time 2D Euclidean glyph lift and scale interpolation.",
  category: "Text",
  badges: ["New", "Kinetic Type", "Zero Re-renders"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "variable proximity text",
    "kinetic typography",
    "interactive text hover",
    "framer motion text",
    "glyph physics",
  ],
  features: [
    "Per-glyph 2D Euclidean distance field driven by Framer Motion MotionValues without React state re-renders.",
    "Word-aware wrapping that prevents mid-word line breaks on responsive viewports.",
    "Screen-reader safe architecture pairing a single sr-only text node with aria-hidden visual spans.",
  ],
  accessibility: [
    "Provides a single uninterrupted sr-only text string so screen readers never stutter over split characters.",
    "Marks individual animated glyph spans with aria-hidden='true'.",
    "Respects prefers-reduced-motion by locking glyphs at resting baseline and full contrast.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"Kinetic typography engineered with spring physics."',
      description: "The text string rendered as proximity-reactive glyphs.",
    },
    {
      name: "radius",
      type: "number",
      default: "120",
      description: "Pointer influence radius in pixels around the cursor.",
    },
    {
      name: "maxLift",
      type: "number",
      default: "-10",
      description: "Peak vertical displacement in pixels at zero pointer distance.",
    },
    {
      name: "maxScale",
      type: "number",
      default: "1.22",
      description: "Peak glyph scale factor at zero pointer distance.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "300",
      description: "Spring stiffness coefficient for glyph lift and scale.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling glyph oscillation decay.",
    },
  ],
  usageCode: `import { VariableProximityText } from "@/components/ui/variable-proximity-text";

export function Example() {
  return (
    <VariableProximityText
      text="Engineered with Hooke's Law spring physics."
      radius={120}
      maxLift={-10}
      maxScale={1.22}
    />
  );
}`,
};

export default VariableProximityTextMeta;
