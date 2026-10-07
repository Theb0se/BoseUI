import type { PulseComponentMeta } from "../../types/component";

export const RippleBurstButtonMeta: PulseComponentMeta = {
  title: "Ripple Burst Button",
  description:
    "Tactile impulse button that spawns dual concentric shockwave rings from the exact pointer click coordinate with spring recoil.",
  tagline: "Coordinate-origin dual concentric shockwaves with spring recoil.",
  category: "Buttons",
  badges: ["New", "Shockwave Ripple", "Spring Recoil"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "ripple burst button",
    "shockwave button",
    "click ripple effect react",
    "framer motion button",
    "kinetic pulse button",
  ],
  features: [
    "Computes exact local pointer coordinates (x, y) on click to spawn dual staggered shockwave rings.",
    "Coupled Hooke's Law hover lift and tap compression.",
    "Built-in live pulse counter badge.",
  ],
  accessibility: [
    "Marks all expanding shockwave ring elements with aria-hidden='true'.",
    "Supports standard Enter and Space keyboard activation (spawning ripples from button center).",
    "Suppresses shockwave rings and scale transforms when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "label",
      type: "string",
      default: '"Emit Shockwave Pulse"',
      description: "Primary text label rendered inside the button.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "400",
      description: "Hooke's Law spring stiffness for hover and tap recoil.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling recoil settling.",
    },
  ],
  usageCode: `import { RippleBurstButton } from "@/components/ui/ripple-burst-button";

export function Example() {
  return (
    <RippleBurstButton label="Emit Shockwave Pulse" stiffness={400} damping={22} />
  );
}`,
};

export default RippleBurstButtonMeta;
