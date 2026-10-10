import type { PulseComponentMeta } from "../../types/component";

export const ScrubbableSparklineMeta: PulseComponentMeta = {
  title: "Scrubbable Sparkline",
  description:
    "Robinhood-style financial stock and cryptocurrency sparkline chart with interactive touch/mouse scrubbing, dynamic cursor crosshair, live price readout, and animated delta gains or losses.",
  tagline: "Robinhood-style financial sparkline chart with cursor scrubbing and live ticker readouts.",
  category: "Motion" as any,
  badges: ["Fintech", "Interactive Chart", "SVG Animation"],
  createdAt: "2026-10-09",
  keywords: [
    "sparkline",
    "financial chart",
    "robinhood sparkline",
    "stock chart",
    "crypto ticker",
    "scrubbable line chart",
    "svg graph",
  ],
  features: [
    "Interactive pointer and touch scrubbing with smooth cubic bezier SVG curve calculation.",
    "Dynamic delta percentage computation with conditional emerald (gain) or rose (loss) theme.",
    "Live vertical crosshair indicator with glowing cursor dot tracking the curve value.",
    "Smooth animated SVG area gradient fill with configurable glow and gridlines.",
    "Responsive SVG coordinate scaling across desktop and mobile screens.",
  ],
  accessibility: [
    "Provides tabular data fallback and aria-label readouts for screen readers.",
    "Maintains high contrast color ratios for gains (emerald) and losses (rose).",
    "Supports keyboard reset and touch dragging without trapping scroll.",
  ],
  props: [
    {
      name: "data",
      type: "SparklinePoint[]",
      description: "Array of sparkline points with time string and numeric value.",
    },
    {
      name: "title",
      type: "string",
      default: '"Bitcoin"',
      description: "Title of the asset or financial instrument.",
    },
    {
      name: "ticker",
      type: "string",
      default: '"BTC/USD"',
      description: "Ticker symbol displayed in the header badge.",
    },
    {
      name: "currency",
      type: "string",
      default: '"$"',
      description: "Currency symbol prefix for price formatting.",
    },
    {
      name: "height",
      type: "number",
      default: "240",
      description: "SVG viewport coordinate height in pixels.",
    },
    {
      name: "showGradient",
      type: "boolean",
      default: "true",
      description: "Whether to render the animated area fill gradient underneath the line.",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      description: "Whether to render horizontal reference grid lines.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  
    {
      name: "minimal",
      type: "boolean",
      defaultValue: "false",
      description: "Compact sparkline display mode hiding telemetry header and stats",
      required: false,
    },
  ],
  usageCode: `import { ScrubbableSparkline } from "@/components/ui/ScrubbableSparkline";

const btcData = [
  { time: "09:30", value: 64250 },
  { time: "11:30", value: 65120 },
  { time: "13:30", value: 64980 },
  { time: "15:30", value: 66420 },
  { time: "18:30", value: 67890 },
  { time: "20:30", value: 68340 },
];

export function Example() {
  return (
    <ScrubbableSparkline
      title="Bitcoin"
      ticker="BTC/USD"
      currency="$"
      data={btcData}
      showGradient={true}
    />
  );
}`,
};

export default ScrubbableSparklineMeta;
