import type { PulseComponentMeta } from "../../types/component";

export const MultiSelectTagInputMeta: PulseComponentMeta = {
  title: "Multi-Select Tag Input",
  description:
    "Interactive tag and chip input with live autocomplete suggestions, custom tag creation via Enter or comma, Backspace removal, and max-tag limits.",
  tagline: "Tag & chip input with suggestions and keyboard shortcuts.",
  category: "Inputs",
  badges: ["New", "Form UX", "Keyboard Ready"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "tag input",
    "multi select",
    "chip input",
    "token input",
    "autocomplete tags",
  ],
  features: [
    "Spring-animated tag pills with popLayout transitions when adding or removing items.",
    "Supports Enter and comma (,) to create custom tags and Backspace to remove the last tag.",
    "Duplicate prevention, max-tag counter, and filterable suggestion dropdown.",
  ],
  accessibility: [
    "Uses WAI-ARIA combobox and listbox roles with aria-expanded and aria-controls.",
    "Each tag includes an accessible remove button with an explicit aria-label.",
    "Respects prefers-reduced-motion for tag entry and exit animations.",
  ],
  props: [
    {
      name: "suggestions",
      type: "TagSuggestion[]",
      description: "Array of suggested tags ({ value, label, category }) shown in the dropdown.",
    },
    {
      name: "value",
      type: "string[]",
      description: "Controlled array of selected tag values.",
    },
    {
      name: "defaultValue",
      type: "string[]",
      default: '["react", "typescript", "framer-motion"]',
      description: "Initial selected tag values for uncontrolled mode.",
    },
    {
      name: "onChange",
      type: "(tags: string[]) => void",
      description: "Callback fired whenever selected tags are added or removed.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Add tag or select..."',
      description: "Placeholder text shown when no tags are selected.",
    },
    {
      name: "label",
      type: "string",
      default: '"Tech Stack Tags"',
      description: "Optional label displayed above the tag container.",
    },
    {
      name: "maxTags",
      type: "number",
      default: "8",
      description: "Maximum number of tags allowed before the input locks.",
    },
    {
      name: "allowCustomTags",
      type: "boolean",
      default: "true",
      description: "Allows users to create custom tags not present in suggestions.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables adding or removing tags.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { MultiSelectTagInput } from "@/components/ui/multi-select-tag-input";

export function Example() {
  return (
    <MultiSelectTagInput
      label="Project Topics"
      maxTags={6}
      allowCustomTags
      onChange={(tags) => console.log("Selected tags:", tags)}
    />
  );
}`,
};

export default MultiSelectTagInputMeta;
