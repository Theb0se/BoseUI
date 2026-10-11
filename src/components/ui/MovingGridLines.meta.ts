import type { PulseComponentMeta } from "../../types/component";

export const MovingGridLinesMeta: PulseComponentMeta = {
  title: "Moving Grid Lines",
  description:
    "Architectural grid matrix surface featuring randomized kinetic light beams gliding along orthogonal horizontal and vertical tracks.",
  tagline: "Kinetic architectural grid surface with traveling light beams.",
  category: "Backgrounds",
  badges: ["New", "Canvas 60fps", "Kinetic Matrix"],
  createdAt: "2026-10-11",
  featured: true,
  keywords: [
    "moving grid lines",
    "animated grid beams",
    "kinetic grid pattern",
    "hero background grid",
    "matrix light beams",
    "linear grid effect",
  ],
  features: [
    "GPU-composited canvas grid matrix with zero DOM overhead and continuous 60fps frame rate.",
    "Orthogonal beam physics: light pulses travel along precise grid tracks with glowing gradient tails and head sparks.",
    "Adaptive color rendering responding dynamically to light and dark mode changes.",
    "Respects prefers-reduced-motion by pausing moving beams while retaining the architectural grid.",
  ],
  accessibility: [
    "Underlying canvas is marked aria-hidden='true' to prevent interference with screen readers.",
    "Motion automatically disables when prefers-reduced-motion is active.",
    "Designed with high contrast compatibility for text and foreground elements.",
  ],
  props: [
    {
      name: "gridSize",
      type: "number",
      default: "64",
      description: "Size of each square grid cell in pixels.",
    },
    {
      name: "beamCount",
      type: "number",
      default: "8",
      description: "Number of concurrent moving light beams.",
    },
    {
      name: "beamLength",
      type: "number",
      default: "160",
      description: "Length of the glowing beam trail in pixels.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.5",
      description: "Speed multiplier for traveling beams.",
    },
    {
      name: "radialMask",
      type: "boolean",
      default: "true",
      description: "Whether to apply a radial vignette mask fading edges to transparency.",
    },
    {
      name: "gridColor",
      type: "string",
      default: "undefined",
      description: "Explicit grid line color. Defaults to adaptive theme color.",
    },
    {
      name: "beamColor",
      type: "string",
      default: "undefined",
      description: "Explicit beam glow color. Defaults to adaptive theme color.",
    },
  ],
  usageCode: `import { MovingGridLines } from "@/components/ui/MovingGridLines";

export function HeroBackground() {
  return (
    <MovingGridLines
      gridSize={64}
      beamCount={10}
      speed={1.5}
      radialMask={true}
      className="absolute inset-0"
    />
  );
}`,
};
