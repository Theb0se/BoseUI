import type { PulseComponentMeta } from "../../types/component";

export const ShimmerTextMeta: PulseComponentMeta = {
  title: "Shimmer Text",
  description:
    "Linear-inspired metallic gradient typography with a high-gloss light beam that sweeps across headlines continuously or upon hover interaction.",
  tagline: "Linear-style metallic gradient headline with an animated high-gloss beam.",
  category: "Text" as any,
  badges: ["New", "Metallic", "Linear Style", "GPU Accelerated"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "shimmer text",
    "linear typography",
    "metallic text",
    "gradient shine",
    "gloss text",
    "text beam",
  ],
  features: [
    "High-gloss specular light beam swept across typography via background-clip or mask reflection.",
    "Multiple metallic palettes: Platinum Silver, Liquid Gold, Cyber Neon Violet, and Emerald Matrix.",
    "Customizable shimmer duration, sweep angle, text size, and interactive hover-trigger mode.",
    "Live text editing in the demo stage to test any custom title or marketing headline.",
  ],
  accessibility: [
    "Text remains fully selectable and readable by standard screen readers via genuine DOM heading elements.",
    "Provides a pause/play toggle and disables animations automatically when prefers-reduced-motion is active.",
    "Ensures high contrast ratio against dark backgrounds even at the peak of the reflection sweep.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"Issue tracking engineered for high-velocity software teams."',
      description: "Headline copy to render with metallic shimmer finish.",
    },
    {
      name: "palette",
      type: '"silver" | "gold" | "violet" | "emerald"',
      default: '"silver"',
      description: "Metallic color tone preset for the gradient foundation and reflection beam.",
    },
    {
      name: "duration",
      type: "number",
      default: "3",
      description: "Sweep cycle duration in seconds.",
    },
    {
      name: "angle",
      type: "number",
      default: "115",
      description: "Angle of the light beam incidence in degrees.",
    },
    {
      name: "shimmerOnHoverOnly",
      type: "boolean",
      default: "false",
      description: "When true, shimmer beam sweeps only when hovered or focused.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { ShimmerText } from "@/components/ui/ShimmerText";

export function Example() {
  return (
    <ShimmerText
      text="Issue tracking engineered for high-velocity software teams."
      palette="silver"
      duration={3}
      angle={115}
    />
  );
}`,
};

export default ShimmerTextMeta;
