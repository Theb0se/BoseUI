import type { PulseComponentMeta } from "../../types/component";

export const AIGenerationProgressMeta: PulseComponentMeta = {
  title: "AI Generation Progress",
  description:
    "Spring-animated SVG ring progress indicator for AI token generation. Shows determinate progress with a rolling token counter, or an indeterminate spin when total is unknown.",
  tagline: "Spring-physics ring progress for AI generation with token counter.",
  category: "Motion",
  badges: ["New", "AI", "Progress"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "ai progress",
    "generation progress",
    "token counter",
    "progress ring",
    "circular progress",
    "ai spinner",
  ],
  features: [
    "Spring-animated stroke-dashoffset for smooth arc fill on progress changes.",
    "Indeterminate spinning arc when total token count is unknown.",
    "Center displays current/total tokens or percentage.",
    "Configurable size and stroke width.",
    "Accessible with role=progressbar and aria attributes.",
  ],
  accessibility: [
    "role='progressbar' with aria-valuenow, aria-valuemin, aria-valuemax.",
    "aria-label for screen reader identification.",
  ],
  props: [
    {
      name: "progress",
      type: "number",
      default: "0",
      description: "Progress 0–100. Ignored in indeterminate mode.",
    },
    {
      name: "current",
      type: "number",
      description: "Current token count shown in ring center.",
    },
    {
      name: "total",
      type: "number",
      description: "Total token count shown in ring center.",
    },
    {
      name: "indeterminate",
      type: "boolean",
      default: "false",
      description: "Spin indeterminately when total is unknown.",
    },
    {
      name: "size",
      type: "number",
      default: "96",
      description: "Ring diameter in pixels.",
    },
    {
      name: "strokeWidth",
      type: "number",
      default: "5",
      description: "Ring stroke width in pixels.",
    },
  ],
  usageCode: `import { AIGenerationProgress } from "@/components/ui/ai-generation-progress";

export function Example() {
  return (
    <div className="flex items-center gap-6">
      <AIGenerationProgress progress={65} current={325} total={500} />
      <AIGenerationProgress indeterminate />
    </div>
  );
}`,
};

export default AIGenerationProgressMeta;
