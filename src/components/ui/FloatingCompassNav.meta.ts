import type { PulseComponentMeta } from "../../types/component";

export const FloatingCompassNavMeta: PulseComponentMeta = {
  title: "Floating Compass Nav",
  description:
    "Viewport-anchored floating navigation pod that snaps elastically across four corner quadrants (NW, NE, SW, SE) via spring layout projection.",
  tagline: "Four-quadrant corner-snapping floating navigation pod.",
  category: "Navigation",
  badges: ["New", "Corner Snap", "Layout Spring"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "floating compass nav",
    "corner snap pip",
    "picture in picture nav",
    "framer motion layout snap",
    "floating toolbar react",
  ],
  features: [
    "Four-corner magnetic quadrant snapping (NW, NE, SW, SE) powered by Framer Motion layout projection.",
    "On-pod directional quadrant buttons plus dashed corner anchor targets.",
    "Configurable Hooke's Law stiffness and damping for travel trajectory.",
  ],
  accessibility: [
    "Every corner anchor target and directional button includes a descriptive aria-label.",
    "Fully operable via Tab and Enter/Space keys without requiring drag gestures.",
    "Snaps instantaneously across quadrants when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "defaultQuadrant",
      type: '"NW" | "NE" | "SW" | "SE"',
      default: '"SE"',
      description: "Initial corner quadrant where the navigation pod is anchored.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "300",
      description: "Spring stiffness coefficient for cross-viewport corner snapping.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description: "Spring damping coefficient controlling corner arrival bounce.",
    },
  ],
  usageCode: `import { FloatingCompassNav } from "@/components/ui/floating-compass-nav";

export function Example() {
  return (
    <FloatingCompassNav defaultQuadrant="SE" stiffness={300} damping={24} />
  );
}`,
};

export default FloatingCompassNavMeta;
