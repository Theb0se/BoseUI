import type { PulseComponentMeta } from "../../types/component";

export const RadialMenuOrbMeta: PulseComponentMeta = {
  title: "Radial Menu Orb",
  description:
    "Floating command orb that blossoms into a 360-degree polar-coordinate action ring with staggered Hooke's Law spring trajectories.",
  tagline: "360° polar-coordinate radial command menu with staggered springs.",
  category: "Navigation",
  badges: ["New", "Polar Geometry", "Staggered Springs"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "radial menu orb",
    "circular menu",
    "floating action button menu",
    "polar coordinate navigation",
    "framer motion radial menu",
  ],
  features: [
    "Trigonometric polar coordinate distribution (cos/sin) that adapts automatically to any number of satellite actions.",
    "Staggered Hooke's Law spring blossom and collapse trajectories with rotational core icon feedback.",
    "Accessible keyboard navigation and Escape key dismissal.",
  ],
  accessibility: [
    "Core orb button announces open/closed state via aria-expanded and descriptive aria-label.",
    "Each satellite action button includes an explicit aria-label and focus-visible tooltip.",
    "Supports Escape key dismissal and disables spring travel when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "actions",
      type: "RadialOrbAction[]",
      description:
        "Array of satellite action items containing id, label, icon node, and optional click callback.",
    },
    {
      name: "radius",
      type: "number",
      default: "78",
      description: "Polar orbit radius in pixels from center orb to satellite buttons.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "340",
      description: "Spring stiffness coefficient for radial expansion and collapse.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling orbital settling.",
    },
  ],
  usageCode: `import { RadialMenuOrb } from "@/components/ui/radial-menu-orb";

export function Example() {
  return (
    <RadialMenuOrb radius={78} stiffness={340} damping={22} />
  );
}`,
};

export default RadialMenuOrbMeta;
