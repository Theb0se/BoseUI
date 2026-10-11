import type { PulseComponentMeta } from "../../types/component";

export const TypewriterCursorEffectMeta: PulseComponentMeta = {
  title: "Typewriter Cursor Effect",
  description:
    "Rotating multi-phrase typewriter effect with humanized typing rhythms, backspace cadence, and an animated blinking beam cursor.",
  tagline: "Rotating multi-phrase typewriter with blinking beam cursor.",
  category: "Text",
  badges: ["New", "Hero Typography", "Terminal"],
  createdAt: "2026-10-10",
  featured: true,
  keywords: [
    "typewriter text",
    "cursor text",
    "terminal typewriter",
    "word cycler",
    "framer motion typewriter",
  ],
  features: [
    "Humanized typing and accelerated backspacing intervals.",
    "Blinking cursor beam animation with custom glyph support.",
    "Infinite rotation through array of headline phrases.",
    "Graceful reduced-motion fallback that displays the initial phrase statically.",
  ],
  accessibility: [
    "Continuous readable inline text structure.",
    "Respects prefers-reduced-motion to avoid distracting motion.",
  ],
  props: [
    {
      name: "words",
      type: "string[]",
      description: "Array of phrases to cycle through.",
    },
    {
      name: "typeSpeed",
      type: "number",
      default: "80",
      description: "Typing delay per character in milliseconds.",
    },
    {
      name: "deleteSpeed",
      type: "number",
      default: "40",
      description: "Backspacing delay per character in milliseconds.",
    },
    {
      name: "delayBetween",
      type: "number",
      default: "1800",
      description: "Pause duration before backspacing a completed phrase.",
    },
    {
      name: "cursorChar",
      type: "string",
      default: '"|"',
      description: "Cursor character glyph.",
    },
  ],
  usageCode: `import { TypewriterCursorEffect } from "@/components/ui/typewriter-cursor-effect";

export function Example() {
  return (
    <h1 className="text-3xl font-bold">
      Build for{" "}
      <TypewriterCursorEffect
        words={["Next.js", "React 19", "Tailwind CSS", "Production"]}
        className="text-emerald-500"
      />
    </h1>
  );
}`,
};

export default TypewriterCursorEffectMeta;
