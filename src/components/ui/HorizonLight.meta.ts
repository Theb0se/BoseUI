import type { PulseComponentMeta } from "../../types/component";

export const HorizonLightMeta: PulseComponentMeta = {
  title: "Horizon Light",
  description:
    "WebGL planetary horizon limb shader with a razor-sharp incandescent core, volumetric FBM atmospheric corona, interactive solar apex tracking, and 8-bit dithered bloom.",
  tagline: "Planetary eclipse horizon & volumetric solar corona",
  category: "Backgrounds",
  badges: ["New", "WebGL", "Shader"],
  createdAt: "2026-10-08",
  keywords: [
    "horizon",
    "planet",
    "eclipse",
    "corona",
    "webgl",
    "shader",
    "glsl",
    "god rays",
    "atmosphere",
    "hero background",
  ],
  features: [
    "Signed-distance planetary sphere (SDF) creating a crisp curved horizon limb",
    "4-octave Fractional Brownian Motion (FBM) polar god-rays radiating from the solar apex",
    "Damped pointer tracking that gently shifts the solar apex along the curved arc",
    "Supports both Eclipse Dark (#0c0c0b) and Architectural Bone Light (#f4f1ea) shader surfaces",
    "High-frequency optical filmic dither to eliminate 8-bit gradient banding",
  ],
  accessibility: [
    "Respects prefers-reduced-motion by freezing temporal ray animation",
    "Canvas is marked aria-hidden so screen readers focus strictly on foreground content",
  ],
  props: [
    {
      name: "primaryColor",
      type: "string",
      default: '"#FF4D1C"',
      description: "Primary atmospheric scatter color (International Vermilion by default).",
    },
    {
      name: "secondaryColor",
      type: "string",
      default: '"#FF8A3D"',
      description: "Inner solar corona glow color.",
    },
    {
      name: "deepColor",
      type: "string",
      default: '"#6E1404"',
      description: "Outer deep atmospheric bloom color.",
    },
    {
      name: "coreColor",
      type: "string",
      default: '"#FFF3E0"',
      description: "Razor-sharp incandescent planetary limb core color.",
    },
    {
      name: "horizonHeight",
      type: "number",
      default: "0.43",
      description: "Vertical position of the planetary horizon apex (0.2 to 0.75).",
    },
    {
      name: "intensity",
      type: "number",
      default: "1.0",
      description: "Multiplier for atmospheric bloom and limb brightness.",
    },
    {
      name: "speed",
      type: "number",
      default: "1.0",
      description: "Animation speed multiplier for volumetric god-rays.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "true",
      description: "Whether pointer movement shifts the solar apex along the horizon curve.",
    },
    {
      name: "themeMode",
      type: '"dark" | "light" | "auto"',
      default: '"dark"',
      description: "Selects dark eclipse mode, warm bone light mode, or syncs with page theme.",
    },
  ],
  usageCode: `import { HorizonLight } from "@/components/ui/HorizonLight";

export default function HeroSection() {
  return (
    <HorizonLight
      primaryColor="#FF4D1C"
      secondaryColor="#FF8A3D"
      deepColor="#6E1404"
      horizonHeight={0.43}
      intensity={1.0}
      themeMode="dark"
      className="min-h-[640px]"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
          Planetary Horizon Light
        </h1>
        <p className="mt-4 max-w-lg text-zinc-300">
          Volumetric atmospheric scatter and razor-sharp incandescent limb illumination.
        </p>
      </div>
    </HorizonLight>
  );
}`,
};
