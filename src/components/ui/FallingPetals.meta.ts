import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Falling Petals",
  description:
    "Botanical particle background rendering organic Bezier cherry blossom petals, autumn maple leaves, and golden ginkgo foliage with 3D pitch/roll/yaw flutter and shared wind gusts.",
  tagline: "3D-projected sakura petals and autumn leaves drifting on the wind.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Nature", "Botanical", "Particles"],
  createdAt: "2026-10-08",
  keywords: [
    "sakura",
    "cherry blossoms",
    "petals",
    "autumn leaves",
    "ginkgo",
    "wind",
    "nature",
    "canvas",
  ],
  features: [
    "Hand-crafted Bezier geometries for notched Sakura petals, Autumn Maple leaves, and Golden Ginkgo fans",
    "3D-projected pitch, roll, and yaw rotation using dynamic Canvas 2D matrix transforms",
    "Harmonic horizontal sway combined with global wind gusts and pointer breeze impulse",
    "Depth-of-field scaling and alpha layering for natural parallax depth",
  ],
  accessibility: [
    "Canvas element is non-interactive (pointer-events-none) so foreground content remains fully accessible",
    "HUD theme switchers and sliders support keyboard navigation",
  ],
  props: [
    {
      name: "variant",
      type: '"sakura" | "autumn" | "golden"',
      default: '"sakura"',
      description: "Selects the botanical shape and color palette preset.",
    },
    {
      name: "count",
      type: "number",
      default: "65",
      description: "Number of falling petals or leaves rendered simultaneously.",
    },
    {
      name: "windSpeed",
      type: "number",
      default: "1.0",
      description: "Multiplier for horizontal wind drift and rolling gusts.",
    },
    {
      name: "fallSpeed",
      type: "number",
      default: "1.0",
      description: "Multiplier for vertical downward descent speed.",
    },
    {
      name: "flutter",
      type: "number",
      default: "1.0",
      description: "Intensity of 3D rotational pitch/roll/yaw tumbling and horizontal sway.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the petals canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { FallingPetals } from "@/components/ui/FallingPetals";

export default function FallingPetalsDemo() {
  return (
    <FallingPetals
      variant="sakura"
      count={65}
      windSpeed={1.0}
      fallSpeed={1.0}
      flutter={1.0}
    >
      <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Spring Equinox
        </h1>
        <p className="mt-3 max-w-md text-pink-100/80">
          Delicate cherry blossom petals carried across a twilight breeze.
        </p>
      </div>
    </FallingPetals>
  );
}`,
};

export default meta;
