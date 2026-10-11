import type { PulseComponentMeta } from "../../types/component";

export const BlurFadeInTextMeta: PulseComponentMeta = {
  title: "Blur Fade In Text",
  description:
    "Editorial typographic entrance animation that transitions words or characters from an optical Gaussian blur into razor-sharp focus.",
  tagline: "Editorial typographic entrance with optical blur-to-focus reveal.",
  category: "Text",
  badges: ["New", "Editorial", "Typography"],
  createdAt: "2026-10-10",
  featured: true,
  keywords: [
    "blur text",
    "fade in text",
    "stagger text",
    "optical blur",
    "editorial typography",
    "framer motion text",
  ],
  features: [
    "Staggered word or character tokenization with customizable delay intervals.",
    "Hardware-accelerated CSS filter blur-to-sharp interpolation.",
    "Viewport scroll-triggering with once-only execution threshold.",
    "Full support for prefers-reduced-motion fallback.",
  ],
  accessibility: [
    "Retains natural text structure in DOM for screen reader compatibility.",
    "Bypasses blur filters when reduced motion is preferred.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Text sentence or headline to animate.",
    },
    {
      name: "delay",
      type: "number",
      default: "0",
      description: "Initial delay before sequence begins (seconds).",
    },
    {
      name: "stagger",
      type: "number",
      default: "0.05",
      description: "Stagger delay between subsequent tokens (seconds).",
    },
    {
      name: "by",
      type: '"word" | "character"',
      default: '"word"',
      description: "Tokenization mode: word-by-word or character-by-character.",
    },
    {
      name: "blurRadius",
      type: "number",
      default: "10",
      description: "Initial blur intensity in pixels.",
    },
    {
      name: "yOffset",
      type: "number",
      default: "12",
      description: "Vertical entrance drift distance in pixels.",
    },
  ],
  usageCode: `import { BlurFadeInText } from "@/components/ui/blur-fade-in-text";

export function Example() {
  return (
    <BlurFadeInText
      text="Crafting tactile interfaces engineered to feel alive."
      className="text-3xl font-bold tracking-tight"
    />
  );
}`,
};

export default BlurFadeInTextMeta;
