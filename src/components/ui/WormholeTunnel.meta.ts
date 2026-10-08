import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Wormhole Tunnel",
  description:
    "Structured hyperspace wormhole tunnel on Canvas 2D featuring concentric polygonal energy rings and longitudinal warp ribs scaling from an interactive Lissajous vanishing point.",
  tagline: "Interactive Einstein-Rosen conduit with helical twist and spectrum shift.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Interactive", "3D Perspective", "Cosmic"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "wormhole",
    "hyperspace tunnel",
    "warp drive",
    "portal background",
    "vortex",
    "perspective grid",
    "sci-fi canvas",
  ],
  features: [
    "Exponential 3D perspective projection of concentric geodesic rings and longitudinal ribs",
    "Pointer-reactive vanishing throat that smoothly falls back to an organic Lissajous oscillation",
    "Continuous helical twist and spectral HSL hue shifting from throat to outer aperture",
    "Interactive HUD with Cherenkov Cyan, Hyperdrive Magenta, and Chrono Gold presets",
  ],
  accessibility: [
    "Canvas is marked aria-hidden so screen readers bypass decorative tunnel geometry",
    "Interactive speed and twist sliders allow reducing motion velocity on demand",
  ],
  props: [
    {
      name: "ringCount",
      type: "number",
      default: "28",
      description: "Number of concentric depth rings rendered along the wormhole.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Forward traversal velocity multiplier.",
    },
    {
      name: "baseHue",
      type: "number",
      default: "195",
      description: "Starting HSL hue angle in degrees (0-360).",
    },
    {
      name: "hueShift",
      type: "number",
      default: "90",
      description: "Total hue shift across the depth of the tunnel.",
    },
    {
      name: "twist",
      type: "number",
      default: "1.2",
      description: "Helical rotational twist factor along the tunnel axis.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "true",
      description: "Whether pointer movement bends the wormhole vanishing point.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered inside the wormhole container.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the root container.",
    },
  ],
  usageCode: `import { WormholeTunnel } from "@/components/ui/WormholeTunnel";

export function WormholeTunnelDemo() {
  return (
    <WormholeTunnel
      ringCount={28}
      speed={1.0}
      baseHue={195}
      hueShift={90}
      twist={1.2}
      interactive
    />
  );
}`,
};

export default meta;
