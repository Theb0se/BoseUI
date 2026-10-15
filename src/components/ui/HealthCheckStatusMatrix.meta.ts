import type { PulseComponentMeta } from "../../types/component";

export const HealthCheckStatusMatrixMeta: PulseComponentMeta = {
  title: "Health Check Status Matrix",
  description:
    "BetterStack and Statuspage inspired service availability tracker with segmented rolling uptime day bars, multi-service breakdowns, hover incident popovers, and overall SLA metrics.",
  tagline: "Rolling 45-day uptime status matrix with interactive incident telemetry.",
  category: "Cards",
  badges: ["New", "DevTools", "Observability", "Status"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "status matrix",
    "uptime tracker",
    "health check",
    "betterstack status",
    "incident monitor",
    "sla metric",
  ],
  features: [
    "Interactive segmented rolling day bars for multiple microservices.",
    "Color-coded day indicators for operational, degraded, and downtime incidents.",
    "Hover telemetry banner revealing incident details for specific days.",
    "Prominent overall SLA percentage badge.",
  ],
  accessibility: [
    "High-contrast color indicators supplemented with text status captions.",
    "Accessible hover and keyboard interactions.",
  ],
  props: [
    {
      name: "systemName",
      type: "string",
      default: '"BoseUI Cloud Platform"',
      description: "Platform or organization name.",
    },
    {
      name: "overallUptime",
      type: "number",
      default: "99.98",
      description: "Overall system availability SLA percentage.",
    },
  ],
  usageCode: `import { HealthCheckStatusMatrix } from "@/components/ui/HealthCheckStatusMatrix";

export function Example() {
  return (
    <HealthCheckStatusMatrix
      systemName="Acme Cloud Platform"
      overallUptime={99.98}
    />
  );
}`,
};

export default HealthCheckStatusMatrixMeta;
