import type { PulseComponentMeta } from "../../types/component";

export const AICommandBarMeta: PulseComponentMeta = {
  title: "AI Command Bar",
  description:
    "Slash-command aware AI input bar inspired by Linear and Raycast. Type / to reveal a spring-animated suggestions panel with keyboard navigation, staggered item entrance, and a shimmer idle border.",
  tagline: "Slash-command AI bar with spring suggestions panel and keyboard nav.",
  category: "Navigation",
  badges: ["New", "AI", "Command"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai command bar",
    "slash command",
    "command input",
    "ai search",
    "linear command",
    "raycast input",
  ],
  features: [
    "Type / to trigger animated suggestions panel with spring AnimatePresence.",
    "Staggered item entrance animation per suggestion row.",
    "Full keyboard navigation: Arrow keys to move, Enter to select, Escape to dismiss.",
    "layoutId spring highlight slides smoothly between hovered items.",
    "Rotating conic-gradient shimmer on border in idle state.",
    "Fully configurable commands array.",
  ],
  accessibility: [
    "role='combobox' on input with aria-expanded and aria-autocomplete.",
    "role='listbox' + role='option' on suggestions panel.",
    "Keyboard-only navigation support.",
  ],
  props: [
    {
      name: "commands",
      type: "AICommand[]",
      description: "Array of slash commands with trigger, label, description.",
    },
    {
      name: "onSelect",
      type: "(command: AICommand) => void",
      description: "Called when a command is selected.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Type / for AI commands…"',
      description: "Input placeholder text.",
    },
  ],
  usageCode: `import { AICommandBar } from "@/components/ui/ai-command-bar";

const commands = [
  { id: "summarize", trigger: "summarize", label: "Summarize", description: "Summarize selected text" },
  { id: "explain", trigger: "explain", label: "Explain", description: "Explain this concept" },
];

export function Example() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <AICommandBar
        commands={commands}
        onSelect={(cmd) => console.log("Selected:", cmd.label)}
      />
    </div>
  );
}`,
};

export default AICommandBarMeta;
