import type { PulseComponentMeta } from "../../types/component";

export const AIStreamingTextMeta: PulseComponentMeta = {
  title: "AI Streaming Text",
  description:
    "Character-by-character text renderer that simulates real-time AI token streaming, complete with a physics-spring blinking cursor that vanishes when generation completes.",
  tagline: "Render AI responses character-by-character with a live cursor.",
  category: "Text",
  badges: ["New", "AI", "Streaming"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai text",
    "streaming text",
    "typewriter ai",
    "chatgpt animation",
    "token streaming",
    "llm output",
  ],
  features: [
    "Configurable streaming speed per character in milliseconds.",
    "Blinking pipe cursor with AnimatePresence fade-out on completion.",
    "prefers-reduced-motion: instantly reveals full text.",
    "onComplete callback for chaining responses or UI transitions.",
    "Auto-restarts animation when text prop changes.",
  ],
  accessibility: [
    "Uses inline span — preserves semantics for screen readers.",
    "Full text visible immediately for reduced-motion users.",
  ],
  props: [
    { name: "text", type: "string", description: "The full text to stream." },
    {
      name: "speed",
      type: "number",
      default: "28",
      description: "Milliseconds per character.",
    },
    {
      name: "showCursor",
      type: "boolean",
      default: "true",
      description: "Show blinking cursor while streaming.",
    },
    {
      name: "cursorChar",
      type: "string",
      default: '"|"',
      description: "Character to use as cursor.",
    },
    {
      name: "onComplete",
      type: "() => void",
      description: "Called when streaming finishes.",
    },
    {
      name: "autoRestart",
      type: "boolean",
      default: "true",
      description: "Restart animation when text prop changes.",
    },
  ],
  usageCode: `import { AIStreamingText } from "@/components/ui/ai-streaming-text";

export function Example() {
  return (
    <p className="text-lg font-medium">
      <AIStreamingText
        text="Here's how I can help you build beautiful interfaces."
        speed={30}
        onComplete={() => console.log("Done!")}
      />
    </p>
  );
}`,
};

export default AIStreamingTextMeta;
