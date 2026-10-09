import type { PulseComponentMeta } from "../../types/component";

export const FinalCtaBlockMeta: PulseComponentMeta = {
  title: "Final CTA Block",
  description:
    "High-conversion hero call-to-action block featuring a relativistic BlackHole gravitational backdrop, kinetic swipe deployment trigger, and hold-to-confirm launch action.",
  tagline: "High-impact conversion CTA with cosmic physics and dual deliberate action triggers.",
  category: "Buttons",
  badges: ["Block", "Application", "CTA", "Conversion", "Cosmic"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "final cta block",
    "conversion section",
    "slide to deploy",
    "hold to confirm",
    "black hole backdrop",
    "cosmic hero",
  ],
  features: [
    "Real-time WebGL relativistic BlackHole gravitational lensing and glowing accretion disk backdrop.",
    "Integrated KineticSwipeButton with threshold detection for deliberate slide-to-deploy interactions.",
    "Integrated HoldToConfirmButton with spring-damped press feedback for irreversible mission-critical launches.",
    "Instant edge synchronization confirmation badge and telemetry metrics.",
    "Fully responsive layout with mobile-first stacked controls and desktop multi-column stats.",
  ],
  accessibility: [
    "Contains accessible native button triggers with keyboard and screen reader focus indicators.",
    "Provides real-time ARIA live region status messaging upon deployment confirmation.",
    "Respects prefers-reduced-motion across motion transitions and physics damping.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Ready to transcend traditional web limits?"',
      description: "Primary headline text.",
    },
    {
      name: "description",
      type: "string",
      default: '"Deploy your tactile high-performance interface with relativistic physics..."',
      description: "Subordinate description and value proposition copy.",
    },
    {
      name: "swipeLabel",
      type: "string",
      default: '"Slide to deploy production"',
      description: "Label for the kinetic swipe button trigger.",
    },
    {
      name: "holdLabel",
      type: "string",
      default: '"Hold to launch cluster"',
      description: "Label for the hold-to-confirm button trigger.",
    },
    {
      name: "onDeploy",
      type: "() => void",
      description: "Callback fired when kinetic swipe passes completion threshold.",
    },
    {
      name: "onLaunch",
      type: "() => void",
      description: "Callback fired when hold-to-confirm timer finishes 100%.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional additional CSS class names for styling customization.",
    },
  ],
  usageCode: `import { FinalCtaBlock } from "@/components/ui/FinalCtaBlock";

export default function Example() {
  return (
    <FinalCtaBlock
      title="Scale without boundaries"
      description="Deploy enterprise clusters instantly with tactile physics and zero downtime."
      swipeLabel="Slide to deploy"
      holdLabel="Hold to launch"
      onDeploy={() => console.log("Deployment initiated")}
      onLaunch={() => console.log("Cluster launched")}
    />
  );
}`,
};

export default FinalCtaBlockMeta;
