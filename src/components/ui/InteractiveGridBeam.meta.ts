import type { PulseComponentMeta } from "../../types/component";

export const InteractiveGridBeamMeta: PulseComponentMeta = {
  title: "Interactive Grid Beam",
  description:
    "Architectural matrix background surface with spring-smoothed radial cursor illumination and click-triggered orthogonal grid light beams.",
  tagline: "Spring-masked matrix grid with orthogonal intersection light beams.",
  category: "Backgrounds",
  badges: ["New", "GPU Composited", "Interactive Surface"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "interactive grid beam",
    "matrix background",
    "cursor grid spotlight",
    "framer motion background",
    "hero grid surface",
  ],
  features: [
    "Dual-layer CSS grid matrix revealed dynamically via Framer Motion useMotionTemplate mask-image.",
    "Snaps click coordinates to the nearest grid intersection and fires orthogonal horizontal and vertical light beams.",
    "Zero React re-renders during pointer movement.",
  ],
  accessibility: [
    "All background matrix layers and light beam traces are marked aria-hidden='true'.",
    "Disables orthogonal pulse animations when prefers-reduced-motion is active.",
    "Preserves high foreground readability with a translucent backdrop card.",
  ],
  props: [
    {
      name: "gridSize",
      type: "number",
      default: "32",
      description: "Width and height of each matrix cell in pixels.",
    },
    {
      name: "glowRadius",
      type: "number",
      default: "220",
      description: "Radius of the cursor-tracked radial grid illumination mask in pixels.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "280",
      description: "Spring stiffness coefficient for cursor spotlight tracking.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient for cursor spotlight tracking.",
    },
  ],
  usageCode: `import { InteractiveGridBeam } from "@/components/ui/interactive-grid-beam";

export function Example() {
  return (
    <InteractiveGridBeam gridSize={32} glowRadius={220}>
      <div className="rounded-xl border border-neutral-200 bg-white/90 px-5 py-3 dark:border-[#262626] dark:bg-[#111]/90">
        <span className="text-sm font-semibold">Click any grid intersection</span>
      </div>
    </InteractiveGridBeam>
  );
}`,
};

export default InteractiveGridBeamMeta;
