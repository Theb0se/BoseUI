import type { PulseComponentMeta } from "../../types/component";

export const MorphingBlobMeta: PulseComponentMeta = {
  title: "Morphing Blob",
  description:
    "Organic fluid morphing SVG blob driven by Catmull-Rom cubic spline interpolation, Hooke's Law spring physics per node, and smooth real-time cursor attraction.",
  tagline: "Organic fluid SVG blob driven by Catmull-Rom splines and spring dynamics.",
  category: "Backgrounds",
  badges: ["New", "Interactive", "Spring Physics", "SVG"],
  createdAt: "2026-10-23",
  featured: true,
  keywords: [
    "morphing blob",
    "fluid blob svg",
    "catmull rom spline",
    "spring physics blob",
    "cursor follow blob",
    "liquid gradient blob",
  ],
  features: [
    "Continuous Catmull-Rom cubic bezier closed loop path computation.",
    "Hooke's Law spring-mass-damping physics simulation per radial node.",
    "Real-time cursor parallax offset with smooth damping and viewport scaling.",
    "Accessible automatic fallback for prefers-reduced-motion environments.",
  ],
  accessibility: [
    "Marks ambient SVG canvas with aria-hidden='true' and role='presentation'.",
    "Automatically bypasses frame animation loops if prefers-reduced-motion is detected.",
  ],
  props: [
    {
      name: "width",
      type: "number",
      default: "400",
      description: "Width of the SVG viewBox in pixels.",
    },
    {
      name: "height",
      type: "number",
      default: "400",
      description: "Height of the SVG viewBox in pixels.",
    },
    {
      name: "points",
      type: "number",
      default: "8",
      description: "Number of radial anchor nodes forming the organic perimeter.",
    },
    {
      name: "baseRadius",
      type: "number",
      default: "120",
      description: "Resting base radius of the blob from center in pixels.",
    },
    {
      name: "variance",
      type: "number",
      default: "28",
      description: "Maximum radial fluctuation delta applied to node targets.",
    },
    {
      name: "speed",
      type: "number",
      default: "0.7",
      description: "Frequency of retargeting cycles for organic movement.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "45",
      description: "Spring stiffness constant pulling nodes toward their targets.",
    },
    {
      name: "damping",
      type: "number",
      default: "9",
      description: "Velocity damping factor preventing wild oscillations.",
    },
    {
      name: "cursorFollow",
      type: "boolean",
      default: "true",
      description: "Enable smooth attraction toward the pointer location.",
    },
    {
      name: "cursorStrength",
      type: "number",
      default: "0.35",
      description: "Offset multiplier applied to the blob center relative to pointer position.",
    },
    {
      name: "cursorSmoothness",
      type: "number",
      default: "0.08",
      description: "Lerp interpolation speed for cursor tracking.",
    },
    {
      name: "colors",
      type: "[string, string]",
      default: "['#7C3AED', '#06B6D4']",
      description: "Two-stop linear gradient hex colors filling the blob.",
    },
  ],
  usageCode: `import { MorphingBlob } from "@/components/ui/MorphingBlob";

export function Example() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-950">
      <MorphingBlob
        width={420}
        height={420}
        baseRadius={130}
        variance={32}
        colors={["#8B5CF6", "#3B82F6"]}
      />
    </div>
  );
}`,
};

export default MorphingBlobMeta;
