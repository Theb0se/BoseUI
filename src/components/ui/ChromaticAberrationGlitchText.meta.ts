import type { PulseComponentMeta } from "../../types/component";

export const ChromaticAberrationGlitchTextMeta: PulseComponentMeta = {
  title: "Chromatic Aberration Glitch Text",
  description:
    "Sub-pixel RGB channel splitting and high-frequency twitch jitter triggered on hover or continuous loop.",
  tagline: "Sub-pixel RGB channel glitch typography with high-frequency micro-jitter.",
  category: "Text",
  badges: ["New", "Glitch", "Cyberpunk"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "glitch text",
    "chromatic aberration",
    "rgb split",
    "cyberpunk text",
    "framer motion glitch",
  ],
  features: [
    "Opposing cyan and magenta sub-pixel coordinate displacement.",
    "Hardware-accelerated CSS screen mix-blend channel combination.",
    "Hover-triggered or continuous ambient glitch modes.",
    "Zero residual layout shift when settled.",
  ],
  accessibility: [
    "Hides duplicate offset channel layers from screen readers with aria-hidden='true'.",
    "Stops glitch motion if user has prefers-reduced-motion configured.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Text string to render with glitch mechanics.",
    },
    {
      name: "trigger",
      type: '"hover" | "continuous"',
      default: '"hover"',
      description: "Trigger condition for RGB displacement.",
    },
    {
      name: "intensity",
      type: "number",
      default: "3",
      description: "Offset magnitude in pixels for chromatic channels.",
    },
  ],
  usageCode: `import { ChromaticAberrationGlitchText } from "@/components/ui/chromatic-aberration-glitch-text";

export function Example() {
  return (
    <ChromaticAberrationGlitchText
      text="QUANTUM CRYPTO ENGINE"
      className="text-4xl font-mono uppercase"
    />
  );
}`,
};

export default ChromaticAberrationGlitchTextMeta;
