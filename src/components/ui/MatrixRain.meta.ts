import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Matrix Rain",
  description:
    "Canvas 2D digital rain cascade with incandescent white leading glyphs, phosphor trail decay, and real-time character mutation across Katakana, Binary, and Hexadecimal character sets.",
  tagline: "Incandescent phosphor glyph cascades with live character mutation.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Cyberpunk", "60FPS"],
  createdAt: "2026-10-08",
  keywords: [
    "matrix rain",
    "digital rain",
    "cyberpunk background",
    "katakana stream",
    "terminal background",
    "canvas animation",
  ],
  features: [
    "Incandescent white lead glyph with bloom shadow and multi-step phosphor trail attenuation.",
    "Switchable Katakana, Binary, and Hexadecimal character pools with stochastic mid-air glyph mutation.",
    "DevicePixelRatio-aware ResizeObserver loop for razor-sharp monospace typography at any viewport size.",
  ],
  accessibility: [
    "Decorative <canvas> is marked aria-hidden='true' so screen readers bypass background glyph streams.",
    "Interactive HUD buttons provide explicit aria-label attributes and high-contrast focus rings.",
  ],
  props: [
    {
      name: "color",
      type: "string",
      default: '"#10B981"',
      description: "Primary phosphor trail color in hex format.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Vertical stream velocity multiplier.",
    },
    {
      name: "density",
      type: "number",
      default: "1.0",
      description: "Multiplier controlling active column count across the viewport.",
    },
    {
      name: "charset",
      type: '"katakana" | "binary" | "hex"',
      default: '"katakana"',
      description: "Glyph character pool rendered inside falling columns.",
    },
    {
      name: "fontSize",
      type: "number",
      default: "15",
      description: "Monospace glyph size in pixels.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground overlay content rendered above the rain canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { MatrixRain } from "@/components/ui/MatrixRain";

export function Example() {
  return (
    <MatrixRain color="#10B981" charset="katakana" speed={1.0} density={1.1}>
      <div className="flex min-h-[520px] items-center justify-center p-8">
        <div className="rounded-2xl border border-emerald-500/30 bg-black/75 p-8 text-center backdrop-blur-md">
          <h2 className="font-mono text-3xl font-bold text-white">
            NEURAL UPLINK ACTIVE
          </h2>
          <p className="mt-2 font-mono text-sm text-emerald-400">
            Encrypted telemetry stream synchronized at 60Hz
          </p>
        </div>
      </div>
    </MatrixRain>
  );
}`,
};

export default meta;
