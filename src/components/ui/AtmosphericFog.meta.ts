import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Atmospheric Fog",
  description:
    "Volumetric drifting fog and mist banks powered by a custom WebGL domain-warped FBM shader with multi-layer parallax across a moody moonlit depth gradient.",
  tagline: "Volumetric domain-warped mist layers drifting across twilight.",
  category: "Backgrounds",
  badges: ["WebGL", "Shader", "Weather", "Atmospheric"],
  createdAt: "2026-10-08",
  keywords: [
    "fog",
    "mist",
    "clouds",
    "haze",
    "atmospheric",
    "webgl",
    "shader",
    "fbm",
    "domain warp",
  ],
  features: [
    "Real-time WebGL fragment shader using nested domain-warped Fractional Brownian Motion (FBM)",
    "Configurable multi-octave parallax mist layers moving at independent horizon speeds",
    "Subtle pointer parting displacement that gently parts the mist around the cursor",
    "Live HUD presets for Moonlit Slate, Nordic Pine, Crimson Dusk, and Golden Dawn palettes",
  ],
  accessibility: [
    "Low-frequency, smooth motion prevents visual fatigue andvestibular strain",
    "All HUD controls are keyboard accessible and non-intrusive when custom children are supplied",
  ],
  props: [
    {
      name: "density",
      type: "number",
      default: "0.7",
      description: "Controls the opacity and volumetric thickness of the mist layers.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Multiplier for horizontal drift and internal domain-warp evolution speed.",
    },
    {
      name: "fogColor",
      type: "string",
      default: '"#CBD5E1"',
      description: "Hex color for the illuminated mist banks and moonlit scattering.",
    },
    {
      name: "backgroundColor",
      type: "string",
      default: '"#090D16"',
      description: "Hex color for the deep twilight zenith sky gradient.",
    },
    {
      name: "layers",
      type: "number",
      default: "4",
      description: "Number of parallax mist banks stacked from foreground to background (1 to 6).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the WebGL fog canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { AtmosphericFog } from "@/components/ui/AtmosphericFog";

export default function AtmosphericFogDemo() {
  return (
    <AtmosphericFog
      density={0.75}
      speed={1.0}
      fogColor="#CBD5E1"
      backgroundColor="#090D16"
      layers={4}
    >
      <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Silent Valley
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          Multi-layered volumetric mist powered by domain-warped FBM noise.
        </p>
      </div>
    </AtmosphericFog>
  );
}`,
};

export default meta;
