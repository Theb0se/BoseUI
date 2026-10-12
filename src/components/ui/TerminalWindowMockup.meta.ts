import type { PulseComponentMeta } from "../../types/component";

export const TerminalWindowMockupMeta: PulseComponentMeta = {
  title: "Terminal Window Mockup",
  description:
    "macOS dark terminal window frame featuring traffic light buttons, prompt symbols (❯), a blinking cursor, command output lines, and a one-click copy command button.",
  tagline: "macOS developer terminal mockup with traffic lights and copy command button.",
  category: "Mockups",
  badges: ["New", "Terminal", "Developer", "Software"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "terminal mockup",
    "cli window",
    "macos terminal",
    "code block",
    "developer mockup",
    "bash window",
  ],
  features: [
    "macOS titlebar with traffic light buttons and terminal title.",
    "Blinking cursor indicator on the active command line.",
    "Integrated one-click copy button for commands.",
    "Configurable multi-line command output.",
    "Support for custom child elements or interactive terminal shells.",
  ],
  accessibility: [
    "Accessible copy button with aria-label and confirmation state.",
    "Pre-formatted monospace text retains natural screen-reader output.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"zsh — 80×24"',
      description: "Terminal title in header.",
    },
    {
      name: "command",
      type: "string",
      default: '"npx boseui add magnetic-button"',
      description: "Terminal input command.",
    },
    {
      name: "output",
      type: "string | string[]",
      description: "Console output lines.",
    },
    {
      name: "copyable",
      type: "boolean",
      default: "true",
      description: "Enable copy command button.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom inner content.",
    },
  ],
  usageCode: `import { TerminalWindowMockup } from "@/components/ui/TerminalWindowMockup";

export function Example() {
  return (
    <TerminalWindowMockup
      command="npm run build"
      output={["Compiled successfully in 1.4s", "Ready for deployment."]}
    />
  );
}`,
};

export default TerminalWindowMockupMeta;
