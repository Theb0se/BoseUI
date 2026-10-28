import type { PulseComponentMeta } from "../../types/component";

export const DotTextHeroMeta: PulseComponentMeta = {
  title: "Dot Text Hero",
  description:
    "Interactive headline hero featuring HTML5 canvas text rasterization into hexagonal-packed dots with cursor repulsion, spring-back physics, and twinkling.",
  tagline: "Canvas dot-matrix typography with real-time cursor repulsion and spring physics.",
  category: "Text",
  badges: ["Interactive Canvas", "Hooke's Law", "A11y Ready", "High DPI"],
  createdAt: "2026-10-28",
  featured: true,
  keywords: [
    "dot text hero",
    "canvas particle text",
    "hexagonal dot grid",
    "cursor repulsion typography",
    "dot matrix headline",
    "framer motion hero",
    "cosign awards hero",
  ],
  features: [
    "Offscreen canvas text rasterization dynamically packed into high-density hexagonal dot fields.",
    "Real-time inverse-square mouse repulsion with Hooke's Law spring restoration and velocity damping.",
    "Staggered entrance delays and subtle twinkle color cycling for a living, breathing headline.",
    "Dual-mode API: use as a complete turnkey hero section or embed the standalone DotTextCanvas anywhere.",
  ],
  accessibility: [
    "Provides hidden semantic h1 heading with the full text content for screen readers while marking the canvas aria-hidden.",
    "Fully respects prefers-reduced-motion by bypassing entrance delays and disabling physics repulsion and twinkling.",
    "Includes keyboard-navigable links and semantic button actions with clear focus indicators.",
  ],
  props: [
    {
      name: "lines",
      type: "string[]",
      default: '["Cosign", "Awards"]',
      description: "Array of headline text lines rasterized into the interactive dot matrix.",
    },
    {
      name: "colors",
      type: "string[]",
      default: '["#ffffff", "#e5e5e5", "#bdbdbd", "#8a8a8a", "#5c5c5c"]',
      description: "Color palette randomly assigned to dots and cycled during twinkling.",
    },
    {
      name: "dotSize",
      type: "number",
      default: "14",
      description: "Maximum dot diameter in CSS pixels, automatically clamped for small screens.",
    },
    {
      name: "repelRadius",
      type: "number",
      default: "80",
      description: "Cursor proximity radius in pixels where repulsion physics begins.",
    },
    {
      name: "repelStrength",
      type: "number",
      default: "5",
      description: "Peak repulsion velocity force applied to dots near the cursor.",
    },
    {
      name: "springStiffness",
      type: "number",
      default: "0.08",
      description: "Hooke's Law spring return factor restoring dots to their home anchors.",
    },
    {
      name: "damping",
      type: "number",
      default: "0.82",
      description: "Velocity friction damping coefficient preventing endless oscillation.",
    },
    {
      name: "twinkleInterval",
      type: "number",
      default: "80",
      description: "Interval in milliseconds between random dot re-colorings. 0 disables twinkling.",
    },
    {
      name: "brandName",
      type: "string",
      default: '"cosign"',
      description: "Brand title rendered in the top navigation bar.",
    },
    {
      name: "badgeText",
      type: "ReactNode",
      default: '"Cosigning is open"',
      description: "Status badge text displayed with an optional glowing pulse indicator.",
    },
    {
      name: "description",
      type: "ReactNode",
      default: "...",
      description: "Supporting descriptive text rendered beneath the dot matrix headline.",
    },
    {
      name: "primaryCta",
      type: "DotTextHeroCta",
      default: '{ label: "Nominate someone", href: "#nominate" }',
      description: "Primary action button configuration with label, href, or onClick handler.",
    },
    {
      name: "secondaryCta",
      type: "DotTextHeroCta",
      default: '{ label: "Cosign now", href: "#cosign" }',
      description: "Secondary outline button configuration with label, href, or onClick handler.",
    },
    {
      name: "showNav",
      type: "boolean",
      default: "true",
      description: "Whether to render the top navigation bar with brand, links, and action button.",
    },
  ],
  usageCode: `import { DotTextHero } from "@/components/ui/dot-text-hero";

export function HeroExample() {
  return (
    <DotTextHero
      lines={["KINETIC", "AWARDS"]}
      brandName="pulse"
      brandTag="2026 Edition"
      badgeText="Submissions are open"
      description="Honoring modern interfaces engineered with tactile spring physics and kinetic craft."
      primaryCta={{ label: "Submit Project", href: "#submit" }}
      secondaryCta={{ label: "Explore Nominees", href: "#nominees" }}
    />
  );
}`,
};

export default DotTextHeroMeta;
