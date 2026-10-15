import type { PulseComponentMeta } from "../../types/component";

export const ContextTokenGaugeMeta: PulseComponentMeta = {
  title: "Context Token Gauge",
  description:
    "LLM context window capacity meter with radial and segmented linear bar variants, token breakdown metrics (System, Prompt, Completion), and adaptive threshold alerts.",
  tagline: "LLM context window capacity gauge with radial and linear breakdown views.",
  category: "Cards",
  badges: ["New", "AI", "Metrics", "LLM"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "context token gauge",
    "token limit",
    "llm context window",
    "token meter",
    "radial gauge",
    "ai capacity",
  ],
  features: [
    "Radial SVG arc and linear segmented bar modes.",
    "Dynamic color shifts: Optimal (<75%), High Load (75-90%), and Near Limit (>90%).",
    "Breakdown metrics for System prompt, User prompt, and Model completion tokens.",
    "Compact responsive container with high contrast dark/light theme support.",
  ],
  accessibility: [
    "Textual percentage and token metrics accessible to screen readers.",
    "Respects prefers-reduced-motion for circle transitions.",
  ],
  props: [
    {
      name: "usedTokens",
      type: "number",
      default: "42800",
      description: "Total tokens currently occupied.",
    },
    {
      name: "maxTokens",
      type: "number",
      default: "128000",
      description: "Total context window capacity limit.",
    },
    {
      name: "variant",
      type: '"radial" | "bar"',
      default: '"radial"',
      description: "Display mode between radial circular meter or linear segmented bar.",
    },
    {
      name: "modelName",
      type: "string",
      default: '"Claude 3.5 Sonnet (128k)"',
      description: "Badge text indicating the model or architecture.",
    },
    {
      name: "showBreakdown",
      type: "boolean",
      default: "true",
      description: "Show segment detail cards underneath the gauge.",
    },
  ],
  usageCode: `import { ContextTokenGauge } from "@/components/ui/ContextTokenGauge";

export function Example() {
  return (
    <ContextTokenGauge
      usedTokens={58400}
      maxTokens={128000}
      systemTokens={3200}
      promptTokens={34000}
      completionTokens={21200}
      variant="radial"
    />
  );
}`,
};

export default ContextTokenGaugeMeta;
