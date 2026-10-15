import type { PulseComponentMeta } from "../../types/component";

export const JsonSchemaFormValidatorMeta: PulseComponentMeta = {
  title: "JSON Schema Form Validator",
  description:
    "VSCode Problems tab and Monaco inspired split editor with real-time JSON syntax parsing, schema constraint validation diagnostics, one-click formatting/prettify, and clipboard payload copying.",
  tagline: "Split-view JSON schema editor with real-time constraint diagnostics.",
  category: "Cards",
  badges: ["New", "DevTools", "JSON", "Validation"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "json schema",
    "json validator",
    "vscode problems",
    "monaco diagnostics",
    "schema checker",
    "syntax validator",
  ],
  features: [
    "Live JSON parsing with error boundary catching.",
    "Diagnostics panel with line number and property violation markers.",
    "Prettify and format button for instant JSON indentation.",
    "One-click payload copying.",
  ],
  accessibility: [
    "High-contrast error callout boxes with clear semantic icons.",
    "Full keyboard operable textarea and action buttons.",
  ],
  props: [
    {
      name: "initialJson",
      type: "string",
      description: "Default starting JSON document text.",
    },
    {
      name: "schemaName",
      type: "string",
      default: '"UserConfigSchema.json"',
      description: "JSON Schema reference file name.",
    },
  ],
  usageCode: `import { JsonSchemaFormValidator } from "@/components/ui/JsonSchemaFormValidator";

export function Example() {
  return (
    <JsonSchemaFormValidator
      schemaName="UserConfigSchema.json"
    />
  );
}`,
};

export default JsonSchemaFormValidatorMeta;
