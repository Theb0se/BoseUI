import type { PulseComponentMeta } from "../../types/component";

export const MissionControlBlockMeta: PulseComponentMeta = {
  title: "Mission Control Block",
  description:
    "A tactical telemetry command center block combining an interactive Canvas 2D DigitalRadar sweep display, security consensus status cards, and 4 high-frequency RollingNumberTicker metric odometers.",
  tagline: "Tactical mission control telemetry with digital radar scope and rolling number tickers.",
  category: "Cards",
  badges: ["Block", "Telemetry", "Radar", "Ticker", "Metrics", "Monitoring"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "mission control",
    "digital radar",
    "rolling number ticker",
    "telemetry",
    "edge monitoring",
    "tactical hud",
  ],
  features: [
    "Full-featured Canvas 2D DigitalRadar display with target blips, range rings, and sweep line.",
    "Four live RollingNumberTicker displays for global RPS, P99 latency, uptime SLA, and active nodes.",
    "Interactive traffic surge simulation button to test dynamic odometer digit transitions.",
    "Phosphor coating color picker switching between emerald, cyan, and amber radar sweeps.",
  ],
  accessibility: [
    "All telemetry stats provide screen-reader accessible text labels and numeric values.",
    "Tactical interactive controls meet the 44px+ touch target accessibility standard.",
    "High-contrast color scheme exceeding WCAG AA requirements.",
    "Canvas radar animation gracefully slows down under prefers-reduced-motion.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Autonomous Mission Control & Telemetry"',
      description: "Header title for the mission control center.",
    },
    {
      name: "tagline",
      type: "string",
      default: '"Live radar tracking of distributed edge clusters..."',
      description: "Sub-headline explaining tactical metrics.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { MissionControlBlock } from "@/components/ui/MissionControlBlock";

export function Example() {
  return (
    <MissionControlBlock
      title="Autonomous Mission Control & Telemetry"
      tagline="Live radar tracking of distributed edge clusters, anomalous traffic signatures, and real-time consensus telemetry."
    />
  );
}`,
};

export default MissionControlBlockMeta;
