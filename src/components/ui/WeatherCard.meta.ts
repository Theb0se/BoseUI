import type { PulseComponentMeta } from "../../types/component";

export const WeatherCardMeta: PulseComponentMeta = {
  title: "Weather Card",
  description:
    "Dark-themed weather card featuring interactive metric tabs, a custom Catmull-Rom smooth SVG area chart with hover cursor guides, and an 8-day forecast selector with sliding selection physics.",
  tagline:
    "Interactive dark weather card with smooth SVG area charts and sliding 8-day forecast highlights.",
  category: "Cards",
  badges: ["SVG Chart", "Framer Motion", "Weather", "A11y Ready"],
  createdAt: "2026-10-30",
  featured: true,
  keywords: [
    "weather card",
    "framer motion weather",
    "svg area chart",
    "weather forecast component",
    "react weather card",
    "catmull rom spline chart",
    "8 day forecast",
    "tailwind weather widget",
  ],
  features: [
    "Zero-dependency inline SVG area chart using Catmull-Rom monotone cubic splines with Sky-400 stroke and gradient fill.",
    "Dynamic cursor guide line and floating data tooltip tracking the nearest hourly interval with hover feedback.",
    "Animated metric tabs (Temperature, Precipitation, Wind) with sliding amber-400 layoutId indicator.",
    "Interactive 8-day forecast row with sliding frosted glass selection pill and AnimatePresence header transitions.",
    "Animated rolling temperature count-up effect supporting instantaneous °F and °C unit conversion.",
  ],
  accessibility: [
    "Accessible tab list implementation with role='tablist' and role='tab' using aria-selected attributes.",
    "Dual unit toggle with role='group' and aria-pressed attributes for assistive technologies.",
    "Honors prefers-reduced-motion by replacing path length transitions and layout slides with smooth opacity cross-fades.",
  ],
  props: [
    {
      name: "location",
      type: "string",
      default: '"San Francisco, CA"',
      description: "City and region label displayed in the header.",
    },
    {
      name: "initialUnit",
      type: '"F" | "C"',
      default: '"F"',
      description: "Initial temperature unit displayed on first mount.",
    },
    {
      name: "daily",
      type: "DailyForecast[]",
      default: "DEFAULT_DAILY_FORECAST",
      description: "Array of 8 daily forecasts containing high/low temperatures, conditions, and hourly data.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged onto the outer card container.",
    },
  ],
  usageCode: `import { WeatherCard } from "@/components/ui/weather-card";

export function WeatherDemo() {
  return (
    <div className="flex items-center justify-center p-6 bg-black min-h-[500px]">
      <WeatherCard location="San Francisco, CA" />
    </div>
  );
}`,
};

export default WeatherCardMeta;
