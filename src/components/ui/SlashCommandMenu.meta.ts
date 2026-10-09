import type { PulseComponentMeta } from "../../types/component";

export const SlashCommandMenuMeta: PulseComponentMeta = {
  title: "Slash Command Menu",
  description:
    "Notion-style rich-text editor command menu triggered via '/', featuring fuzzy search filtering, keyboard arrow navigation, enter-to-insert blocks (Headings, To-Dos, Code Blocks, Callouts, Quotes), and delete controls.",
  tagline: "Notion-style rich-text editor with '/' command popover and keyboard navigation.",
  category: "Inputs",
  badges: ["Editor", "Popover Menu", "Keyboard Navigation"],
  createdAt: "2026-10-09",
  keywords: [
    "slash command menu",
    "notion editor",
    "command menu",
    "rich text editor",
    "slash command",
    "keyboard shortcut menu",
    "markdown blocks",
  ],
  features: [
    "Instant '/' command activation with real-time fuzzy query filtering.",
    "Full keyboard ergonomics: ArrowUp / ArrowDown navigation, Enter insertion, and Escape dismissal.",
    "Support for eight core block types: Headings 1/2/3, To-Do checklists, Code blocks, Callouts, and Quotes.",
    "Interactive document canvas with toggleable todo checkboxes and delete actions.",
    "Floating popover menu with glassmorphism backdrop blur and category organization.",
  ],
  accessibility: [
    "Follows WAI-ARIA Combobox pattern with aria-expanded, aria-activedescendant, and role='listbox'.",
    "Announces filtered search results and active block selections to assistive technology.",
    "High-contrast focus rings and keyboard-friendly dismissal mechanics.",
  ],
  props: [
    {
      name: "initialBlocks",
      type: "DocumentBlock[]",
      description: "Initial list of rich document blocks to render in the editor canvas.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Type \'/\' for commands or start writing..."',
      description: "Placeholder text rendered in the active writing input field.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { SlashCommandMenu } from "@/components/ui/SlashCommandMenu";

export function Example() {
  return (
    <SlashCommandMenu
      placeholder="Type '/' to insert headings, code snippets, or checklists..."
    />
  );
}`,
};

export default SlashCommandMenuMeta;
