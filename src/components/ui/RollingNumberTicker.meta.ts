import type { PulseComponentMeta } from "../../types/component";

export const RollingNumberTickerMeta: PulseComponentMeta = {
  title: "Rolling Number Ticker",
  description:
    "Wise and Robinhood-style vertical rolling cylinder odometer number ticker with independent digit strips, smooth Hooke's Law spring physics, customizable currency prefix, and decimal formatting.",
  tagline: "Odometric rolling number ticker with spring physics and currency formatting.",
  category: "Text" as any,
  badges: ["Fintech", "Odometer", "Spring Motion"],
  createdAt: "2026-10-09",
  keywords: [
    "number ticker",
    "rolling counter",
    "odometer",
    "robinhood counter",
    "wise ticker",
    "digit roll",
    "fintech number",
    "spring counter",
  ],
  features: [
    "Independent vertical digit drums rolling with customizable Framer Motion spring physics.",
    "Integrated currency prefix and decimal comma grouping formatting.",
    "Directional delta awareness flashing ambient emerald or rose glows on balance changes.",
    "Top and bottom cylindrical gradient mask styling for authentic mechanical odometer depth.",
    "Responsive typography with interactive step controls and randomized amount tests.",
  ],
  accessibility: [
    "Screen readers read the complete formatted numerical value via live aria announcement.",
    "Static delimiters (commas, periods, symbols) are excluded from rolling motion.",
    "Gracefully adheres to prefers-reduced-motion with instant position updates.",
  ],
  props: [
    {
      name: "value",
      type: "number",
      default: "48932.18",
      description: "Numeric balance or metric value to display in the ticker.",
    },
    {
      name: "currency",
      type: "string",
      default: '"$"',
      description: "Currency symbol prefix prepended to the number ticker.",
    },
    {
      name: "decimalPlaces",
      type: "number",
      default: "2",
      description: "Number of decimal fraction digits to preserve and render.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "260",
      description: "Spring stiffness for digit drum translation.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling digit settling oscillation.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";

export function Example() {
  return (
    <RollingNumberTicker
      value={128450.75}
      currency="$"
      decimalPlaces={2}
    />
  );
}`,
};

export default RollingNumberTickerMeta;
