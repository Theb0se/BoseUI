import type { PulseComponentMeta } from "../../types/component";

export const TextMaskGridMeta: PulseComponentMeta = {
  title: "Text Mask Grid",
  description:
    "Large kinetic typographic heading masked to a retro flickering canvas grid. The animated grid is only visible within the letterforms, powered by inline SVG viewBox mask data URIs, hardware GPU composite blending, and Framer Motion entrance physics.",
  tagline: "Typographic headline revealed through an animated canvas flickering grid.",
  category: "Text",
  badges: ["SVG Mask", "Framer Motion", "Canvas", "A11y Ready", "CSS Supports"],
  createdAt: "2026-10-31",
  featured: true,
  keywords: [
    "text mask grid",
    "svg mask text",
    "canvas text mask",
    "flickering grid headline",
    "framer motion text",
    "letterform mask",
    "kinetic typography",
  ],
  features: [
    "Vector SVG mask data URI with scalable viewBox coordinate space for infinite sharpness at any screen resolution.",
    "Hardware-accelerated GPU masking: applies single-pass alpha composite blending over an active HTML5 2D canvas.",
    "Framer Motion entrance physics: smoothly transitions from blur(12px), scale 0.96, and opacity 0 with gentle 1.02 hover spring elasticity.",
    "Semantic accessibility: uses role='img' and aria-label so screen readers cleanly announce the word once without parsing canvas artifacts.",
    "Automatic CSS mask-image fallback: degrades gracefully to Tailwind's bg-clip-text gradient when mask-image is unsupported.",
    "Optional staggered letter entrance variant to reveal individual glyphs in sequence.",
  ],
  accessibility: [
    "Includes role='img' and aria-label matching the text string for assistive technologies.",
    "Respects prefers-reduced-motion media query by bypassing viewport blur-in transitions.",
    "Non-interactive canvas marked pointer-events-none to prevent event hijacking.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"Brand"',
      description: "Text string revealed through the flickering grid letterforms.",
    },
    {
      name: "fontSize",
      type: "string",
      default: '"clamp(4rem, 18vw, 16rem)"',
      description: "Responsive CSS font size string for the fallback heading.",
    },
    {
      name: "fontWeight",
      type: "number | string",
      default: "800",
      description: "Font weight of the letterforms in the SVG mask.",
    },
    {
      name: "fontFamily",
      type: "string",
      default: '"Inter Tight, system-ui, -apple-system, sans-serif"',
      description: "Font family for the vector letterforms.",
    },
    {
      name: "color",
      type: "string",
      default: '"currentColor"',
      description: "Color string for the flickering grid squares.",
    },
    {
      name: "squareSize",
      type: "number",
      default: "4",
      description: "Dimension of each square cell in CSS pixels.",
    },
    {
      name: "gridGap",
      type: "number",
      default: "5",
      description: "Spacing between adjacent cells in CSS pixels.",
    },
    {
      name: "flickerChance",
      type: "number",
      default: "0.35",
      description: "Probability of each square flickering per second [0..1].",
    },
    {
      name: "maxOpacity",
      type: "number",
      default: "0.4",
      description: "Maximum opacity ceiling for the grid squares.",
    },
    {
      name: "stagger",
      type: "boolean",
      default: "false",
      description: "Enables staggered entrance animation for individual letters.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into container.",
    },
  ],
  usageCode: `import { TextMaskGrid } from "@/components/ui/text-mask-grid";

export function HeroHeading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <TextMaskGrid
        text="Acme"
        fontWeight={900}
        squareSize={4}
        gridGap={5}
        flickerChance={0.4}
        maxOpacity={0.5}
        color="#3b82f6"
        className="w-full max-w-4xl"
      />
      <p className="mt-4 text-sm text-neutral-500 font-mono">
        High-performance developer tools for the next generation of cloud computing.
      </p>
    </div>
  );
}`,
};

export default TextMaskGridMeta;
