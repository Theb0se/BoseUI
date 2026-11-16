import type { PulseComponentMeta } from "../../types/component";

export const TextHoverLensMeta: PulseComponentMeta = {
  title: "Text Hover Lens",
  description:
    "Interactive text component where hovering opens a circular lens under the cursor with spring physics, revealing a contrasting color layer with optional magnification.",
  tagline: "Physics-driven circular lens revealing high-contrast typography on hover.",
  category: "Text",
  badges: ["New", "Hover", "Lens", "Spring", "Reveal"],
  createdAt: "2026-11-16",
  featured: true,
  keywords: [
    "text-hover-lens",
    "text hover lens",
    "hover",
    "lens",
    "spring",
    "reveal",
    "framer-motion",
    "typography",
    "cursor effect",
  ],
  features: [
    "Dual-layer text architecture with zero layout shift and identical font metrics.",
    "Dynamic clip-path circle driven by Framer Motion motion values without React re-renders during mouse movement.",
    "Snappy spring physics preset (stiffness 380, damping 24) for natural cursor follow and soft open/close overshoot.",
    "Customizable magnification scale, lens diameter, and full CSS color support (hex, rgb, hsl, CSS variables).",
    "Touch device support with touch-down reveal and non-blocking page scroll.",
    "Respects system prefers-reduced-motion by bypassing spring physics for instant alignment.",
  ],
  accessibility: [
    "Aria-hidden on the decorative lens layer ensures screen readers announce the text exactly once.",
    "Base layer text remains fully selectable with pointer-events: none on the overlay.",
    "Respects prefers-reduced-motion settings out of the box without jarring layout shifts.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      required: true,
      description: "The text string to display and reveal through the lens.",
    },
    {
      name: "lensColor",
      type: "string",
      default: '"#0d9488"',
      description:
        "Background color of the circular lens disc. Accepts any valid CSS color.",
    },
    {
      name: "lensTextColor",
      type: "string",
      default: '"#ffffff"',
      description:
        "Color of the revealed text inside the lens disc. Must provide AA contrast against lensColor.",
    },
    {
      name: "textColor",
      type: "string",
      default: '"currentColor"',
      description: "Color of the base text outside the lens.",
    },
    {
      name: "lensSize",
      type: "number",
      default: "120",
      description: "Diameter of the circular lens in pixels when fully open.",
    },
    {
      name: "magnify",
      type: "number",
      default: "1",
      description:
        "Scale multiplier for text inside the lens. 1 = no zoom, 1.2 = slight zoom.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description:
        "Hooke's Law spring stiffness coefficient matching the Snappy preset.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description:
        "Spring damping coefficient controlling oscillation decay matching the Snappy preset.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description:
        "Additional Tailwind or CSS classes applied to the outer wrapper.",
    },
  ],
  usageCode: `import { TextHoverLens } from "@/components/ui/text-hover-lens";

export function Example() {
  return (
    <h1 className="text-5xl font-black tracking-tight">
      <TextHoverLens
        text="REVEAL THE HIDDEN LAYER"
        lensColor="#0d9488"
        lensTextColor="#ffffff"
        lensSize={140}
        magnify={1.1}
      />
    </h1>
  );
}`,
};

export default TextHoverLensMeta;
