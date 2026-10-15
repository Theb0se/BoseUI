import type { PulseComponentMeta } from "../../types/component";

export const DatabaseConnectionHealthBadgeMeta: PulseComponentMeta = {
  title: "Database Connection Health Badge",
  description:
    "Prisma Accelerate and PlanetScale inspired database cluster health monitor with pooled connections gauge, regional ping latency, TLS 1.3 certificate status, and sanitized URI copying.",
  tagline: "Database connection pool monitor with latency ping and TLS health indicators.",
  category: "Cards",
  badges: ["New", "DevTools", "Database", "Monitoring"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "database health",
    "connection pool badge",
    "prisma accelerate",
    "planetscale status",
    "latency ping",
    "tls badge",
  ],
  features: [
    "Live connection pool capacity meter with progress bar.",
    "Interactive ping test button with real-time latency fluctuations.",
    "TLS 1.3 SSL transport security status indicator.",
    "Copy sanitized connection URI with masked credentials.",
  ],
  accessibility: [
    "High-contrast health status badges with pulsing status dots.",
    "Full semantic markup with keyboard operable buttons.",
  ],
  props: [
    {
      name: "engine",
      type: "string",
      default: '"PostgreSQL 16.4"',
      description: "Database engine and version string.",
    },
    {
      name: "clusterName",
      type: "string",
      default: '"neon-edge-primary-01"',
      description: "Database cluster identifier.",
    },
    {
      name: "activeConnections",
      type: "number",
      default: "7",
      description: "Currently open client connections.",
    },
    {
      name: "maxPoolSize",
      type: "number",
      default: "25",
      description: "Maximum pool connection limit.",
    },
  ],
  usageCode: `import { DatabaseConnectionHealthBadge } from "@/components/ui/DatabaseConnectionHealthBadge";

export function Example() {
  return (
    <DatabaseConnectionHealthBadge
      clusterName="neon-edge-primary-01"
      engine="PostgreSQL 16.4"
      baseLatencyMs={14}
    />
  );
}`,
};

export default DatabaseConnectionHealthBadgeMeta;
