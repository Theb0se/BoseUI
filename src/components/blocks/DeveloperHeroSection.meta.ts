import type { PulseComponentMeta } from "../../types/component";

export const DeveloperHeroSectionMeta: PulseComponentMeta = {
  title: "Developer Hero Section",
  description:
    "A Stripe-inspired developer hero block combining an angled flowing gradient mesh, multi-language TabbedCodeBlock with terminal execution, and an interactive 3D GlobeArcs canvas showcasing global transaction routing.",
  tagline: "Stripe-inspired developer hero with gradient mesh, live code terminal, and 3D globe routing.",
  category: "Cards",
  badges: ["Block", "Hero", "Developer", "Stripe", "CodeBlock", "Globe"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "developer hero",
    "stripe style",
    "gradient mesh hero",
    "tabbed code block",
    "globe arcs",
    "terminal",
    "landing block",
    "api documentation",
  ],
  features: [
    "Dynamic angled GradientMeshHero with flowing organic color convection and clip-path slope.",
    "Integrated multi-language TabbedCodeBlock (cURL, Node.js, Python, Go) with copy animations and run output.",
    "Canvas 2D interactive 3D GlobeArcs with drag rotation, inertia dampening, and light pulses across world financial hubs.",
    "Dual-mode toggle between live API code terminal and interactive global infrastructure inspection.",
    "Real-time processing capacity and P99 latency metric telemetry cards.",
  ],
  accessibility: [
    "High-contrast code syntax highlighting and typography meeting WCAG 2.1 AA standards (4.5:1+).",
    "Interactive tab buttons and action triggers have 44px+ touch targets and full keyboard focus rings.",
    "3D Canvas globe responds to pointer interactions and provides static status fallbacks.",
    "Respects prefers-reduced-motion by dampening gradient mesh drift and globe rotation.",
  ],
  props: [
    {
      name: "headline",
      type: "string",
      default: '"The financial infrastructure built for developers."',
      description: "Primary headline rendered in the top hero area.",
    },
    {
      name: "tagline",
      type: "string",
      default: '"Accept payments, send payouts, and automate financial workflows globally..."',
      description: "Descriptive paragraph text beneath the main headline.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DeveloperHeroSection } from "@/components/ui/DeveloperHeroSection";

export function Example() {
  return (
    <DeveloperHeroSection
      headline="The financial infrastructure built for developers."
      tagline="Accept payments, send payouts, and automate financial workflows globally with a battle-tested API."
    />
  );
}`,
};

export default DeveloperHeroSectionMeta;
