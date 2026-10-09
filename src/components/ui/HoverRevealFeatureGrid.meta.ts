import type { PulseComponentMeta } from "../../types/component";

export const HoverRevealFeatureGridMeta: PulseComponentMeta = {
  title: "Hover Reveal Feature Grid",
  description:
    "Linear-inspired bento feature grid where hovering any tile casts an interactive radial spotlight mask across card borders, smoothly reveals secondary deep feature specifications, and highlights contextual interactive badges.",
  tagline: "Linear-style bento feature grid with radial spotlight mask and secondary hover reveal.",
  category: "Cards",
  badges: ["New", "Linear Style", "Bento Grid", "Spotlight Mask"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "hover reveal feature grid",
    "linear bento grid",
    "radial spotlight mask",
    "bento features",
    "feature cards",
    "spotlight borders",
  ],
  features: [
    "Continuous mouse-tracking radial spotlight mask illuminating adjacent borders across the grid mesh.",
    "Spring-animated progressive reveal: hover expands secondary architecture metrics and interactive badges.",
    "Responsive asymmetric Bento layout with hero feature anchor and companion cards.",
    "Customizable spotlight colors: Linear Indigo, Emerald Matrix, Cyber Violet, and Sunset Amber.",
    "Interactive radius slider and spotlight intensity controls in the live demo stage.",
  ],
  accessibility: [
    "Hidden content is conditionally announced to screen readers or made accessible via keyboard focus.",
    "Each bento tile is keyboard focusable with high contrast focus indicators.",
    "Supports prefers-reduced-motion by disabling spotlight translation and instant-showing specs on focus.",
  ],
  props: [
    {
      name: "spotlightColor",
      type: '"indigo" | "emerald" | "violet" | "amber"',
      default: '"indigo"',
      description: "Color hue of the radial spotlight cursor mask.",
    },
    {
      name: "spotlightRadius",
      type: "number",
      default: "350",
      description: "Radius in pixels of the illuminated spotlight cone.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { HoverRevealFeatureGrid } from "@/components/ui/HoverRevealFeatureGrid";

export function Example() {
  return (
    <HoverRevealFeatureGrid
      spotlightColor="indigo"
      spotlightRadius={350}
    />
  );
}`,
};

export default HoverRevealFeatureGridMeta;
