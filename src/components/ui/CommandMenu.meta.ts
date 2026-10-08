import type { PulseComponentMeta } from "../../types/component";

export const CommandMenuMeta: PulseComponentMeta = {
  title: "Command Menu",
  description:
    "Spotlight-style Cmd+K command palette portaled above the viewport with grouped actions, live keyword filtering, and full keyboard navigation.",
  tagline: "Cmd+K command palette with grouped actions and instant search.",
  category: "Navigation",
  badges: ["New", "Cmd+K", "Portal Overlay"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "command menu",
    "command palette",
    "cmd k",
    "spotlight search",
    "keyboard launcher",
  ],
  features: [
    "Portaled to document.body at z-[9999] so it always renders above navbars and page layouts.",
    "Global Cmd+K / Ctrl+K shortcut listener plus customizable search trigger button.",
    "Grouped command sections with keyword search, ArrowUp/ArrowDown navigation, and auto-scroll.",
  ],
  accessibility: [
    "Renders with role='dialog' and aria-modal='true' with automatic search input focus.",
    "Supports full keyboard operation (ArrowUp, ArrowDown, Enter, Escape).",
    "Locks background page scroll while open and respects prefers-reduced-motion.",
  ],
  props: [
    {
      name: "items",
      type: "CommandItem[]",
      description: "Array of command items ({ id, label, group, shortcut, keywords, icon, onSelect }).",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Type a command or search..."',
      description: "Placeholder text inside the command search input.",
    },
    {
      name: "triggerLabel",
      type: "string",
      default: '"Search commands..."',
      description: "Label displayed inside the trigger button.",
    },
    {
      name: "enableGlobalShortcut",
      type: "boolean",
      default: "true",
      description: "Listens for global Cmd+K / Ctrl+K keyboard shortcut when true.",
    },
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state for the command menu dialog.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the command menu opens or closes.",
    },
    {
      name: "onSelect",
      type: "(item: CommandItem) => void",
      description: "Callback fired when a command item is executed.",
    },
    {
      name: "emptyMessage",
      type: "string",
      default: '"No matching commands found."',
      description: "Message displayed when no commands match the search query.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the trigger wrapper.",
    },
  ],
  usageCode: `import { CommandMenu } from "@/components/ui/command-menu";

export function Example() {
  return (
    <CommandMenu
      triggerLabel="Quick commands..."
      onSelect={(item) => console.log("Executed:", item.label)}
    />
  );
}`,
};

export default CommandMenuMeta;
