import type { PulseComponentMeta } from "../../types/component";

export const DashboardShellBlockMeta: PulseComponentMeta = {
  title: "Dashboard Shell Block",
  description:
    "A full developer workspace application shell combining an interactive hierarchical FileTree sidebar, dual-mode DiffViewer code review, automated DeploymentTimeline pipeline stepper, and simulated real-time MultiplayerCursors collaboration.",
  tagline: "Developer application shell with file tree explorer, diff review, deployment pipeline, and live cursors.",
  category: "Cards",
  badges: ["Block", "Application", "Dashboard", "DevTools", "Multiplayer", "DiffViewer"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "dashboard shell",
    "developer workspace",
    "file tree",
    "deployment timeline",
    "diff viewer",
    "multiplayer cursors",
    "application shell",
  ],
  features: [
    "Hierarchical FileTree sidebar allowing interactive directory navigation and file selection.",
    "Integrated DiffViewer supporting split and unified view modes with line numbering and gutters.",
    "Automated DeploymentTimeline pipeline showing real-time build stages and commit hashes.",
    "Simulated real-time MultiplayerCursors canvas with live user tags and typing states.",
  ],
  accessibility: [
    "Complete keyboard focus navigation across sidebar file nodes and workspace tabs.",
    "Semantic ARIA regions for explorer navigation, diff viewer, and deployment status updates.",
    "High-contrast syntax highlighting compliant with WCAG AA guidelines.",
    "Multiplayer cursor animations gracefully disable under reduced motion settings.",
  ],
  props: [
    {
      name: "repoName",
      type: "string",
      default: '"boseui/quantum-core"',
      description: "Repository path rendered in the application header.",
    },
    {
      name: "branchName",
      type: "string",
      default: '"feature/kinetic-physics-v3"',
      description: "Active git branch label displayed in the toolbar.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom classes applied to the root container.",
    },
  ],
  usageCode: `import { DashboardShellBlock } from "@/components/ui/DashboardShellBlock";

export function Example() {
  return (
    <DashboardShellBlock
      repoName="boseui/quantum-core"
      branchName="main"
    />
  );
}`,
};

export default DashboardShellBlockMeta;
