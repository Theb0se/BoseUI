import type { PulseComponentMeta } from "../../types/component";

export const HoverCursorShimmerTextMeta: PulseComponentMeta = {
  title: "Hover Cursor Shimmer Text",
  description:
    "Text typography that shimmers strictly at the cursor's hover position using a hardware-accelerated dynamic radial mask beam.",
  tagline: "Localized text shimmer effect following pointer coordinates.",
  category: "Text",
  badges: ["New", "Micro-interaction", "Typography"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "hover shimmer text",
    "cursor shimmer text",
    "text hover effect",
    "radial mask text",
    "localized shimmer",
  ],
  features: [
    "Illuminates only the specific portion of the sentence or headline being hovered.",
    "Hardware-accelerated CSS radial gradient mask tracking relative pointer coordinates.",
    "High-specular text shadow glow that follows mouse movements in real time.",
    "Dual-layer structure preserving base typography contrast and screen-reader accessibility.",
  ],
  accessibility: [
    "Base text retains standard readable contrast in light and dark mode.",
    "The shimmer overlay is hidden from screen readers via aria-hidden='true' to avoid duplicate pronunciation.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      description: "Text content to render with cursor-guided shimmer.",
    },
    {
      name: "radius",
      type: "number",
      default: "100",
      description: "Diameter radius in pixels of the active shimmer beam.",
    },
    {
      name: "shimmerColor",
      type: "string",
      default: '"#ffffff"',
      description: "Illuminated highlight color.",
    },
    {
      name: "glowColor",
      type: "string",
      default: '"rgba(255, 255, 255, 0.45)"',
      description: "Ambient specular glow color around the cursor.",
    },
    {
      name: "as",
      type: '"span" | "h1" | "h2" | "h3" | "h4" | "p" | "div"',
      default: '"span"',
      description: "Semantic HTML element type.",
    },
  ],
  usageCode: `import { HoverCursorShimmerText } from "@/components/ui/hover-cursor-shimmer-text";

export function Example() {
  return (
    <h2 className="text-4xl font-bold">
      <HoverCursorShimmerText
        text="Move your cursor across this text to reveal the localized shimmer."
        radius={120}
      />
    </h2>
  );
}`,
};

export default HoverCursorShimmerTextMeta;
