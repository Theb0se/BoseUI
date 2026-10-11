import type { PulseComponentMeta } from "../../types/component";

export const SpringDropdownChevronMeta: PulseComponentMeta = {
  title: "Spring Dropdown Chevron",
  description:
    "Disclosure chevron trigger with hover tension anticipation, smooth rotational inertia, and spring overshoot.",
  tagline: "Disclosure chevron trigger with hover tension and rotational inertia.",
  category: "Navigation",
  badges: ["New", "Micro-interaction", "Disclosure UI"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "dropdown chevron",
    "accordion arrow",
    "disclosure icon",
    "spring rotation",
    "framer motion chevron",
  ],
  features: [
    "15° hover tension tilt that anticipates user interaction before clicking.",
    "Full 180° spring rotational trajectory with natural overshoot.",
    "Dual controlled and uncontrolled states.",
    "Full keyboard navigation and aria-expanded semantics.",
  ],
  accessibility: [
    "Semantically bound to aria-expanded.",
    "Keyboard triggered via Enter or Space.",
    "Prefe-reduced-motion switches to simple linear orientation.",
  ],
  props: [
    {
      name: "isOpen",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial state in uncontrolled mode.",
    },
    {
      name: "onToggle",
      type: "(isOpen: boolean) => void",
      description: "Callback fired when disclosure changes.",
    },
    {
      name: "label",
      type: "string",
      description: "Optional label placed before the chevron.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Size preset.",
    },
  ],
  usageCode: `import { SpringDropdownChevron } from "@/components/ui/spring-dropdown-chevron";

export function Example() {
  return (
    <SpringDropdownChevron
      label="View Advanced Settings"
      onToggle={(open) => console.log("State:", open)}
    />
  );
}`,
};

export default SpringDropdownChevronMeta;
