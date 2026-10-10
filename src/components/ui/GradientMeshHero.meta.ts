import type { PulseComponentMeta } from "../../types/component";

export const GradientMeshHeroMeta: PulseComponentMeta = {
  title: "Gradient Mesh Hero",
  description:
    "Stripe-style angled flowing gradient mesh hero section featuring multi-layered organic color blobs, diagonal polygon clip-path, and live palette switching.",
  tagline: "Stripe-inspired multi-color drifting gradient mesh hero with diagonal clip-path.",
  category: "Backgrounds" as any,
  badges: ["Stripe", "Gradient Mesh", "Hero", "Clip-Path"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "gradient mesh hero",
    "stripe hero gradient",
    "flowing gradient background",
    "diagonal hero section",
    "css mesh drift",
    "mesh background",
  ],
  features: [
    "Angled flowing gradient mesh with signature Stripe diagonal bottom clip-path (`polygon(0 0, 100% 0, 100% 88%, 0 100%)`).",
    "Layered organic animated color blobs (violet, indigo, cyan, vermilion, amber) drifting smoothly.",
    "Integrated hero typography, feature pill badge, dual action CTAs, and live telemetry metric strip.",
    "Live interactive stage controls for color presets, drift cycle duration, blur radii, and clip-path toggling.",
  ],
  accessibility: [
    "Subtle CSS keyframe animations optimized for GPU compositing with low CPU overhead.",
    "High contrast hero copy (WCAG AAA against the dark backdrop overlay).",
    "All interactive preset buttons and sliders include descriptive labels and keyboard navigation.",
  ],
  props: [
    {
      name: "defaultPreset",
      type: "string",
      default: "'stripe-classic'",
      description: "Initial color preset id ('stripe-classic', 'neon-cyber', 'sunset-ray', 'deep-aurora').",
    },
    {
      name: "enableClipPath",
      type: "boolean",
      default: "true",
      description: "Whether to apply the diagonal polygon bottom clip-path.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  
    {
      name: "preset",
      type: '"aurora" | "sunset" | "neon" | "ocean"',
      defaultValue: '"aurora"',
      description: "Active color gradient palette preset for background blobs",
      required: false,
    },
    {
      name: "headline",
      type: "string",
      defaultValue: "undefined",
      description: "Main headline text rendered in the hero section",
      required: false,
    },
    {
      name: "description",
      type: "string",
      defaultValue: "undefined",
      description: "Subtitle or supporting paragraph under the headline",
      required: false,
    },
    {
      name: "primaryCtaText",
      type: "string",
      defaultValue: "Get Started",
      description: "Label for the primary call-to-action button",
      required: false,
    },
    {
      name: "secondaryCtaText",
      type: "string",
      defaultValue: "Documentation",
      description: "Label for the secondary action button",
      required: false,
    },
  ],
  usageCode: `import { GradientMeshHero } from "@/components/ui/GradientMeshHero";

export function Example() {
  return (
    <div className="w-full">
      <GradientMeshHero defaultPreset="stripe-classic" enableClipPath={true} />
    </div>
  );
}`,
};

export default GradientMeshHeroMeta;
