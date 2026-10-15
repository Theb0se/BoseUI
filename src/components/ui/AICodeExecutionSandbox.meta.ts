import type { PulseComponentMeta } from "../../types/component";

export const AICodeExecutionSandboxMeta: PulseComponentMeta = {
  title: "AI Code Execution Sandbox",
  description:
    "Interactive code execution terminal for AI-generated code with Code and Console Output tabs, real-time stdout streaming, execution time telemetry, and run/copy controls.",
  tagline: "Interactive terminal execution sandbox for running AI-generated code.",
  category: "Cards",
  badges: ["New", "AI", "Terminal", "Code"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai code runner",
    "code execution sandbox",
    "ai terminal",
    "stdout stream",
    "code output",
    "developer ai",
  ],
  features: [
    "Dual-tab interface: Code editor view with line numbers and Console Output.",
    "Animated line-by-line typewriter output streaming on execution.",
    "Real-time execution telemetry badge (e.g. 'Exit 0 (142ms)').",
    "One-click source code copy to clipboard.",
    "Architectural dark monochrome aesthetics with zero heavy dependencies.",
  ],
  accessibility: [
    "Tabs accessible with keyboard navigation.",
    "Monospace font sizing with WCAG compliant text contrast.",
  ],
  props: [
    {
      name: "code",
      type: "string",
      description: "Source code to display in the Code tab.",
    },
    {
      name: "language",
      type: "string",
      default: '"typescript"',
      description: "Programming language identifier.",
    },
    {
      name: "output",
      type: "string[]",
      description: "Array of output terminal stream lines.",
    },
    {
      name: "executionTimeMs",
      type: "number",
      default: "142",
      description: "Reported execution duration in milliseconds.",
    },
    {
      name: "onRun",
      type: "() => void",
      description: "Callback invoked when user presses Run Code.",
    },
  ],
  usageCode: `import { AICodeExecutionSandbox } from "@/components/ui/AICodeExecutionSandbox";

export function Example() {
  return (
    <AICodeExecutionSandbox
      language="typescript"
      executionTimeMs={120}
      onRun={() => console.log("Executing...")}
    />
  );
}`,
};

export default AICodeExecutionSandboxMeta;
