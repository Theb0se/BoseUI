import type { PulseComponentMeta } from "../../types/component";

export const AIReasoningAccordionMeta: PulseComponentMeta = {
  title: "AI Reasoning Accordion",
  description:
    "Collapsible DeepSeek-R1 and OpenAI o1 inspired thinking step drawer with animated timeline dots, thought duration timer, spring chevron physics, and one-click step copying.",
  tagline: "Collapsible DeepSeek-R1 and o1 style AI reasoning drawer with spring physics.",
  category: "Cards",
  badges: ["New", "AI", "Thinking", "Interactive"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai reasoning",
    "deepseek thinking",
    "o1 thought drawer",
    "ai accordion",
    "chain of thought",
    "thinking steps",
    "ai ui",
  ],
  features: [
    "Collapsible with Framer Motion spring accordion height physics.",
    "Live thought duration badge (e.g. 'Thought for 3.4s' or 'Thinking…').",
    "Sequential step timeline with pending, running spinner, and done checkmarks.",
    "One-click copy thought steps to clipboard.",
    "Full dark/light mode contrast and prefers-reduced-motion support.",
  ],
  accessibility: [
    "Supports aria-expanded on toggle trigger button.",
    "Keyboard accessible with standard Enter / Space toggle handling.",
  ],
  props: [
    {
      name: "thinkingTime",
      type: "number",
      default: "3.4",
      description: "Thought duration in seconds displayed in header badge.",
    },
    {
      name: "status",
      type: '"thinking" | "completed"',
      default: '"completed"',
      description: "Current lifecycle state of the model's reasoning process.",
    },
    {
      name: "steps",
      type: "ReasoningStep[]",
      description: "Array of reasoning steps with label, details, and status.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "true",
      description: "Initial expanded state of the reasoning accordion.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Final thought synthesis or reasoning summary content.",
    },
    {
      name: "title",
      type: "string",
      default: '"Thought Process"',
      description: "Header label displayed next to the brain icon.",
    },
  ],
  usageCode: `import { AIReasoningAccordion } from "@/components/ui/AIReasoningAccordion";

export function Example() {
  return (
    <AIReasoningAccordion thinkingTime={2.8} status="completed">
      <p>The solution utilizes React 19 optimistic updates combined with Framer Motion spring physics.</p>
    </AIReasoningAccordion>
  );
}`,
};

export default AIReasoningAccordionMeta;
