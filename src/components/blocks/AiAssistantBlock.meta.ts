import type { PulseComponentMeta } from "../../types/component";

export const AiAssistantBlockMeta: PulseComponentMeta = {
  title: "AI Assistant Block",
  description:
    "An Apple-inspired AI copilot workspace block wrapped in a breathing SiriGlowEdge chromatic perimeter aura, hosting an interactive SlashCommandMenu editor and rapid one-click prompt pills.",
  tagline: "Siri-glow edge wrapped workspace with slash-command editor and prompt pills.",
  category: "Cards",
  badges: ["Block", "AI", "SiriGlow", "SlashCommand", "Interactive", "Editor"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "ai assistant",
    "siri glow edge",
    "slash command menu",
    "copilot workspace",
    "chromatic aura",
    "generative ai block",
  ],
  features: [
    "Perimeter chromatic SiriGlowEdge with breathing animation and listening/thinking state shifts.",
    "Integrated Notion-style SlashCommandMenu supporting headings, to-dos, code blocks, and callouts.",
    "Interactive quick-suggestion chips simulating real-time assistant prompt dispatch.",
    "Fully responsive card container with backdrop blur and high-contrast typography.",
  ],
  accessibility: [
    "Editor and prompt buttons are fully accessible via keyboard navigation and tab ordering.",
    "Color contrast ratio of all text elements exceeds WCAG AA 4.5:1 requirement.",
    "Interactive touch elements maintain 44px+ bounding area on touchscreens.",
    "Reduced-motion friendly with softened chromatic glow oscillations.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Intelligent Copilot for Modern Interfaces"',
      description: "Primary headline for the AI assistant block.",
    },
    {
      name: "tagline",
      type: "string",
      default: '"Summon generative reasoning, slash commands, and multi-modal canvas tools..."',
      description: "Sub-headline text explaining the assistant features.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { AiAssistantBlock } from "@/components/ui/AiAssistantBlock";

export function Example() {
  return (
    <AiAssistantBlock
      title="Intelligent Copilot for Modern Interfaces"
      tagline="Summon generative reasoning, slash commands, and multi-modal canvas tools with physical edge feedback."
    />
  );
}`,
};

export default AiAssistantBlockMeta;
