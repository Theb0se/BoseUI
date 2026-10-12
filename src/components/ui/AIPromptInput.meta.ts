import type { PulseComponentMeta } from "../../types/component";

export const AIPromptInputMeta: PulseComponentMeta = {
  title: "AI Prompt Input",
  description:
    "Auto-expanding AI textarea with a morphing submit button that transitions between arrow, spinner, and check states using spring physics. Includes character counter with color warnings and ⌘↵ keyboard shortcut.",
  tagline: "Auto-expanding AI prompt field with spring-morphing submit button.",
  category: "Inputs",
  badges: ["New", "AI", "Input"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai input",
    "prompt input",
    "ai textarea",
    "chat input",
    "expandable input",
    "submit button morph",
  ],
  features: [
    "Auto-resizes vertically as content grows (max 180px).",
    "Submit button morphs: arrow → spinner → check with spring AnimatePresence.",
    "Character counter appears on first keystroke with color warnings near limit.",
    "⌘↵ keyboard shortcut to submit.",
    "External loading state prop for async submit flows.",
    "prefers-reduced-motion: no button morph animation.",
  ],
  accessibility: [
    "aria-label on textarea and submit button.",
    "aria-multiline='true' on textarea.",
    "Disabled state on submit button when empty or loading.",
  ],
  props: [
    {
      name: "placeholder",
      type: "string",
      default: '"Ask anything…"',
      description: "Textarea placeholder text.",
    },
    {
      name: "maxLength",
      type: "number",
      default: "500",
      description: "Maximum character count.",
    },
    {
      name: "onSubmit",
      type: "(value: string) => void",
      description: "Called with trimmed text when submitted.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      description: "External loading state — shows spinner and blocks submit.",
    },
  ],
  usageCode: `import { AIPromptInput } from "@/components/ui/ai-prompt-input";

export function Example() {
  async function handleSubmit(text: string) {
    console.log("Submitting:", text);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AIPromptInput
        placeholder="Ask me anything…"
        maxLength={400}
        onSubmit={handleSubmit}
      />
    </div>
  );
}`,
};

export default AIPromptInputMeta;
