import type { PulseComponentMeta } from "../../types/component";

export const StarryNightMeta: PulseComponentMeta = {
  title: "Starry Night",
  description:
    "Canvas 2D night sky rendering 100 to 350 depth-layered stars that twinkle via independent sine-wave phases and shift smoothly on pointer move.",
  tagline: "Twinkling Canvas 2D starfield with multi-layer mouse parallax.",
  category: "Backgrounds",
  badges: ["New", "Canvas 2D", "Parallax"],
  createdAt: "2026-10-08",
  featured: false,
  keywords: [
    "starry night background",
    "twinkling stars canvas",
    "parallax starfield",
    "space background",
    "night sky animation",
  ],
  features: [
    "Draws 100 to 350 stars with randomized depth, radius, and sine-wave twinkle frequency.",
    "Smoothly interpolates pointer coordinates for multi-layer depth parallax.",
    "Includes a live Twinkle toggle button in the default preview.",
  ],
  accessibility: [
    "Marks the `<canvas>` element with `aria-hidden='true'`.",
    "High-contrast white text over the deep navy night sky gradient.",
    "Interactive Twinkle toggle button is keyboard accessible.",
  ],
  props: [
    {
      name: "density",
      type: "number",
      default: "200",
      description: "Number of stars drawn on the canvas (40 to 400).",
    },
    {
      name: "twinkle",
      type: "boolean",
      default: "true",
      description: "Modulates star alpha over time with a sine wave per star.",
    },
    {
      name: "parallax",
      type: "number",
      default: "24",
      description: "Maximum pixel shift on pointer movement.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the starfield.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { StarryNight } from "@/components/ui/starry-night";

export function Example() {
  return (
    <StarryNight
      density={220}
      twinkle
      parallax={24}
    />
  );
}`,
};

export default StarryNightMeta;
