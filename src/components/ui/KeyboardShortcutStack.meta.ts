import type { PulseComponentMeta } from "../../types/component";

export const KeyboardShortcutStackMeta: PulseComponentMeta = {
  title: "Keyboard Shortcut Stack",
  description:
    "Raycast and Linear inspired tactile 3D keyboard keycap badges with real window keyboard event listeners that physically depress and glow when pressed on physical keyboards.",
  tagline: "Tactile 3D keyboard keycap badges with real-time physical keyboard listeners.",
  category: "Buttons",
  badges: ["New", "DevTools", "Interactive", "3D"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "keyboard shortcut",
    "physical keycap",
    "raycast hotkey",
    "linear keycap",
    "3d keycap",
    "shortcut badges",
  ],
  features: [
    "Tactile 3D beveled keycap styling that depresses by 3px on press.",
    "Real window keyboard listener matching physical modifier and alphanumeric keys.",
    "Responsive sizing: sm, md, and lg.",
    "Stack container for full shortcuts with title and description.",
    "Zero-dependency spring physics and prefers-reduced-motion support.",
  ],
  accessibility: [
    "Keyboard accessible button elements with standard focus rings.",
    "Clear visual press states in both light and dark themes.",
  ],
  props: [
    {
      name: "keys",
      type: "string[]",
      default: '["⌘", "K"]',
      description: "Array of key labels displayed in the stack.",
    },
    {
      name: "title",
      type: "string",
      default: '"Command Palette"',
      description: "Shortcut action title.",
    },
    {
      name: "description",
      type: "string",
      description: "Secondary helper text.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Size of all keycaps in the stack.",
    },
    {
      name: "onTrigger",
      type: "() => void",
      description: "Callback when shortcut is clicked or triggered.",
    },
  ],
  usageCode: `import { KeyboardShortcutStack, PhysicalKeycap } from "@/components/ui/KeyboardShortcutStack";

export function Example() {
  return (
    <div className="space-y-4">
      <KeyboardShortcutStack
        keys={["⌘", "Shift", "P"]}
        title="Command Palette"
        description="Try pressing ⌘, Shift, or P on your keyboard"
      />
      <div className="flex gap-2">
        <PhysicalKeycap keyLabel="⌘" />
        <PhysicalKeycap keyLabel="K" />
      </div>
    </div>
  );
}`,
};

export default KeyboardShortcutStackMeta;
