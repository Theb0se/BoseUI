import type { PulseComponentMeta } from "../../types/component";

export const AgentStatusBadgeMeta: PulseComponentMeta = {
  title: "Agent Status Badge",
  description:
    "Dynamic AI agent status badge featuring an interactive 4x4 dot matrix indicator with distinct micro-animations for reading docs, analyzing, debugging, and success states.",
  tagline: "Interactive AI agent status badge with a 4x4 animated kinetic dot matrix.",
  category: "Motion",
  badges: ["AI Agent", "Interactive", "Micro-Animations", "A11y Ready"],
  createdAt: "2026-10-30",
  featured: true,
  keywords: [
    "agent status badge",
    "ai agent badge",
    "dot matrix status",
    "4x4 dot grid animation",
    "ai status indicator",
    "framer motion badge",
    "reading docs analyzing debugging success",
  ],
  features: [
    "4x4 animated dot matrix with dedicated kinetic signatures for reading docs (raster scan), analyzing (radial ripple), debugging (radar locator probe), and success (checkmark draw).",
    "Cohesive color-coded themes with subtle ambient glow and micro-borders for Sky, Violet, Amber, and Emerald statuses.",
    "Smooth text morphing with Framer Motion AnimatePresence transitions when status changes.",
    "Interactive cycle mode allowing users to click or press keyboard shortcuts to toggle through states.",
    "Standalone AgentDotGrid subcomponent exportable for custom embedding anywhere in AI dashboards.",
  ],
  accessibility: [
    "Includes semantic aria-live='polite' and role='status' (or role='button' when interactive) for assistive technologies.",
    "Full keyboard navigation with Enter and Space key activation when interactive mode is enabled.",
    "Automatically respects prefers-reduced-motion by replacing continuous loops with static high-contrast dot patterns.",
  ],
  props: [
    {
      name: "status",
      type: '"reading-docs" | "analyzing" | "debugging" | "success"',
      default: '"reading-docs"',
      description: "Active AI workflow status controlling matrix animations, color theme, and text.",
    },
    {
      name: "label",
      type: "ReactNode",
      default: "undefined",
      description: "Custom label text override replacing the default status message.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Size dimensions of the badge pill and 4x4 dot matrix.",
    },
    {
      name: "variant",
      type: '"default" | "outline" | "ghost" | "glass"',
      default: '"default"',
      description: "Visual appearance style for container background and borders.",
    },
    {
      name: "glow",
      type: "boolean",
      default: "true",
      description: "Whether to project a subtle ambient glow matching the active status color.",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      description: "Whether to render the animated 4x4 dot matrix to the left of the text.",
    },
    {
      name: "interactive",
      type: "boolean",
      default: "false",
      description: "Enables click and keyboard interaction to cycle through agent statuses.",
    },
    {
      name: "onStatusChange",
      type: "(status: AgentStatus) => void",
      default: "undefined",
      description: "Callback function fired whenever the status is changed via interaction.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged into the root element.",
    },
  ],
  usageCode: `import { useState } from "react";
import { AgentStatusBadge, type AgentStatus } from "@/components/ui/agent-status-badge";

export function AgentWorkflowDemo() {
  const [status, setStatus] = useState<AgentStatus>("analyzing");

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Interactive cycling badge */}
      <AgentStatusBadge
        status={status}
        interactive
        onStatusChange={setStatus}
      />

      {/* Or display all four statuses side-by-side */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <AgentStatusBadge status="reading-docs" />
        <AgentStatusBadge status="analyzing" />
        <AgentStatusBadge status="debugging" />
        <AgentStatusBadge status="success" />
      </div>
    </div>
  );
}`,
};

export default AgentStatusBadgeMeta;
