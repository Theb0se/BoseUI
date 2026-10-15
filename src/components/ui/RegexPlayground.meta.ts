import type { PulseComponentMeta } from "../../types/component";

export const RegexPlaygroundMeta: PulseComponentMeta = {
  title: "Regex Playground",
  description:
    "Raycast and Regex101 inspired regular expression matching sandbox with flag toggles (g, i, m), presets (Email, Semver, UUID, Hex), real-time match extraction, and error syntax diagnostics.",
  tagline: "Live regular expression tester with preset patterns and flag controls.",
  category: "Cards",
  badges: ["New", "DevTools", "Utility", "Regex"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "regex playground",
    "regex tester",
    "regular expression",
    "regex101 clone",
    "pattern matching",
    "developer utilities",
  ],
  features: [
    "Interactive regular expression pattern and flag inputs.",
    "Real-time evaluation with syntax error boundary catching.",
    "Popular pattern presets for Email, UUID, Semver, and Hex Colors.",
    "Visual matched token badge list.",
  ],
  accessibility: [
    "Keyboard accessible flag toggles and textarea inputs.",
    "High-contrast match badge highlighting.",
  ],
  props: [
    {
      name: "initialPattern",
      type: "string",
      default: '"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"',
      description: "Default regular expression pattern.",
    },
    {
      name: "initialFlags",
      type: "string",
      default: '"g"',
      description: "Default RegExp execution flags.",
    },
  ],
  usageCode: `import { RegexPlayground } from "@/components/ui/RegexPlayground";

export function Example() {
  return (
    <RegexPlayground
      initialPattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
      initialFlags="g"
    />
  );
}`,
};

export default RegexPlaygroundMeta;
