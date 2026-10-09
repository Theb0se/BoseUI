import type { PulseComponentMeta } from "../../types/component";

export const ProductSequenceScrubberMeta: PulseComponentMeta = {
  title: "Product Sequence Scrubber",
  description:
    "Apple-inspired interactive 360° hardware sequence scrubber with vector frame rotation, multi-layer explosion disassembly view, and angle-synchronized feature callouts.",
  tagline: "Apple-style 360° device inspection with timeline scrubbing and layer explosion.",
  category: "Motion" as any,
  badges: ["New", "360° Inspection", "Hardware Scrubber", "Apple"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "product scrubber",
    "360 spin",
    "apple product tour",
    "hardware explosion",
    "timeline scrubber",
    "vector device",
    "exploded view",
  ],
  features: [
    "Smooth 36-frame continuous vector rotation with realistic lighting and reflections.",
    "Interactive timeline scrubber bar with preset key angles (0°, 90°, 180°, 270°).",
    "Exploded multi-layer hardware disassembly view separating screen, chassis, A18 Pro logic board, and battery.",
    "Angle-synchronized feature callouts highlighting titanium frame, action button, and silicon.",
    "Play/pause auto-spin mode with responsive framer-motion micro-interactions.",
  ],
  accessibility: [
    "Full keyboard navigation support with accessible range slider controls.",
    "Includes ARIA labels for play/pause, explosion toggles, and preset rotation angles.",
    "Reduced motion respected for transitions and rotation intervals.",
  ],
  props: [
    {
      name: "totalFrames",
      type: "number",
      default: "36",
      description: "Total number of rotational steps around the 360° circle.",
    },
    {
      name: "defaultFrame",
      type: "number",
      default: "6",
      description: "Initial frame index to display on render.",
    },
    {
      name: "defaultAutoPlay",
      type: "boolean",
      default: "false",
      description: "Whether the product sequence auto-spins on mount.",
    },
    {
      name: "defaultExploded",
      type: "boolean",
      default: "false",
      description: "Whether the hardware layers are initially exploded.",
    },
    {
      name: "callouts",
      type: "FeatureCallout[]",
      description: "List of angle-synchronized feature annotations.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { ProductSequenceScrubber } from "@/components/ui/ProductSequenceScrubber";

export function Example() {
  return (
    <ProductSequenceScrubber
      totalFrames={36}
      defaultFrame={0}
      defaultAutoPlay={false}
    />
  );
}`,
};

export default ProductSequenceScrubberMeta;
