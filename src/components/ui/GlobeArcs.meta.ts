import type { PulseComponentMeta } from "../../types/component";

export const GlobeArcsMeta: PulseComponentMeta = {
  title: "Globe Arcs",
  description:
    "Interactive 3D dotted Canvas globe featuring glowing multi-point transaction flight arcs, traveling light pulses, drag-to-rotate interaction with inertia dampening, and global city routing nodes.",
  tagline: "Interactive 3D dotted globe with glowing transaction flight arcs and drag-to-rotate inertia.",
  category: "Backgrounds",
  badges: ["Stripe", "Canvas 3D", "Globe", "Flight Arcs", "Backgrounds"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "globe arcs",
    "stripe globe",
    "3d canvas globe",
    "transaction arcs",
    "flight routes",
    "interactive globe",
    "point cloud earth",
  ],
  features: [
    "Lightweight Canvas 2D spherical projection with 800+ golden-angle dotted point cloud vertices.",
    "Elevated great-circle 3D bezier arcs connecting major financial hubs (SF, NYC, London, Tokyo, Singapore, Sydney).",
    "Traveling glowing light pulse heads and trail rendering on each active transaction route.",
    "Intuitive touch & pointer drag-to-rotate with physics-based inertia dampening and auto-rotation.",
    "Live interactive stage controls to adjust spin speed, emit pulses, reset angles, and select edge nodes.",
  ],
  accessibility: [
    "Fully pauseable auto-rotation via visible interactive toggle button.",
    "Handles reduced-motion preferences by maintaining static inspection without continuous spinning.",
    "Does not block keyboard focus order or document scrolling.",
  ],
  props: [
    {
      name: "autoRotateSpeed",
      type: "number",
      default: "0.004",
      description: "Angular speed (radians per frame) for the continuous globe rotation.",
    },
    {
      name: "initialRadius",
      type: "number",
      default: "160",
      description: "Base spherical radius benchmark used for coordinate scaling.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { GlobeArcs } from "@/components/ui/GlobeArcs";

export function Example() {
  return (
    <div className="w-full">
      <GlobeArcs autoRotateSpeed={0.004} />
    </div>
  );
}`,
};

export default GlobeArcsMeta;
