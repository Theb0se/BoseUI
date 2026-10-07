import type { PulseComponentMeta } from "../../types/component";

export const ElasticWaveTextMeta: PulseComponentMeta = {
  title: "Elastic Wave Text",
  description:
    "Plucked-string kinetic typography that propagates a damped transverse wave across every character on hover or click.",
  tagline: "Transverse sinusoidal wave propagation across headline glyphs.",
  category: "Text",
  badges: ["New", "Wave Physics", "A11y Safe"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "elastic wave text",
    "wave text animation react",
    "plucked string typography",
    "framer motion text wave",
    "kinetic headline",
  ],
  features: [
    "Phase-delayed vertical oscillation that ripples sequentially from the first glyph to the last.",
    "Secondary harmonic rebound (-0.45x crest) before settling at baseline.",
    "Screen-reader safe sr-only canonical string paired with aria-hidden visual glyphs.",
  ],
  accessibility: [
    "Exposes a single uninterrupted sr-only string for assistive technologies.",
    "Operable as a focusable button via Enter or Space keys.",
    "Suppresses transverse wave displacement when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"Harmonic Transverse Wave"',
      description: "Headline string rendered along the transverse wave.",
    },
    {
      name: "amplitude",
      type: "number",
      default: "-14",
      description: "Peak vertical wave crest displacement in pixels.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "420",
      description: "Spring stiffness coefficient for glyph oscillation.",
    },
    {
      name: "damping",
      type: "number",
      default: "14",
      description: "Damping coefficient controlling wave crest decay.",
    },
  ],
  usageCode: `import { ElasticWaveText } from "@/components/ui/elastic-wave-text";

export function Example() {
  return (
    <ElasticWaveText text="Harmonic Transverse Wave" amplitude={-14} />
  );
}`,
};

export default ElasticWaveTextMeta;
