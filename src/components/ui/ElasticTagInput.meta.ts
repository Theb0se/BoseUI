import type { PulseComponentMeta } from "../../types/component";

export const ElasticTagInputMeta: PulseComponentMeta = {
  title: "Elastic Tag Input",
  description:
    "Tokenized multi-tag input with Hooke's Law pill pop-in, FLIP layout reflow, and a two-step Backspace warning wiggle before deletion.",
  tagline: "Tokenized pill input with layout springs and Backspace warning wiggle.",
  category: "Inputs",
  badges: ["New", "Token Input", "Layout Reflow"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "elastic tag input",
    "chip input react",
    "multi tag input tailwind",
    "framer motion tag input",
    "tokenized input ui",
  ],
  features: [
    "Automatic FLIP layout reflow across remaining pills when a tag is inserted or removed.",
    "Two-press Backspace safety that highlights and wiggles the last tag before deleting it.",
    "Normalizes whitespace into clean kebab-case tokens automatically.",
  ],
  accessibility: [
    "Each tag pill includes a dedicated button with aria-label='Remove tag X'.",
    "Supports Enter and comma keys to commit new tags and Backspace to remove.",
    "Disables scale pop-in and warning wiggle when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "defaultTags",
      type: "string[]",
      default: '["framer-motion", "spring-physics", "shadcn-v2"]',
      description: "Initial list of keyword tags rendered inside the field.",
    },
    {
      name: "maxTags",
      type: "number",
      default: "8",
      description: "Maximum number of tags allowed before locking the input.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Hooke's Law spring stiffness for tag pop-in and layout reflow.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient controlling pill settle.",
    },
  
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Add tag...",
      description: "Placeholder text displayed in the tag input field",
      required: false,
    },
    {
      name: "onChange",
      type: "(tags: string[]) => void",
      defaultValue: "undefined",
      description: "Callback fired whenever the list of tags updates",
      required: false,
    },
  ],
  usageCode: `import { ElasticTagInput } from "@/components/ui/elastic-tag-input";

export function Example() {
  return (
    <ElasticTagInput
      defaultTags={["framer-motion", "spring-physics", "shadcn-v2"]}
      maxTags={8}
    />
  );
}`,
};

export default ElasticTagInputMeta;
