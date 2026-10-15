import type { PulseComponentMeta } from "../../types/component";

export const LiveLogStreamerMeta: PulseComponentMeta = {
  title: "Live Log Streamer",
  description:
    "Datadog and Cloudflare Workers inspired streaming terminal log viewer with log level filters (INFO, WARN, ERROR, DEBUG), auto-scroll lock, live pause/resume stream, search filtering, and copy logs.",
  tagline: "Real-time streaming console log viewer with level filtering and search.",
  category: "Cards",
  badges: ["New", "DevTools", "Logging", "Observability"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "log streamer",
    "terminal logs",
    "datadog console",
    "live tailing",
    "cloud log viewer",
    "observability",
  ],
  features: [
    "Live event stream with simulated real-time logs.",
    "Log level toggle buttons for INFO, WARN, ERROR, and DEBUG.",
    "Instant text filter across log messages and system sources.",
    "Auto-scroll lock with pause and resume controls.",
  ],
  accessibility: [
    "Monospace high-contrast developer theme with distinct semantic color badges.",
    "Keyboard accessible controls and clipboard copy.",
  ],
  props: [
    {
      name: "serviceName",
      type: "string",
      default: '"edge-compute-gateway"',
      description: "Identifier for the service emitting logs.",
    },
    {
      name: "maxBuffer",
      type: "number",
      default: "100",
      description: "Maximum logs preserved in memory buffer before eviction.",
    },
  ],
  usageCode: `import { LiveLogStreamer } from "@/components/ui/LiveLogStreamer";

export function Example() {
  return (
    <LiveLogStreamer
      serviceName="edge-compute-gateway"
      maxBuffer={100}
    />
  );
}`,
};

export default LiveLogStreamerMeta;
