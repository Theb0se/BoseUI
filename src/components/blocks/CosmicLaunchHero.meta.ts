import type { PulseComponentMeta } from "../../types/component";

export const CosmicLaunchHeroMeta: PulseComponentMeta = {
  title: "Cosmic Launch Hero",
  description:
    "A full-screen launch hero block featuring starry canvas depth, shooting meteors, metallic shimmer headlines, magnetic action triggers, an interactive install terminal, and social proof presence avatars.",
  tagline: "Atmospheric starry canvas hero with kinetic CTA interactions and live install terminal.",
  category: "Cards",
  badges: ["Block", "Hero", "Atmospheric", "Interactive", "GPU Accelerated"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "cosmic launch hero",
    "hero block",
    "starry night",
    "shooting stars",
    "shimmer text",
    "magnetic button",
    "terminal code block",
    "social proof",
    "avatar stack",
  ],
  features: [
    "Dual-layer dynamic space canopy combining interactive starfield parallax and shooting meteor trails.",
    "Specular metallic typography with light beam sweep rendered via ShimmerText.",
    "Tactile cursor-tracking MagneticButtons with physics-tuned spring return.",
    "Integrated CopyCodeBlock for seamless one-click package manager installation.",
    "Social proof presence footer highlighting active developer count and 5-star ratings.",
    "Fully responsive layout optimized for mobile, tablet, and widescreen displays.",
  ],
  accessibility: [
    "High-contrast text hierarchy exceeding WCAG AA 4.5:1 ratio against the dark celestial canvas.",
    "Touch targets and CTA buttons sized to 44px+ minimum interactive bounds.",
    "Semantic heading hierarchy and accessible labels on all interactive controls.",
    "Automatically honors reduced motion settings across canvas particles and springs.",
  ],
  props: [
    {
      name: "headline",
      type: "string",
      default: '"Engineering the next frontier of kinetic user interfaces"',
      description: "Main marketing headline rendered with metallic shimmer.",
    },
    {
      name: "subheadline",
      type: "string",
      default: '"A production-grade design system and motion toolkit crafted with physics-based springs..."',
      description: "Descriptive narrative paragraph beneath the headline.",
    },
    {
      name: "installCommand",
      type: "string",
      default: '"npx boseui add cosmic-launch"',
      description: "CLI command rendered inside the copyable terminal snippet.",
    },
    {
      name: "developerCount",
      type: "string",
      default: '"12,000+"',
      description: "Developer community count displayed in social proof row.",
    },
    {
      name: "rating",
      type: "number",
      default: "5",
      description: "Star rating metric value out of 5.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { CosmicLaunchHero } from "@/components/ui/CosmicLaunchHero";

export function Example() {
  return (
    <CosmicLaunchHero
      headline="Engineering the next frontier of kinetic user interfaces"
      installCommand="npx boseui add cosmic-launch"
      developerCount="12,000+"
      rating={5}
    />
  );
}`,
};

export default CosmicLaunchHeroMeta;
