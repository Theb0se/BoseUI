import type { PulseComponentMeta } from "../../types/component";

export const InteractiveGitGraphMeta: PulseComponentMeta = {
  title: "Interactive Git Graph",
  description:
    "Visual SVG Git commit tree illustrating multi-branch workflows with animated bezier curves, branch lane filtering, interactive commit nodes, and SHA copying.",
  tagline: "Visual SVG Git commit tree with multi-branch lanes and commit inspection.",
  category: "Cards",
  badges: ["New", "DevTools", "Git", "Interactive"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "git graph",
    "git tree",
    "commit graph",
    "branch visualizer",
    "developer tools",
    "svg git tree",
  ],
  features: [
    "Smooth SVG Bezier curved tracks illustrating branch splits and merges.",
    "Clickable commit nodes with pulsating selected HEAD indicator.",
    "Branch filter chips to isolate main, feature, or hotfix tracks.",
    "Integrated commit inspector with one-click SHA copying.",
    "Full responsive dark/light mode palette with accessible contrast.",
  ],
  accessibility: [
    "Keyboard accessible commit list items.",
    "Clear visual focus and active selection highlights.",
  ],
  props: [
    {
      name: "commits",
      type: "GitGraphCommit[]",
      description: "Array of commit items with sha, branch, message, author, and lane.",
    },
    {
      name: "defaultSelectedSha",
      type: "string",
      description: "Initial commit SHA selected in the tree.",
    },
    {
      name: "onSelectCommit",
      type: "(commit: GitGraphCommit) => void",
      description: "Callback when a commit node or row is clicked.",
    },
  ],
  usageCode: `import { InteractiveGitGraph } from "@/components/ui/InteractiveGitGraph";

export function Example() {
  return (
    <InteractiveGitGraph
      onSelectCommit={(commit) => console.log("Selected commit:", commit.sha)}
    />
  );
}`,
};

export default InteractiveGitGraphMeta;
