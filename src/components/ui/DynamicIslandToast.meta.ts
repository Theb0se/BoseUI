import type { PulseComponentMeta } from "../../types/component";

export const DynamicIslandToastMeta: PulseComponentMeta = {
  title: "Dynamic Island Toast",
  description:
    "Morphing top-edge status capsule that expands smoothly between compact badge, live telemetry pill, and actionable notification drawer.",
  tagline: "Three-stage morphing status capsule with spring layout projection.",
  category: "Overlays",
  badges: ["New", "Morphing Capsule", "Live Status"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "dynamic island toast",
    "morphing notification pill",
    "apple dynamic island react",
    "framer motion toast",
    "status capsule",
  ],
  features: [
    "Three-state layout projection (compact -> telemetry -> expanded) driven by Hooke's Law spring geometry.",
    "Click directly on the capsule or use external state triggers to morph dimensions and border radii seamlessly.",
    "Includes interactive collapse and dismiss actions inside the expanded notification card.",
  ],
  accessibility: [
    "Uses role='status' and aria-live='polite' to announce live notification state transitions.",
    "All interactive stages and collapse buttons are keyboard-focusable via Tab and Enter/Space.",
    "Collapses transition duration to near-zero when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "defaultMode",
      type: '"compact" | "telemetry" | "expanded"',
      default: '"compact"',
      description: "Initial visual state of the morphing status island.",
    },
    {
      name: "title",
      type: "string",
      default: '"Registry Sync Active"',
      description: "Primary notification heading displayed in telemetry and expanded modes.",
    },
    {
      name: "subtitle",
      type: "string",
      default: '"12 shadcn v2 manifests compiled in 42ms"',
      description: "Detailed status description displayed in expanded mode.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "340",
      description: "Hooke's Law spring stiffness for capsule dimension morphing.",
    },
    {
      name: "damping",
      type: "number",
      default: "25",
      description: "Spring damping coefficient controlling capsule oscillation decay.",
    },
  ],
  usageCode: `import { DynamicIslandToast } from "@/components/ui/dynamic-island-toast";

export function Example() {
  return (
    <DynamicIslandToast
      defaultMode="compact"
      title="Registry Sync Active"
      subtitle="12 shadcn v2 manifests compiled in 42ms"
    />
  );
}`,
};

export default DynamicIslandToastMeta;
