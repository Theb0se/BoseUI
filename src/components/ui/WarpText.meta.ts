import type { PulseComponentMeta } from "../../types/component";

export const WarpTextMeta: PulseComponentMeta = {
  title: "Warp Text",
  description:
    "Cinematic sci-fi typography animation inspired by spaceship hyperspace jumps with directional motion blur, velocity scale stretch, and photonic light trail echoes.",
  tagline: "Cinematic spaceship hyperspace warp drive typography animation.",
  category: "Text",
  badges: ["New", "Cinematic Motion", "Hyperspace"],
  createdAt: "2026-10-11",
  featured: true,
  keywords: [
    "warp text",
    "hyperspace text animation",
    "sci-fi text effect",
    "directional motion blur",
    "framer motion text",
    "kinetic typography",
    "warp drive animation",
  ],
  features: [
    "Cinematic directional acceleration supporting forward, left, right, up, and down warp trajectories.",
    "Integrated motion blur, photonic glow bloom, and trailing ghost echoes.",
    "Granular splitting control by character, word, or line with preserved whitespace boundaries.",
    "Continuous velocity loop mode and interactive trigger options (mount, viewport, hover).",
    "Screen-reader accessible: single accessible text label with aria-hidden animated tokens.",
  ],
  accessibility: [
    "Includes sr-only complete text phrase so screen readers read the sentence smoothly rather than spelling out characters.",
    "Fully respects prefers-reduced-motion by replacing high-speed blur/scaling with a gentle opacity fade.",
    "Non-layout shifting transforms ensure zero Cumulative Layout Shift (CLS).",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"WARP SPEED"',
      description: "Text content to animate through hyperspace warp.",
    },
    {
      name: "direction",
      type: '"forward" | "left" | "right" | "up" | "down"',
      default: '"forward"',
      description: "Directional trajectory of the warp acceleration.",
    },
    {
      name: "speed",
      type: "number",
      default: "1",
      description: "Speed multiplier for the warp acceleration.",
    },
    {
      name: "duration",
      type: "number",
      default: "1.1",
      description: "Base animation duration in seconds.",
    },
    {
      name: "delay",
      type: "number",
      default: "0",
      description: "Delay before the animation starts in seconds.",
    },
    {
      name: "blur",
      type: "boolean",
      default: "true",
      description: "Whether to apply directional motion blur during travel.",
    },
    {
      name: "glow",
      type: "boolean",
      default: "true",
      description: "Whether to render photonic bloom and glow highlights.",
    },
    {
      name: "trail",
      type: "boolean",
      default: "true",
      description: "Whether to render velocity motion trail echoes.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "false",
      description: "Whether to cycle the warp animation continuously.",
    },
    {
      name: "trigger",
      type: '"mount" | "viewport" | "hover" | "manual"',
      default: '"mount"',
      description: "Condition that triggers the warp jump animation.",
    },
    {
      name: "split",
      type: '"character" | "word" | "line"',
      default: '"character"',
      description: "How text is partitioned for sequential stagger.",
    },
    {
      name: "glowColor",
      type: "string",
      default: '"rgba(56, 189, 248, 0.75)"',
      description: "Custom glow accent color.",
    },
  ],
  usageCode: `import { WarpText } from "@/components/ui/WarpText";

export function HeroHeadline() {
  return (
    <WarpText
      text="HYPERSPACE ACTIVE"
      direction="forward"
      speed={1.4}
      blur={true}
      glow={true}
      trail={true}
      className="text-5xl font-black text-white"
    />
  );
}`,
};
