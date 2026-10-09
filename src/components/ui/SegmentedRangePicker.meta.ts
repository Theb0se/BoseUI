import type { PulseComponentMeta } from "../../types/component";

export const SegmentedRangePickerMeta: PulseComponentMeta = {
  title: "Segmented Range Picker",
  description:
    "Financial timeframe range selector (1D, 1W, 1M, 1Y, ALL) with a sliding pill highlight, synchronized animated chart transitions, interval resolution badge, and high/low metric cards.",
  tagline: "Financial timeframe selector with spring sliding pill and synchronized chart morphing.",
  category: "Navigation",
  badges: ["Fintech", "Timeframe Picker", "Spring Motion"],
  createdAt: "2026-10-09",
  keywords: [
    "segmented range picker",
    "financial timeframe",
    "sliding pill tabs",
    "chart range selector",
    "crypto time range",
    "framer motion segmented control",
  ],
  features: [
    "Shared layoutId sliding pill highlight with Hooke's Law spring dynamics.",
    "Synchronized chart morphing and data transition between daily, weekly, monthly, and yearly windows.",
    "Integrated range metrics displaying interval resolution, range high, range low, and volume.",
    "Seamless switching between smooth spline curve and volume histogram view.",
    "Contextual emerald/rose colorway reflecting positive or negative net return across the selected range.",
  ],
  accessibility: [
    "Operates as a standard WAI-ARIA segmented tablist with arrow key navigation.",
    "Clear visual focus rings and contrast ratios exceeding WCAG AAA standards.",
    "Respects reduced-motion preferences with crossfade fallbacks for graph transitions.",
  ],
  props: [
    {
      name: "ranges",
      type: '("1D" | "1W" | "1M" | "1Y" | "ALL")[]',
      default: '["1D", "1W", "1M", "1Y", "ALL"]',
      description: "Array of timeframe options displayed in the segmented control.",
    },
    {
      name: "defaultRange",
      type: '"1D" | "1W" | "1M" | "1Y" | "ALL"',
      default: '"1D"',
      description: "Initially active timeframe option.",
    },
    {
      name: "onRangeChange",
      type: "(range: TimeRange) => void",
      description: "Callback function fired whenever the selected timeframe changes.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { SegmentedRangePicker } from "@/components/ui/SegmentedRangePicker";

export function Example() {
  return (
    <SegmentedRangePicker
      defaultRange="1M"
      onRangeChange={(range) => console.log("Selected range:", range)}
    />
  );
}`,
};

export default SegmentedRangePickerMeta;
