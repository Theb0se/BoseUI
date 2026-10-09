import type { PulseComponentMeta } from "../../types/component";

export const StatsStripBlockMeta: PulseComponentMeta = {
  title: "Stats Strip Block",
  description:
    "High-impact metric banner section featuring rolling numbers, kinetic digit reels for 99.99% uptime guarantees, and interactive scrubbable sparkline throughput charts.",
  tagline: "High-impact metrics banner with rolling tickers, kinetic counters, and scrubbable sparklines.",
  category: "Cards",
  badges: ["Block", "Features", "Stats", "Metrics", "Sparkline", "Counters", "Cards"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "stats strip block",
    "metrics banner",
    "rolling number ticker",
    "kinetic rolling counter",
    "scrubbable sparkline",
    "kpi stats",
    "dashboard stats",
    "sla counter",
  ],
  features: [
    "RollingNumberTicker with smooth digit spin physics and dynamic step simulation controls.",
    "KineticRollingCounter displaying physical rotating digit reels for high-precision SLA telemetry.",
    "Integrated ScrubbableSparkline rendering dynamic SVG trajectories with pointer scrubbing readouts.",
    "Responsive 3-column grid structure with backdrop blur glassmorphism and subtle gradient lighting.",
    "Preset interval buttons and transaction simulator to showcase state responsiveness.",
  ],
  accessibility: [
    "Accessible numeric labels with ARIA live announcements for changing ticker values.",
    "High-contrast color scheme adhering to WCAG AAA standards for critical KPI metrics.",
    "Keyboard accessible buttons for steppers and timeframe filter switches.",
    "Spring motion respects prefers-reduced-motion OS configuration.",
  ],
  props: [
    {
      name: "eyebrow",
      type: "string",
      default: "'GLOBAL INFRASTRUCTURE TELEMETRY'",
      description: "Eyebrow tag above the stats headline.",
    },
    {
      name: "title",
      type: "string",
      default: "'Scalability Verified at Planet Scale'",
      description: "Main section headline.",
    },
    {
      name: "description",
      type: "string",
      default: "'Real-time production metrics combining continuous number tickers...'",
      description: "Supporting summary text for the metrics banner.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { StatsStripBlock } from "@/components/ui/StatsStripBlock";

export function Example() {
  return (
    <StatsStripBlock
      title="Global Scale & Reliability"
      eyebrow="Key Metrics"
    />
  );
}`,
};
