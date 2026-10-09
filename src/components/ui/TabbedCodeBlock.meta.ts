import type { PulseComponentMeta } from "../../types/component";

export const TabbedCodeBlockMeta: PulseComponentMeta = {
  title: "Tabbed Code Block",
  description:
    "Multi-language developer code block featuring smooth sliding active tab underlines, syntax-token highlighting, line numbering, one-click copy, and an interactive simulated terminal runner.",
  tagline: "Multi-language developer code block with sliding tab underlines and terminal console runner.",
  category: "Cards" as any,
  badges: ["Stripe", "Code Block", "Developer UI", "Terminal", "Tabs"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "tabbed code block",
    "stripe code block",
    "developer docs code block",
    "framer motion tabs",
    "syntax highlight",
    "terminal output",
    "code snippet",
  ],
  features: [
    "Multi-language tabs (cURL, Node.js, Python, Go) with spring layout sliding indicator.",
    "Granular token-based syntax coloring without hefty runtime parsing dependencies.",
    "Configurable line numbering and emphasized line highlight callouts.",
    "One-click copy to clipboard with responsive checkmark confirmation.",
    "Integrated collapsible live terminal console simulating real HTTP 200 JSON API responses.",
  ],
  accessibility: [
    "Built with ARIA tablist, tab, and tabpanel semantic roles.",
    "Accessible clipboard feedback with screen-reader friendly status transitions.",
    "High-contrast color scheme adhering to WCAG AAA developer terminal guidelines.",
  ],
  props: [
    {
      name: "defaultLang",
      type: "string",
      default: "'node'",
      description: "Default active programming language tab ('curl', 'node', 'python', 'go').",
    },
    {
      name: "showLineNumbers",
      type: "boolean",
      default: "true",
      description: "Whether to display line numbers alongside the code tokens.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { TabbedCodeBlock } from "@/components/ui/TabbedCodeBlock";

export function Example() {
  return (
    <div className="w-full">
      <TabbedCodeBlock defaultLang="node" showLineNumbers={true} />
    </div>
  );
}`,
};

export default TabbedCodeBlockMeta;
