import type { PulseComponentMeta } from "../../types/component";

export const ProductRevealSectionMeta: PulseComponentMeta = {
  title: "Product Reveal Section",
  description:
    "An Apple-inspired flagship hardware inspection block featuring 360-degree rotational scrubbing, synchronized callouts, live titanium color finish selection, docked sticky navigation, and specular liquid glass tilt card security.",
  tagline: "Apple-style hardware inspection block with 360° scrubbing and live titanium finish swatch picker.",
  category: "Cards",
  badges: ["Block", "Hero", "Hardware", "Interactive", "3D Inspection"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "product reveal section",
    "product sequence scrubber",
    "color finish picker",
    "liquid glass card",
    "sticky subnav",
    "apple inspection",
    "titanium showcase",
    "360 viewer",
  ],
  features: [
    "Full 360-degree interactive rotational sequence scrubber with exploded engineering view toggle.",
    "Synchronized hotspot callouts that track rotation frames and reveal industrial design highlights.",
    "Interactive titanium finish picker with Natural, Desert, White, and Black Titanium swatches.",
    "Docked StickySubNav header with real-time specs, pricing, and instantaneous Pre-order action.",
    "LiquidGlassCard specular 3D tilt perspective view for digital ownership passes or security guarantees.",
  ],
  accessibility: [
    "Meets high-contrast standards across dark titanium chassis textures and UI typography.",
    "Accessible 44px+ interactive targets on tab switchers, color swatches, and pre-order buttons.",
    "Full keyboard arrow key navigation supported within the rotational scrubber.",
    "Respects reduced motion preferences by pausing continuous rotational autoplay.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Titanium Pro Max"',
      description: "Primary product headline name.",
    },
    {
      name: "tagline",
      type: "string",
      default: '"Engineered from aerospace Grade 5 titanium. Forged with precision micromechanics."',
      description: "Descriptive tagline describing hardware materials.",
    },
    {
      name: "price",
      type: "string",
      default: '"$1,199"',
      description: "Price tag displayed in the pinned subnav and pre-order callout.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { ProductRevealSection } from "@/components/ui/ProductRevealSection";

export function Example() {
  return (
    <ProductRevealSection
      title="Titanium Pro Max"
      price="$1,199"
    />
  );
}`,
};

export default ProductRevealSectionMeta;
