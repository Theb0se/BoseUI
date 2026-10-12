import type { PulseComponentMeta } from "../../types/component";

export const AIThinkingLoaderMeta: PulseComponentMeta = {
  title: "AI Thinking Loader",
  description:
    "Physics-grade animated loading indicator that communicates AI processing states. Three spring-animated orbs in dots, wave, or ring variants — far richer than plain CSS keyframe spinners.",
  tagline: "Spring-physics AI thinking indicator with dots, wave, and ring variants.",
  category: "Motion",
  badges: ["New", "AI", "Loader"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "ai loader",
    "thinking indicator",
    "dots loader",
    "wave loader",
    "ai spinner",
    "loading animation",
  ],
  features: [
    "Three variants: dots (scale pulse), wave (vertical oscillation), ring (arc spinner).",
    "Staggered spring physics per dot for natural organic feel.",
    "prefers-reduced-motion: static rendering.",
    "Fully accessible with role=status and aria-label.",
    "Configurable dot size and custom aria label.",
  ],
  accessibility: [
    "role='status' + aria-label for screen reader announcement.",
    "Static rendering when reduced motion is preferred.",
  ],
  props: [
    {
      name: "variant",
      type: '"dots" | "wave" | "ring"',
      default: '"dots"',
      description: "Animation style variant.",
    },
    {
      name: "size",
      type: "number",
      default: "8",
      description: "Orb diameter in pixels.",
    },
    {
      name: "label",
      type: "string",
      default: '"AI is thinking…"',
      description: "Accessible status label.",
    },
  ],
  usageCode: `import { AIThinkingLoader } from "@/components/ui/ai-thinking-loader";

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <AIThinkingLoader variant="dots" />
      <AIThinkingLoader variant="wave" size={10} />
      <AIThinkingLoader variant="ring" size={6} />
    </div>
  );
}`,
};

export default AIThinkingLoaderMeta;
