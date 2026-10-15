import type { PulseComponentMeta } from "../../types/component";

export const ServerMetricsSparkboardMeta: PulseComponentMeta = {
  title: "Server Metrics Sparkboard",
  description:
    "Grafana and Railway inspired multi-sparkline telemetry dashboard monitoring CPU, Memory, Disk I/O, and Network Egress with synchronized crosshair cursor inspection across all graphs simultaneously.",
  tagline: "Synchronized multi-sparkline server telemetry dashboard with crosshair scrubber.",
  category: "Cards",
  badges: ["New", "DevTools", "Observability", "Metrics"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "server metrics",
    "sparkboard",
    "cpu monitor",
    "grafana telemetry",
    "synchronized sparkline",
    "observability",
  ],
  features: [
    "4 synchronized sparkline graphs for CPU, Memory, Disk, and Network.",
    "Global crosshair scrub cursor updating values across all charts simultaneously.",
    "Interactive time range selectors (1h, 6h, 24h, 7d).",
    "Real-time server host and cloud region telemetry headers.",
  ],
  accessibility: [
    "High-contrast color-coded metric series.",
    "Accessible numeric labels with proper units.",
  ],
  props: [
    {
      name: "hostName",
      type: "string",
      default: '"edge-compute-node-42.iad1"',
      description: "Host server name or DNS identifier.",
    },
    {
      name: "region",
      type: "string",
      default: '"AWS us-east-1 (N. Virginia)"',
      description: "Cloud region or datacenter location.",
    },
  ],
  usageCode: `import { ServerMetricsSparkboard } from "@/components/ui/ServerMetricsSparkboard";

export function Example() {
  return (
    <ServerMetricsSparkboard
      hostName="edge-compute-node-42.iad1"
      region="AWS us-east-1 (N. Virginia)"
    />
  );
}`,
};

export default ServerMetricsSparkboardMeta;
