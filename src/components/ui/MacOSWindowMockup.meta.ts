import type { PulseComponentMeta } from "../../types/component";

export const MacOSWindowMockupMeta: PulseComponentMeta = {
  title: "macOS Window Mockup",
  description:
    "Authentic macOS Sequoia frosted glass window frame with interactive traffic light controls (close, minimize, expand with hover symbols), centered window title, and active/inactive window states.",
  tagline: "Authentic macOS frosted window frame with interactive traffic lights.",
  category: "Mockups",
  badges: ["New", "macOS", "Window", "Software"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "macos window",
    "window mockup",
    "traffic lights",
    "apple window",
    "frosted glass",
    "desktop frame",
  ],
  features: [
    "Interactive traffic lights with hover action symbols (✕, −, ⤢).",
    "Spring minimize collapse and expand animation.",
    "Frosted glass backdrop-blur titlebar with centered title label.",
    "Active and inactive window focus styles.",
    "Fully customizable children slot for dashboards, code, or documentation.",
  ],
  accessibility: [
    "Traffic light buttons include accessible aria-label attributes.",
    "Content inside window retains natural DOM focus order.",
  ],
  props: [
    {
      name: "title",
      type: "string",
      default: '"Untitled Window"',
      description: "Window title in center of header.",
    },
    {
      name: "subtitle",
      type: "string",
      description: "Optional breadcrumb or subtitle text.",
    },
    {
      name: "frosted",
      type: "boolean",
      default: "true",
      description: "Enable backdrop-blur frosted glass vibrancy.",
    },
    {
      name: "active",
      type: "boolean",
      default: "true",
      description: "Active window focus state.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Window body content.",
    },
  ],
  usageCode: `import { MacOSWindowMockup } from "@/components/ui/MacOSWindowMockup";

export function Example() {
  return (
    <MacOSWindowMockup title="Analytics Overview" subtitle="Production">
      <div className="p-6">
        <p>Your app content goes here.</p>
      </div>
    </MacOSWindowMockup>
  );
}`,
};

export default MacOSWindowMockupMeta;
