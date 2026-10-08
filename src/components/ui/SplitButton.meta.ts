import type { PulseComponentMeta } from "../../types/component";

export const SplitButtonMeta: PulseComponentMeta = {
  title: "Split Button",
  tagline: "A primary action with a chevron trigger for related actions.",
  description:
    "A primary action fused with a chevron trigger that reveals related actions in a spring-timed dropdown, sharing a single pill silhouette.",
  category: "Buttons",
  badges: ["Framer Motion", "Dropdown Menu", "Keyboard Nav"],
  usageCode: `import { SplitButton } from "@/components/ui/split-button";

export function Example() {
  return (
    <SplitButton
      label="Deploy Release"
      options={[
        { value: "preview", label: "Deploy Preview" },
        { value: "staging", label: "Promote to Staging" },
        { value: "rollback", label: "Rollback Production" },
      ]}
    />
  );
}`,
  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "Label for the primary (left) action button.",
    },
    {
      name: "options",
      type: "SplitButtonOption[]",
      required: true,
      description: "Dropdown options revealed by the chevron trigger.",
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Callback invoked when the primary action button is pressed.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Padding and typography scale of the split button.",
    },
    {
      name: "variant",
      type: '"primary" | "secondary" | "danger" | "info"',
      default: '"primary"',
      description: "Visual style of both halves of the control.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables both the primary button and dropdown trigger.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes applied to the root wrapper.",
    },
  ],
  accessibility: [
    'Chevron trigger uses aria-haspopup="menu" and aria-expanded to announce state.',
    'Dropdown uses role="menu" with role="menuitem" items.',
    "Arrow Up/Down, Home, and End move roving focus between enabled items.",
    "Enter/Space selects the active item; Escape closes and returns focus to the trigger.",
    "Tab closes the menu without trapping focus.",
    "Respects prefers-reduced-motion by collapsing spring transitions to instant.",
  ],
  features: [
    "Primary action and chevron trigger share a single rounded pill silhouette.",
    "Chevron rotates with a snappy spring on open/close.",
    "Menu flips above the trigger when there is not enough room below.",
    "Supports primary, secondary, danger, and info visual variants.",
    "Closes automatically on outside click and Escape.",
  ],
  createdAt: "2026-09-16",
};

export default SplitButtonMeta;