import type { PulseComponentMeta } from "../../types/component";

export const GlyphTrailMeta: PulseComponentMeta = {
  title: "Glyph Trail",
  description:
    "Interactive monospace text matrix that scrambles characters into kinetic mathematical glyphs under cursor proximity, relaxing back with fluid color decay.",
  tagline: "Interactive monospace text matrix that scrambles into colored math glyphs on hover.",
  category: "Text",
  badges: ["Interactive", "Text Effect", "Framer Motion", "A11y Ready"],
  createdAt: "2026-10-29",
  featured: true,
  keywords: [
    "glyph trail",
    "glyph-trail",
    "matrix text scramble",
    "math symbols cursor",
    "corca glyph effect",
    "kinetic monospace typography",
    "proximity text scramble",
    "framer motion text",
  ],
  features: [
    "Dynamic pointer proximity field that detects character distance squared (r²) for optimal 60fps performance.",
    "Dual-phase decay engine: characters first scramble into mathematical glyphs, transition to original letters in color, and gracefully settle back to neutral.",
    "Per-character randomized palette accents with subtle outline boxing, bold weights, and italic styling.",
    "Zero layout shift monospace rasterization with ResizeObserver and FontFaceSet measurement caching.",
    "Configurable highlight keywords that remain locked and protected from scrambling.",
  ],
  accessibility: [
    "Semantic role='img' and aria-label containing the full readable text lines for screen reader accessibility.",
    "Automatically honors prefers-reduced-motion by bypassing hover proximity scrambling.",
    "Maintains readable text contrast against dark backgrounds across all decay phases.",
  ],
  props: [
    {
      name: "lines",
      type: "string[]",
      default: "DEFAULT_GLYPH_LINES",
      description: "Monospace text lines centered and rendered in the interactive matrix.",
    },
    {
      name: "highlight",
      type: "string",
      default: '"corca"',
      description: "Specific keyword that remains locked in crisp white and never scrambles.",
    },
    {
      name: "glyphs",
      type: "string | string[]",
      default: "DEFAULT_GLYPHS",
      description: "Character set of mathematical symbols and glyphs used for scramble animations.",
    },
    {
      name: "radius",
      type: "number",
      default: "30",
      description: "Influence radius in pixels around pointer coordinates where scrambling occurs.",
    },
    {
      name: "lifeMs",
      type: "number",
      default: "1200",
      description: "Average duration in milliseconds a scrambled glyph persists before settling back.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into the container element.",
    },
  ],
  usageCode: `import { GlyphTrail } from "@/components/ui/glyph-trail";

export function GlyphTrailDemo() {
  return (
    <GlyphTrail
      lines={[
        "stem docs logic",
        "ideas natural input",
        "text corca math",
        "formulas notation",
        "functions variables",
        "collaborative editing",
      ]}
      highlight="corca"
      radius={36}
      lifeMs={1200}
    />
  );
}`,
};

export default GlyphTrailMeta;
