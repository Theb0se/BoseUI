import type { PulseComponentMeta } from "../../types/component";

export const DeploymentTimelineMeta: PulseComponentMeta = {
  title: "Deployment Timeline",
  description:
    "Vercel-inspired deployment pipeline stepper with multi-phase statuses, elapsed timers, commit SHA metadata, and an interactive streaming build stdout log console.",
  tagline: "Vercel-style deployment pipeline stepper with live streaming build console.",
  category: "Motion" as any,
  badges: ["New", "Vercel Style", "Pipeline", "Streaming Logs"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "deployment timeline",
    "vercel deployment",
    "ci/cd pipeline",
    "build logs",
    "deployment stepper",
    "stdout console",
  ],
  features: [
    "Four-phase deployment workflow: Queued, Building, Assigning Domains, and Production Ready.",
    "Animated spinners, real-time elapsed timer clocks, and automated state transitions.",
    "Live simulated stdout log terminal with ANSI-styled build step outputs and auto-scroll.",
    "Interactive simulation toolbar to restart deployments, simulate failures, copy commit SHAs, and toggle log streams.",
  ],
  accessibility: [
    "Pipeline status steps provide aria-current and status badges with high contrast text.",
    "Live terminal console exposes an accessible aria-live region for screen reader progress announcements.",
    "Log viewer is scrollable and supports standard keyboard navigation.",
  ],
  props: [
    {
      name: "commitSha",
      type: "string",
      default: '"a89e4c1"',
      description: "Git commit hash associated with the pipeline run.",
    },
    {
      name: "branch",
      type: "string",
      default: '"main"',
      description: "Repository branch triggered for continuous deployment.",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "true",
      description: "Whether the deployment simulation advances through stages automatically.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DeploymentTimeline } from "@/components/ui/DeploymentTimeline";

export function Example() {
  return (
    <DeploymentTimeline
      commitSha="a89e4c1"
      branch="main"
      autoPlay={true}
    />
  );
}`,
};

export default DeploymentTimelineMeta;
