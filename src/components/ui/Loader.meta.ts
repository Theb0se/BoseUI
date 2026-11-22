import type { PulseComponentMeta } from "../../types/component";

export const LoaderMeta: PulseComponentMeta = {
  title: "Loader",
  description:
    "A collection of 17 expressive loading animations built with Framer Motion and Tailwind CSS, featuring classic spinners, dot matrixes, Bayer dithering, CLI agent ASCII sets, fluid shape morphing, gooey metaballs, and kinetic physics.",
  tagline: "17 expressive loading animations with Framer Motion, Bayer dither, ASCII cycles, and SVG morphing.",
  category: "Motion",
  badges: ["New", "Motion", "Loaders", "ASCII", "Dither", "Morph", "A11y Ready"],
  createdAt: "2026-11-22",
  featured: true,
  keywords: [
    "loader",
    "spinner",
    "loading animation",
    "framer motion loader",
    "ascii loader",
    "braille spinner",
    "dither loader",
    "morph loader",
    "metaballs",
    "helix loader",
    "newton cradle",
    "scramble text",
    "progress percent",
  ],
  features: [
    "17 distinct variants: spinner, dots, bars, dot-matrix, dither, ascii, ascii-line, ascii-braille, ascii-blocks, ascii-bounce, morph, comet, scramble, metaballs, newton, helix, and percent.",
    "Bayer 4x4 ordered dither matrix threshold animation that shimmers like a dissolving halftone.",
    "Point-to-point 24-sample SVG path morphing between circle, square, triangle, hexagon, and diamond.",
    "5 terminal-style ASCII/Braille glyph sets popular in CLI AI agents and developer tools.",
    "Fluid SVG filter-based metaballs with gooey merge effect.",
    "Newton's cradle impulse simulation with precise keyframe impact timing.",
    "Full WAI-ARIA role='status' compliance with screen reader announcements.",
    "Graceful prefers-reduced-motion fallbacks for all 17 animation variants.",
  ],
  accessibility: [
    "Uses role='status' with an aria-label and visually hidden fallback text for assistive tech.",
    "Respects prefers-reduced-motion by substituting intense transforms with calm opacity pulses or slowed glyph switches.",
    "SVG paths and graphics include accessible <title> elements.",
  ],
  props: [
    {
      name: "variant",
      type: "LoaderVariant",
      default: '"spinner"',
      description:
        'Which animation to render: "spinner" | "dots" | "bars" | "dot-matrix" | "dither" | "ascii" | "ascii-line" | "ascii-braille" | "ascii-blocks" | "ascii-bounce" | "morph" | "comet" | "scramble" | "metaballs" | "newton" | "helix" | "percent".',
    },
    {
      name: "size",
      type: "number",
      default: "32",
      description: "Base square size in pixels from which all geometry scales proportionally.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Cycle duration in seconds for one full loop of the animation.",
    },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      description: "Accessible label announced to screen readers.",
    },
    {
      name: "labels",
      type: "Partial<LoaderMessages>",
      description: "Override dictionary for accessible strings and scramble target word.",
    },
    {
      name: "className",
      type: "string",
      description: "Custom classes applied to the root status element.",
    },
  ],
  usageCode: `import { Loader } from "@/components/ui/Loader";

export function Example() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 items-center justify-items-center">
      {/* Classic Spinner */}
      <Loader variant="spinner" size={32} />

      {/* Bayer 4x4 Halftone Dither */}
      <Loader variant="dither" size={36} />

      {/* 24-point SVG Shape Morph */}
      <Loader variant="morph" size={36} />

      {/* Gooey Metaballs */}
      <Loader variant="metaballs" size={40} />

      {/* CLI Agent Braille Spinner */}
      <Loader variant="ascii-braille" size={28} />

      {/* Newton's Cradle */}
      <Loader variant="newton" size={36} />

      {/* DNA Double Helix */}
      <Loader variant="helix" size={36} />

      {/* Hacker Text Scramble */}
      <Loader variant="scramble" size={32} />
    </div>
  );
}`,
};

export default LoaderMeta;
