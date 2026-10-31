import type { PulseComponentMeta } from "../../types/component";

export const GridCardMeta: PulseComponentMeta = {
  title: "Grid Card",
  description:
    "Interactive feature card and section featuring a top-right flickering canvas grid corner accent with diagonal mask fading, spring hover physics, icon scale/rotation variants, and dynamic hover-accelerated flicker rates.",
  tagline: "Feature card with diagonal flickering grid corner accent and spring hover physics.",
  category: "Cards",
  badges: ["Canvas", "Framer Motion", "Hover Variants", "A11y Ready"],
  createdAt: "2026-10-31",
  featured: true,
  keywords: [
    "grid card",
    "feature card",
    "flickering grid card",
    "feature section",
    "framer motion card",
    "corner accent grid",
    "hover variants",
  ],
  features: [
    "Top-right diagonal corner accent powered by FlickeringGrid with linear-gradient alpha mask clipping.",
    "Interactive hover physics: on hover, flickerChance ramps up from 0.1 to 0.6 and maxOpacity increases from 0.15 to 0.4.",
    "Parent-child hover variant system: icon container scales to 1.1 with slight rotation while link arrow shifts 4px to the right.",
    "Responsive FeatureSection layout: 1 column on mobile, 2 on md, 3 on lg with staggerChildren entrance animations.",
    "Accessible link semantics: renders as an accessible interactive card when href is provided, complete with focus-visible rings.",
  ],
  accessibility: [
    "Decorative canvas marked pointer-events-none and aria-hidden='true'.",
    "Keyboard accessible with focus-visible ring when href is supplied.",
    "Respects prefers-reduced-motion media query by bypassing spring transforms.",
  ],
  props: [
    {
      name: "icon",
      type: "React.ReactNode",
      default: "undefined",
      description: "Icon element rendered in the soft-bordered top container.",
    },
    {
      name: "title",
      type: "string",
      default: "undefined",
      description: "Main feature card title.",
    },
    {
      name: "description",
      type: "string",
      default: "undefined",
      description: "Explanatory descriptive text.",
    },
    {
      name: "href",
      type: "string",
      default: "undefined",
      description: "Optional target link destination rendering the card as an interactive link.",
    },
    {
      name: "gridColor",
      type: "string",
      default: '"currentColor"',
      description: "Color string for the flickering grid corner squares.",
    },
    {
      name: "squareSize",
      type: "number",
      default: "3",
      description: "Dimension of each square cell in the flickering grid.",
    },
    {
      name: "gridGap",
      type: "number",
      default: "5",
      description: "Spacing between adjacent grid squares in pixels.",
    },
    {
      name: "restFlickerChance",
      type: "number",
      default: "0.1",
      description: "Flickering rate when card is at rest.",
    },
    {
      name: "hoverFlickerChance",
      type: "number",
      default: "0.6",
      description: "Flickering rate when card is hovered.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into the card.",
    },
  ],
  usageCode: `import { GridCard, FeatureSection } from "@/components/ui/grid-card";
import { Zap, Shield, Cpu, Sparkles, Layers, RefreshCw } from "lucide-react";

export function FeaturesDemo() {
  const sampleFeatures = [
    {
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      title: "Real-time Reactivity",
      description: "Ultra-fast state synchronization with zero hydration latency across edge runtimes.",
      href: "#",
    },
    {
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
      title: "Zero-trust Security",
      description: "End-to-end cryptographic token verification with hardware-backed encryption.",
      href: "#",
    },
    {
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      title: "Compute at the Edge",
      description: "Execute sub-millisecond serverless functions deployed to 300+ global data centers.",
      href: "#",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      title: "Adaptive Physics",
      description: "Spring dynamics calibrated to 120Hz display refresh rates for natural fluidity.",
      href: "#",
    },
    {
      icon: <Layers className="h-5 w-5 text-sky-500" />,
      title: "Composability First",
      description: "Modular primitives that combine effortlessly into complex application dashboards.",
      href: "#",
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-indigo-500" />,
      title: "Continuous Deployment",
      description: "Automated git preview branches with instant rollbacks and deterministic builds.",
      href: "#",
    },
  ];

  return (
    <FeatureSection
      title="Everything you need to ship faster"
      subtitle="Engineered for performance, tactile responsiveness, and developer ergonomics."
      features={sampleFeatures}
    />
  );
}`,
};

export default GridCardMeta;
