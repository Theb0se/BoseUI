import type { PulseComponentMeta } from "../../types/component";

export const AIStatusBadgeMeta: PulseComponentMeta = {
  title: "AI Status Badge",
  description:
    "Live AI presence pill that communicates real-time processing state — Idle, Thinking, Generating, Done, or Error. Each state transitions with spring animation and a pulsing beacon dot.",
  tagline: "Animated AI state pill with spring transitions and beacon pulse.",
  category: "Motion",
  badges: ["New", "AI", "Badge"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "ai status",
    "ai badge",
    "status indicator",
    "live badge",
    "ai state",
    "presence badge",
  ],
  features: [
    "5 states: idle, thinking, generating, done, error — each with distinct color.",
    "AnimatePresence spring morph between label text on state change.",
    "Pulsing beacon dot for active states (thinking, generating).",
    "CSS variable colors — works in dark and light mode automatically.",
    "prefers-reduced-motion: static badge without pulse or transitions.",
  ],
  accessibility: [
    "role='status' + aria-label announces state to screen readers.",
    "Color is never the sole differentiator — label text always present.",
  ],
  props: [
    {
      name: "status",
      type: '"idle" | "thinking" | "generating" | "done" | "error"',
      description: "Current AI processing state.",
    },
  ],
  usageCode: `import { AIStatusBadge } from "@/components/ui/ai-status-badge";

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <AIStatusBadge status="idle" />
      <AIStatusBadge status="thinking" />
      <AIStatusBadge status="generating" />
      <AIStatusBadge status="done" />
      <AIStatusBadge status="error" />
    </div>
  );
}`,
};

export default AIStatusBadgeMeta;
