import type { PulseComponentMeta } from "../../types/component";

export const DawnHeroMeta: PulseComponentMeta = {
  title: "Dawn Hero",
  description:
    "A full-screen cinematic dawn hero section composed of a WebGL planetary horizon shader, pinned sub-navigation with breadcrumbs, shimmering gold typography, a multi-tool package manager SplitButton, and high-density performance metric callouts.",
  tagline: "Volumetric sunrise horizon hero with pinned sub-navigation and CLI package selector.",
  category: "Navigation",
  badges: ["Block", "Hero", "Navigation", "Shader", "Interactive"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "dawn hero",
    "horizon light",
    "sticky subnav",
    "shimmer text",
    "split button",
    "hero block",
    "webgl shader",
    "telemetry metrics",
  ],
  features: [
    "Volumetric planetary horizon shader with physical limb curve and atmospheric light rays.",
    "Integrated StickySubNav header with live breadcrumb context, tab anchors, and CTA actions.",
    "Gold-toned ShimmerText headline with animated specular highlight beam.",
    "Accessible SplitButton offering instant CLI package manager switching (npx, pnpm, bun) with auto-clipboard copy.",
    "Four-column metric telemetry cards showcasing real-time rendering statistics and accessibility standards.",
  ],
  accessibility: [
    "Text elements meet or exceed WCAG AA 4.5:1 contrast ratio against the deep ember backdrop.",
    "Full keyboard navigation and ARIA expanded semantics on the CLI SplitButton dropdown.",
    "Interactive buttons strictly maintain 44px+ touch targets across mobile and desktop breakpoints.",
    "Reduced-motion queries smoothly degrade shader animation speeds and spring translations.",
  ],
  props: [
    {
      name: "brandTitle",
      type: "string",
      default: '"Dawn Architecture"',
      description: "Brand or product label rendered on the pinned sub-nav header.",
    },
    {
      name: "headline",
      type: "string",
      default: '"The dawn of fluid kinetic interfaces"',
      description: "Main hero statement rendered with metallic shimmer.",
    },
    {
      name: "description",
      type: "string",
      default: '"A new paradigm of tactile, physics-based user experience..."',
      description: "Supporting descriptive text beneath the headline.",
    },
    {
      name: "metrics",
      type: "DawnHeroMetric[]",
      description: "Array of metric callouts displayed along the bottom telemetry row.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DawnHero } from "@/components/ui/DawnHero";

export function Example() {
  return (
    <DawnHero
      brandTitle="Dawn Architecture"
      headline="The dawn of fluid kinetic interfaces"
    />
  );
}`,
};

export default DawnHeroMeta;
