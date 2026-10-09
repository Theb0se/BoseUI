import type { PulseComponentMeta } from "../../types/component";

export const FeatureBentoBlockMeta: PulseComponentMeta = {
  title: "Feature Bento Block",
  description:
    "High-impact responsive bento grid section combining expandable telemetry cards, radial spotlight hover proximity, 3D gyroscope tilt cards, and horizontal editorial feature highlights.",
  tagline: "Asymmetric bento grid section with expandable cards, spotlight illumination, and 3D parallax.",
  category: "Cards",
  badges: ["Block", "Features", "Bento Grid", "Spotlight", "Parallax", "Cards"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "feature bento block",
    "bento grid",
    "expandable card",
    "spotlight card",
    "parallax tilt card",
    "feature card",
    "apple bento grid",
    "framer motion cards",
  ],
  features: [
    "Asymmetric 12-column responsive layout showcasing varied card proportions and interactive affordances.",
    "Composes ExpandableBentoCard with live frame telemetry and collapsible diagnostic charts.",
    "Integrated SpotlightCard with hardware-accelerated pointer proximity radial glow.",
    "Multi-plane ParallaxTiltCard simulating physical 3D spatial depth under pointer traversal.",
    "Horizontal FeatureCard editorial component with media stage and instant call-to-action.",
  ],
  accessibility: [
    "Semantic section and article elements structuring each bento tile.",
    "Fully keyboard accessible expand/collapse triggers with clear focus rings.",
    "ARIA expanded states on interactive diagnostic cards.",
    "Respects prefers-reduced-motion by dampening 3D tilt and spring translations.",
  ],
  props: [
    {
      name: "eyebrow",
      type: "string",
      default: "'Modular Architecture'",
      description: "Eyebrow tag displayed above the main bento headline.",
    },
    {
      name: "title",
      type: "string",
      default: "'Next-Generation Interface Bento'",
      description: "Main section headline.",
    },
    {
      name: "description",
      type: "string",
      default: "'A responsive asymmetric showcase combining expandable telemetry...'",
      description: "Supporting descriptive paragraph beneath the title.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { FeatureBentoBlock } from "@/components/ui/FeatureBentoBlock";

export function Example() {
  return (
    <FeatureBentoBlock
      eyebrow="Architecture"
      title="Next-Generation Interface Bento"
    />
  );
}`,
};
