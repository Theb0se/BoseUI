import type { PulseComponentMeta } from "../../types/component";

export const FeatureCardMeta: PulseComponentMeta = {
  title: "Feature Card",
  description:
    "Large rounded showcase card with an eyebrow badge, headline, concise copy, interactive media stage, and smooth spring hover lift.",
  tagline: "Large rounded feature card with media preview and hover lift.",
  category: "Cards",
  badges: ["New", "Showcase UI", "Hover Lift"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "feature card",
    "apple feature card",
    "bento card",
    "media card",
    "hover lift card",
  ],
  features: [
    "28px rounded architectural container with spring-driven hover elevation (`y: -6`).",
    "Supports both vertical and horizontal layouts with a dedicated media preview well.",
    "Interactive default media telemetry bars that respond dynamically when the card is hovered.",
  ],
  accessibility: [
    "Uses semantic `<article>` markup with high-contrast typography.",
    "Action button includes visible keyboard focus rings and active press feedback.",
    "Disables vertical lift animation when `prefers-reduced-motion` is enabled.",
  ],
  props: [
    {
      name: "eyebrow",
      type: "string",
      default: '"Apple Silicon Architecture"',
      description: "Small uppercase label displayed above the headline.",
    },
    {
      name: "title",
      type: "string",
      default: '"Engineered for fluid 120Hz motion."',
      description: "Primary headline inside the feature card.",
    },
    {
      name: "description",
      type: "string",
      description: "Concise supporting paragraph below the headline.",
    },
    {
      name: "ctaLabel",
      type: "string",
      default: '"Explore Architecture"',
      description: "Text label for the call-to-action pill button.",
    },
    {
      name: "onAction",
      type: "() => void",
      description: "Callback fired when the CTA button is clicked.",
    },
    {
      name: "media",
      type: "React.ReactNode",
      description: "Custom visual or media node rendered inside the media stage.",
    },
    {
      name: "layout",
      type: '"vertical" | "horizontal"',
      default: '"vertical"',
      description: "Controls whether text and media stack vertically or sit side-by-side.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the card.",
    },
  ],
  usageCode: `import { FeatureCard } from "@/components/ui/feature-card";

export function Example() {
  return (
    <FeatureCard
      eyebrow="Performance"
      title="Engineered for fluid 120Hz motion."
      description="Every interaction responds with spring physics and zero layout shift."
      ctaLabel="Learn More"
    />
  );
}`,
};

export default FeatureCardMeta;
