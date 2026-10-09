import type { PulseComponentMeta } from "../../types/component";

export const SocialDockFooterMeta: PulseComponentMeta = {
  title: "Social Dock Footer",
  description:
    "An Apple-inspired social footer block featuring a centered DockMagnification bar with macOS spring zoom physics for developer networks, an operational community status indicator, and legal links.",
  tagline: "Apple-inspired footer with spring-magnified macOS social dock and status indicators.",
  category: "Navigation",
  badges: ["Block", "Footer", "Dock", "Navigation", "Apple", "Social"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "social dock footer",
    "dock magnification",
    "apple style footer",
    "social icons",
    "macos dock",
    "community links",
  ],
  features: [
    "macOS-style DockMagnification bar with continuous Gaussian distance falloff and spring physics.",
    "Curated developer channel icons (GitHub, X/Twitter, Discord, YouTube, LinkedIn, Figma, Mail).",
    "Real-time operational status dot and community response time SLA.",
    "Fully accessible keyboard links and semantic footer structure.",
  ],
  accessibility: [
    "Accessible aria-labels and keyboard navigation on every dock icon button.",
    "Touch devices support direct tap selection with immediate visual confirmation.",
    "High-contrast color scheme exceeding 4.5:1 ratio for all textual links.",
    "Reduced-motion friendly by disabling scale magnification when motion is restricted.",
  ],
  props: [
    {
      name: "headline",
      type: "string",
      default: '"Connect with the Open Source Community"',
      description: "Main header text displayed above the dock.",
    },
    {
      name: "subheadline",
      type: "string",
      default: '"Join over 12,000+ engineers building fluid, physics-based user interfaces."',
      description: "Sub-headline text explaining community channels.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root footer element.",
    },
  ],
  usageCode: `import { SocialDockFooter } from "@/components/ui/SocialDockFooter";

export function Example() {
  return (
    <SocialDockFooter />
  );
}`,
};

export default SocialDockFooterMeta;
