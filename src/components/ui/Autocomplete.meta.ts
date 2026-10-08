import type { PulseComponentMeta } from "../../types/component";

export const AutocompleteMeta: PulseComponentMeta = {
  title: "Autocomplete",
  description:
    "Customizable search combobox with instant filtering, grouped categories, keyboard navigation, and spring-animated dropdown results.",
  tagline: "Searchable combobox input with grouped results and keyboard navigation.",
  category: "Inputs",
  badges: ["Combobox", "Search Filter", "Keyboard Nav"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "autocomplete",
    "combobox",
    "search input",
    "dropdown select",
    "react autocomplete",
    "tailwind combobox",
  ],
  features: [
    "Real-time filtering across labels, values, descriptions, and categories.",
    "Full ArrowUp, ArrowDown, Enter, and Escape keyboard navigation with auto-scroll.",
    "Supports grouped option categories, descriptions, and one-click clear.",
  ],
  accessibility: [
    "Implements ARIA combobox, listbox, and option roles with unique aria-controls ID.",
    "Supports full keyboard operation without requiring a mouse.",
    "Respects prefers-reduced-motion for dropdown open/close transitions.",
  ],
  props: [
    {
      name: "options",
      type: "AutocompleteOption[]",
      default: "DEFAULT_OPTIONS",
      description: "Array of options with value, label, optional description, icon, and category.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled selected option value.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '""',
      description: "Initial selected value when used as an uncontrolled component.",
    },
    {
      name: "onChange",
      type: "(value: string, option: AutocompleteOption | null) => void",
      description: "Callback triggered whenever the user selects or clears an option.",
    },
    {
      name: "label",
      type: "string",
      description: "Optional visible label rendered above the combobox.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Search options..."',
      description: "Placeholder text shown when no option is selected.",
    },
    {
      name: "emptyMessage",
      type: "string",
      default: '"No matching results found."',
      description: "Message displayed when no options match the search query.",
    },
    {
      name: "clearable",
      type: "boolean",
      default: "true",
      description: "Displays a clear button when an option is selected.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables user interaction with the combobox.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes applied to the outer wrapper.",
    },
  ],
  usageCode: `import { Autocomplete } from "@/components/ui/autocomplete";

const FRAMEWORKS = [
  { value: "nextjs", label: "Next.js", category: "Fullstack", description: "App Router & Server Actions" },
  { value: "remix", label: "Remix", category: "Fullstack", description: "Web standards router" },
  { value: "vite", label: "Vite", category: "Build Tools", description: "Next-gen frontend tooling" },
];

export function Example() {
  return (
    <Autocomplete
      label="Framework"
      placeholder="Select a framework..."
      options={FRAMEWORKS}
      defaultValue="nextjs"
    />
  );
}`,
};

export default AutocompleteMeta;
