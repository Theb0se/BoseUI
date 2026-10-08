import type { PulseComponentMeta } from "../../types/component";

export const FloatingLabelInputMeta: PulseComponentMeta = {
  title: "Text Field with Floating Label",
  description:
    "Soft rounded input field with a spring-animated floating label, accent focus ring, inline clear button, password visibility toggle, and validation caption.",
  tagline: "Rounded text field with spring floating label and focus ring.",
  category: "Inputs",
  badges: ["New", "Form UX", "Floating Label"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "floating label input",
    "apple text field",
    "animated label input",
    "focus ring input",
    "form input",
  ],
  features: [
    "Smoothly floats and scales the label (`scale: 0.82, y: -10`) when focused or populated.",
    "Soft 16px rounded container with a 3px halo focus ring (`ring-3`).",
    "Built-in clear button, password show/hide toggle, and error/helper caption support.",
  ],
  accessibility: [
    "Associates `<label>` and `<input>` via unique `useId()` `htmlFor`/`id` attributes.",
    "Clear button uses `onMouseDown={(e) => e.preventDefault()}` so input focus is preserved when clearing.",
    "Respects `prefers-reduced-motion` for label float transitions.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Apple ID or Email Address"',
      description: "Floating label text inside the field.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled input value.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '"rishabh@boseui.com"',
      description: "Initial value for uncontrolled mode.",
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      description: "Callback fired when the input text changes.",
    },
    {
      name: "type",
      type: '"text" | "email" | "password" | "url"',
      default: '"email"',
      description: "HTML input type (adds visibility toggle when set to 'password').",
    },
    {
      name: "helperText",
      type: "string",
      description: "Optional helper caption displayed below the field.",
    },
    {
      name: "error",
      type: "string",
      description: "Optional error message that activates the red validation ring.",
    },
    {
      name: "clearable",
      type: "boolean",
      default: "true",
      description: "Shows a quick-clear button when the input is non-empty.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables the text field.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the wrapper.",
    },
  ],
  usageCode: `import { FloatingLabelInput } from "@/components/ui/floating-label-input";

export function Example() {
  return (
    <FloatingLabelInput
      label="Apple ID or Email Address"
      helperText="Your email is used for CLI registry authentication."
    />
  );
}`,
};

export default FloatingLabelInputMeta;
