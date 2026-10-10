import type { PulseComponentMeta } from "../../types/component";

export const KeycapChipsMeta: PulseComponentMeta = {
  title: "Keycap Chips",
  description:
    "Raycast-inspired 3D tactile physical keyboard keycaps with realistic chamfer bevels, inset mechanical shadows, physical depression animations, and interactive keyboard listener.",
  tagline: "Raycast-style 3D tactile keycaps with mechanical depression feedback.",
  category: "Buttons" as any,
  badges: ["New", "3D Keycaps", "Raycast Style", "Interactive"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "keycap chips",
    "raycast shortcut",
    "keyboard chip",
    "keyboard shortcuts",
    "kbd badge",
    "mechanical key",
    "hotkey pill",
  ],
  features: [
    "Physical 3D bevels with layered drop-shadows and tactile bottom edge extrusion.",
    "Realistic spring depression physics on active click or physical keyboard press.",
    "Integrated live keyboard listener detecting key strokes in real time.",
    "Preset command pallets (Command Menu ⌘K, Spotlight ⌥Space, Git Commit ⌘↵, Quick Search Ctrl/).",
    "Multiple finishes: Matte Obsidian, Mechanical Classic, Cyber Amber, and Porcelain White.",
  ],
  accessibility: [
    "Key combinations are semantically marked up with HTML <kbd> elements.",
    "Each keycap is keyboard focusable and playable with Space or Enter.",
    "Includes ARIA labels clearly communicating the keystroke sequence to screen readers.",
  ],
  props: [
    {
      name: "shortcuts",
      type: "ShortcutItem[]",
      description: "Array of shortcut items with label, category, and keys list.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Physical dimensions and typography scale of keycaps.",
    },
    {
      name: "variant",
      type: '"obsidian" | "classic" | "cyber" | "porcelain"',
      default: '"obsidian"',
      description: "Aesthetic colorway and shadow finish of the keycaps.",
    },
    {
      name: "enableGlobalListener",
      type: "boolean",
      default: "true",
      description: "Whether physical keystrokes on the user's keyboard trigger key depression.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  
    {
      name: "keys",
      type: "string[]",
      defaultValue: "[]",
      description: "Array of individual keycap symbols to render",
      required: false,
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Whether keycaps render inline with prose text",
      required: false,
    },
    {
      name: "onShortcutPress",
      type: "(shortcut: ShortcutCombo) => void",
      defaultValue: "undefined",
      description: "Callback triggered when physical shortcut combination is activated",
      required: false,
    },
  ],
  usageCode: `import { KeycapChips } from "@/components/ui/KeycapChips";

export function Example() {
  return (
    <KeycapChips
      size="md"
      variant="obsidian"
      enableGlobalListener={true}
    />
  );
}`,
};

export default KeycapChipsMeta;
