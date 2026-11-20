import type { PulseComponentMeta } from "../../types/component";

export const MovingTextBorderMeta: PulseComponentMeta = {
  title: "Moving Text Border",
  description:
    "Kinetic card wrapper with animated typography continuously flowing along the rounded perimeter using SVG textPath, dynamic geometry calculation, and zero-distortion responsiveness.",
  tagline: "Animated typography marching along the card perimeter via SVG textPath.",
  category: "Cards",
  badges: ["New", "SVG textPath", "Border Animation", "Kinetic"],
  createdAt: "2026-11-20",
  featured: true,
  keywords: [
    "moving text border",
    "animated text border",
    "text border",
    "svg textpath",
    "marching text",
    "kinetic card",
    "framer motion border",
    "available for work badge",
  ],
  features: [
    "Dynamic ResizeObserver geometry: recalculates the rounded-rect path on container resize for distortion-free letterforms.",
    "Hardware-accelerated SVG textPath animation with configurable loop duration and flow direction.",
    "Automatic perimeter tiling and repetition to seamlessly loop around cards of any aspect ratio.",
    "Unique instance-scoped SVG def IDs via React useId preventing collisions when multiple instances are mounted.",
    "Customizable typography styling (fill color, font size, letter spacing, font weight) and optional ambient glow.",
    "Respects system prefers-reduced-motion settings by halting rotation.",
  ],
  accessibility: [
    "Decorative perimeter SVG is marked with aria-hidden='true' to prevent screen-reader spam.",
    "Respects prefers-reduced-motion by freezing text translation.",
    "Preserves natural DOM order and keyboard tab flow for wrapped child content.",
  ],
  props: [
    {
      name: "children",
      type: "React.ReactNode",
      description: "Content displayed inside the card wrapper.",
    },
    {
      name: "text",
      type: "string",
      default: '"AVAILABLE FOR WORK • AVAILABLE FOR WORK • "',
      description: "Text string continuously marching around the perimeter.",
    },
    {
      name: "duration",
      type: "number",
      default: "12",
      description: "Duration in seconds for one complete circuit around the card.",
    },
    {
      name: "reverse",
      type: "boolean",
      default: "false",
      description: "Whether text flows counter-clockwise instead of clockwise.",
    },
    {
      name: "textColor",
      type: "string",
      default: '"#a78bfa"',
      description: "Fill color of the perimeter typography.",
    },
    {
      name: "fontSize",
      type: "number",
      default: "10",
      description: "Font size in pixels for the SVG text.",
    },
    {
      name: "letterSpacing",
      type: "number",
      default: "2",
      description: "Letter spacing in pixels between characters.",
    },
    {
      name: "borderRadius",
      type: "number",
      default: "16",
      description: "Corner radius in pixels for the card and SVG path.",
    },
    {
      name: "trackColor",
      type: "string",
      description: "Optional background guide path stroke color.",
    },
    {
      name: "glow",
      type: "boolean",
      default: "false",
      description: "Whether to apply a soft Gaussian blur ambient glow filter to the text.",
    },
    {
      name: "autoRepeat",
      type: "boolean",
      default: "true",
      description: "Whether to automatically repeat the text to fill the entire card perimeter.",
    },
  ],
  usageCode: `import { MovingTextBorder } from "@/components/ui/MovingTextBorder";

export function Example() {
  return (
    <MovingTextBorder
      text="AVAILABLE FOR WORK • OPEN TO CONTRACTS • "
      duration={12}
      textColor="#a78bfa"
      glow={true}
      className="max-w-md"
    >
      <div className="py-6 text-center">
        <h3 className="text-xl font-bold">Rishabh Bose</h3>
        <p className="text-sm text-neutral-500">Design Engineer & Full-stack Creator</p>
      </div>
    </MovingTextBorder>
  );
}`,
};

export default MovingTextBorderMeta;
