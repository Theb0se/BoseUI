import type { PulseComponentMeta } from "../../types/component";

export const ParticleNetworkMeta: PulseComponentMeta = {
  title: "Particle Network",
  description:
    "Interactive Canvas 2D proximity graph where drifting nodes dynamically connect with distance-attenuated lines whenever they pass within a threshold radius.",
  tagline: "Drifting nodes connected by distance-attenuated proximity lines.",
  category: "Backgrounds",
  badges: ["New", "Canvas 2D", "Interactive Graph"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "particle network",
    "constellation nodes canvas",
    "connected dots background",
    "network graph animation",
    "tech hero background",
  ],
  features: [
    "Computes pairwise Euclidean distance (`Math.hypot`) and renders edges with opacity proportional to `1 - dist / connectDistance`.",
    "Interactive cursor node that links to nearby particles as the user moves their pointer.",
    "Elastic boundary reflection keeps all nodes inside the responsive canvas.",
  ],
  accessibility: [
    "Marks the `<canvas>` graph layer with `aria-hidden='true'`.",
    "High-contrast foreground text over the `#05070B` canvas.",
    "Zero pointer-event obstruction for foreground buttons and links.",
  ],
  props: [
    {
      name: "particleCount",
      type: "number",
      default: "55",
      description: "Number of autonomous drifting nodes.",
    },
    {
      name: "connectDistance",
      type: "number",
      default: "125",
      description: "Maximum pixel distance at which two nodes form a connecting line.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Node drift speed multiplier.",
    },
    {
      name: "particleColor",
      type: "string",
      default: '"255, 255, 255"',
      description: "RGB triplet string ('R, G, B') used for node and line alpha rendering.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "true",
      description: "Connects nearby nodes to the user's cursor on hover.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the network.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { ParticleNetwork } from "@/components/ui/particle-network";

export function Example() {
  return (
    <ParticleNetwork
      particleCount={55}
      connectDistance={125}
      interactive
    />
  );
}`,
};

export default ParticleNetworkMeta;
