import type { PulseComponentMeta } from "../../types/component";

export const PipelineDAGViewerMeta: PulseComponentMeta = {
  title: "Pipeline DAG Viewer",
  description:
    "GitHub Actions and GitLab CI inspired Directed Acyclic Graph (DAG) build pipeline visualizer with sequential and parallel stage columns, live status animations, and embedded console output inspector.",
  tagline: "Directed Acyclic Graph CI/CD build pipeline with step logs viewer.",
  category: "Cards",
  badges: ["New", "DevTools", "CI/CD", "Workflows"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "pipeline dag",
    "ci cd visualizer",
    "github actions graph",
    "workflow visualizer",
    "build pipeline",
    "dag viewer",
  ],
  features: [
    "Multi-stage columns supporting parallel job execution (e.g., Unit & E2E tests).",
    "Visual status indicators for success, running, failed, and queued stages.",
    "Interactive stage node selection revealing terminal build console output.",
    "Commit SHA and workflow run telemetry header.",
  ],
  accessibility: [
    "Keyboard accessible interactive stage buttons.",
    "High contrast status badges with clear semantic icons.",
  ],
  props: [
    {
      name: "pipelineName",
      type: "string",
      default: '"ci-cd-matrix.yml"',
      description: "Workflow definition file or pipeline title.",
    },
    {
      name: "commitSha",
      type: "string",
      default: '"main • 4b2e8c1"',
      description: "Git branch and commit reference that triggered the run.",
    },
  ],
  usageCode: `import { PipelineDAGViewer } from "@/components/ui/PipelineDAGViewer";

export function Example() {
  return (
    <PipelineDAGViewer
      pipelineName="production-deploy.yml"
      commitSha="main • 8a1f9e2"
    />
  );
}`,
};

export default PipelineDAGViewerMeta;
