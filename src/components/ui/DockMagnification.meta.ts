import type { PulseComponentMeta } from "../../types/component";

export const DockMagnificationMeta: PulseComponentMeta = {
  title: "macOS Dock Magnification",
  description:
    "macOS-inspired dock magnification bar with continuous Gaussian/cosine pointer falloff, spring physics scaling, click-to-bounce launch animations, floating tooltip labels, and running indicator dots.",
  tagline: "Fluid macOS dock magnification with spring physics and launch bounce.",
  category: "Navigation",
  badges: ["New", "macOS Dock", "Magnification", "Spring Physics"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "dock magnification",
    "macos dock",
    "apple dock",
    "spring physics",
    "gaussian falloff",
    "dock bounce",
    "floating bar",
  ],
  features: [
    "Continuous Gaussian/cosine pointer falloff calculating dynamic icon sizing smoothly in real-time.",
    "Spring-damped physics eliminating jarring jumps during rapid pointer movement.",
    "Click-to-bounce keyframe oscillation simulating macOS application launch feedback.",
    "Frosted backdrop glass container with specular reflections and dark/light mode elegance.",
    "Customizable magnification factor, falloff radius, and app running indicator dots.",
  ],
  accessibility: [
    "Keyboard accessible with tab navigation and focus indicators on dock apps.",
    "Clear ARIA labels for each application icon with tooltips for screen readers.",
    "Respects reduced motion settings for bounce oscillations and scale effects.",
  ],
  props: [
    {
      name: "items",
      type: "DockAppItem[]",
      description: "Array of dock application objects with icons, colors, running states, and badges.",
    },
    {
      name: "baseSize",
      type: "number",
      default: "48",
      description: "Default unmagnified icon size in pixels.",
    },
    {
      name: "magnification",
      type: "number",
      default: "1.65",
      description: "Peak magnification multiplier when cursor directly hovers an item.",
    },
    {
      name: "distance",
      type: "number",
      default: "140",
      description: "Gaussian falloff influence radius in pixels on either side of pointer.",
    },
    {
      name: "onItemClick",
      type: "(item: DockAppItem) => void",
      description: "Callback triggered when a dock icon is clicked.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes applied to root container.",
    },
  ],
  usageCode: `import { DockMagnification } from "@/components/ui/DockMagnification";

export function Example() {
  return (
    <DockMagnification
      magnification={1.7}
      distance={150}
      onItemClick={(app) => console.log("Launched:", app.name)}
    />
  );
}`,
};

export default DockMagnificationMeta;
