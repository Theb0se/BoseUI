import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Thunderstorm",
  description:
    "Dramatic thunderstorm background featuring recursive midpoint-displacement branching lightning bolts, dark rolling cloud banks, and wind-driven rain streaks on Canvas 2D.",
  tagline: "Branching fractal lightning bolts with storm cloud illumination.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Weather", "Interactive", "Procedural"],
  createdAt: "2026-10-08",
  keywords: [
    "thunderstorm",
    "lightning",
    "rain",
    "weather",
    "storm",
    "clouds",
    "fractal",
    "canvas",
  ],
  features: [
    "Recursive midpoint-displacement lightning generator with secondary forks and multi-pass plasma bloom",
    "Dynamic cloud deck and atmospheric screen exposure flash on every strike",
    "Depth-sorted wind-driven rain streaks with adjustable angle and density",
    "Click-to-strike sky interaction plus manual Trigger Strike HUD button",
  ],
  accessibility: [
    "Adjustable flashIntensity prop allows toning down screen exposure flashes for photosensitive users",
    "Interactive Trigger Strike button and range controls are keyboard accessible",
  ],
  props: [
    {
      name: "rainIntensity",
      type: "number",
      default: "180",
      description: "Number of wind-driven rain streaks rendered across the scene.",
    },
    {
      name: "lightningFrequency",
      type: "number",
      default: "0.35",
      description: "Rate of automatic procedural lightning strikes (0 = manual only, 1 = frequent).",
    },
    {
      name: "windAngle",
      type: "number",
      default: "14",
      description: "Wind tilt angle in degrees (-30 to 30) affecting rain streaks and cloud drift.",
    },
    {
      name: "boltColor",
      type: "string",
      default: '"#E0F2FE"',
      description: "Hex color for the lightning plasma bloom and cloud deck illumination.",
    },
    {
      name: "flashIntensity",
      type: "number",
      default: "0.6",
      description: "Intensity of the screen and cloud illumination flash during a strike (0 to 1).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the storm canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { Thunderstorm } from "@/components/ui/Thunderstorm";

export default function ThunderstormDemo() {
  return (
    <Thunderstorm
      rainIntensity={180}
      lightningFrequency={0.35}
      windAngle={14}
      boltColor="#E0F2FE"
      flashIntensity={0.6}
    >
      <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Electric Horizon
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          Procedural fractal lightning and wind-driven rain powered by Canvas 2D.
        </p>
      </div>
    </Thunderstorm>
  );
}`,
};

export default meta;
