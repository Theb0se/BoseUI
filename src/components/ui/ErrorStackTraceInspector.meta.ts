import type { PulseComponentMeta } from "../../types/component";

export const ErrorStackTraceInspectorMeta: PulseComponentMeta = {
  title: "Error Stack Trace Inspector",
  description:
    "Sentry and Bugsnag inspired error breakdown card with project vs vendor code frame filtering, inline source code context with error squiggles, and copy markdown issue formatting.",
  tagline: "Collapsible error stack trace inspector with source code context.",
  category: "Cards",
  badges: ["New", "DevTools", "Observability", "Debugging"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "error stack trace",
    "sentry inspector",
    "exception frame",
    "bugsnag card",
    "error context",
    "debugging tool",
  ],
  features: [
    "Collapsible stack frames with file path, line, and function symbols.",
    "Toggle between in-app project code and external vendor dependencies.",
    "Inline code context viewer showing surrounding lines and error indicators.",
    "Quick actions to mark resolved and export formatted Markdown.",
  ],
  accessibility: [
    "Clear visual error cues and accessible button interactions.",
    "Accessible focus outlines on expandable frame buttons.",
  ],
  props: [
    {
      name: "errorType",
      type: "string",
      default: '"TypeError"',
      description: "Class name of the runtime exception.",
    },
    {
      name: "errorMessage",
      type: "string",
      default: '"Cannot read properties of undefined (reading \'permissions\')"',
      description: "Error message text.",
    },
    {
      name: "eventId",
      type: "string",
      default: '"evt_91b8a7c29e"',
      description: "Unique telemetry event identifier.",
    },
  ],
  usageCode: `import { ErrorStackTraceInspector } from "@/components/ui/ErrorStackTraceInspector";

export function Example() {
  return (
    <ErrorStackTraceInspector
      errorType="TypeError"
      errorMessage="Cannot read properties of undefined (reading 'permissions')"
      eventId="evt_91b8a7c29e"
    />
  );
}`,
};

export default ErrorStackTraceInspectorMeta;
