import type { PulseComponentMeta } from "../../types/component";

export const LiquidGradientBlobMeta: PulseComponentMeta = {
  title: "Liquid Gradient Blob",
  description:
    "Organic metaball background powered by an SVG `feGaussianBlur` + `feColorMatrix` alpha-threshold gooey filter where orbiting and cursor-tracked blobs fuse seamlessly.",
  tagline: "SVG gooey filter metaballs that merge like liquid lava.",
  category: "Backgrounds",
  badges: ["New", "SVG Gooey Filter", "Interactive"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "liquid gradient blob",
    "svg gooey filter",
    "metaball animation",
    "feColorMatrix gooey",
    "lava lamp background",
  ],
  features: [
    "Uses an inline SVG `<feGaussianBlur>` + `<feColorMatrix>` filter (`0 0 0 24 -10`) for sharp surface-tension merging.",
    "Combines autonomous orbiting blobs with a spring-loaded cursor-following metaball.",
    "Customizable blob `colors`, `speed`, and `gooeyIntensity` radius.",
  ],
  accessibility: [
    "Marks the hidden SVG filter definition and decorative blob layer with `aria-hidden='true'`.",
    "Uses `useId()` to guarantee unique SVG filter IDs when multiple instances are mounted.",
    "Maintains high foreground text contrast.",
  ],
  props: [
    {
      name: "colors",
      type: "string[]",
      default: '["#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6"]',
      description: "Array of colors applied to the metaball blobs.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Orbit animation speed multiplier.",
    },
    {
      name: "gooeyIntensity",
      type: "number",
      default: "22",
      description: "Standard deviation for the `feGaussianBlur` filter.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the blobs.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the container.",
    },
  ],
  usageCode: `import { LiquidGradientBlob } from "@/components/ui/liquid-gradient-blob";

export function Example() {
  return (
    <LiquidGradientBlob
      colors={["#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6"]}
      speed={1}
      gooeyIntensity={22}
    />
  );
}`,
};

export default LiquidGradientBlobMeta;
