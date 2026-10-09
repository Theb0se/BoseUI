import type { PulseComponentMeta } from "../../types/component";

export const FeatureWalkthroughBlockMeta: PulseComponentMeta = {
  title: "Feature Walkthrough Block",
  description:
    "Developer onboarding and integration walkthrough section pairing a sticky chapter storytelling scroller with a synchronized tabbed code block stage and live interactive terminal execution.",
  tagline: "Step-by-step developer walkthrough section pairing scroll storytelling with tabbed code blocks.",
  category: "Cards",
  badges: ["Block", "Features", "Developer", "Code Block", "Tabs", "Cards"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "feature walkthrough block",
    "sticky scroll story",
    "tabbed code block",
    "developer onboarding",
    "code showcase",
    "terminal runner",
    "step by step walkthrough",
  ],
  features: [
    "Synchronized 3-step chapter progression (1: Install, 2: Configure, 3: Deploy).",
    "StickyScrollStory integration enabling continuous vertical gesture navigation through chapters.",
    "Pinned TabbedCodeBlock stage with multi-language tabs (cURL, Node.js, Python, Go) matching active chapter.",
    "Integrated terminal console runner simulating live REST API execution and response output.",
    "Live copy-to-clipboard actions and syntax token highlighting with accessible status states.",
  ],
  accessibility: [
    "Semantic section, heading, and code elements throughout the walkthrough.",
    "Full keyboard navigation between chapter steps and tab triggers.",
    "ARIA attributes for tablist, tab, and tabpanel semantics in the code viewer.",
    "High contrast ratios meeting WCAG AA requirements.",
  ],
  props: [
    {
      name: "eyebrow",
      type: "string",
      default: "'DEVELOPER WORKFLOW'",
      description: "Eyebrow badge above the main section headline.",
    },
    {
      name: "title",
      type: "string",
      default: "'Three-Step Developer Walkthrough'",
      description: "Main section headline.",
    },
    {
      name: "description",
      type: "string",
      default: "'Experience seamless integration from CLI scaffolding to production deployment...'",
      description: "Section summary paragraph.",
    },
    {
      name: "defaultChapterIndex",
      type: "number",
      default: "0",
      description: "Initial active chapter index (0 = Install, 1 = Configure, 2 = Deploy).",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { FeatureWalkthroughBlock } from "@/components/ui/FeatureWalkthroughBlock";

export function Example() {
  return (
    <FeatureWalkthroughBlock
      title="Integrate in Minutes"
      defaultChapterIndex={0}
    />
  );
}`,
};
