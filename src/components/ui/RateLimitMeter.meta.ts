import type { PulseComponentMeta } from "../../types/component";

export const RateLimitMeterMeta: PulseComponentMeta = {
  title: "Rate Limit Meter",
  description:
    "Token bucket and sliding-window rate limit visualizer with burst request simulation, spring-physics capacity transitions, real-time quota reset countdowns, and 429 Too Many Requests retry-after badges.",
  tagline: "Token bucket rate limit and quota capacity visualizer with burst simulation.",
  category: "Cards",
  badges: ["New", "DevTools", "API", "Network"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "rate limit meter",
    "token bucket",
    "sliding window",
    "429 too many requests",
    "api quota",
    "cloudflare rate limiting",
  ],
  features: [
    "Animated token bucket capacity bar with spring-weighted updates.",
    "Interactive single request and burst (-15) simulation triggers.",
    "Automatic sliding window replenishment timer ticking in real-time.",
    "Dynamic color shifts for Healthy (green), Warning (amber), and 429 Exceeded (red).",
  ],
  accessibility: [
    "Clear numeric percentage labels alongside progress meters.",
    "Accessible color contrast with distinct iconography for state changes.",
  ],
  props: [
    {
      name: "maxLimit",
      type: "number",
      default: "120",
      description: "Maximum number of requests permitted within the window.",
    },
    {
      name: "initialRemaining",
      type: "number",
      default: "92",
      description: "Initial available capacity tokens.",
    },
    {
      name: "windowSeconds",
      type: "number",
      default: "60",
      description: "Sliding window duration in seconds before token replenish.",
    },
    {
      name: "tierLabel",
      type: "string",
      default: '"Pro Plan (Global Edge)"',
      description: "Identifier for the active API tier or subscription plan.",
    },
  ],
  usageCode: `import { RateLimitMeter } from "@/components/ui/RateLimitMeter";

export function Example() {
  return (
    <RateLimitMeter
      maxLimit={120}
      initialRemaining={92}
      windowSeconds={60}
      tierLabel="Pro Plan (Global Edge)"
    />
  );
}`,
};

export default RateLimitMeterMeta;
