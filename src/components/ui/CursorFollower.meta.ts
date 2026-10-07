import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Cursor Follower",
  description:
    "Dual-spring custom pointer stage with a high-stiffness inner core and morphing outer ring that expands into contextual HUD pills.",
  tagline: "Coupled dual-spring pointer follower with declarative HUD labels.",
  category: "Motion",
  badges: ["New", "Dual Spring", "Interactive HUD"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "cursor follower",
    "custom cursor react",
    "framer motion cursor",
    "magnetic pointer",
    "interactive hud cursor",
  ],
  features: [
    "High-stiffness inner core dot paired with a damped trailing outer ring.",
    "Declarative contextual label morphing via the data-cursor-label HTML attribute.",
    "Built-in live X/Y coordinate telemetry HUD in the stage corner.",
  ],
  accessibility: [
    "Automatically restores native OS pointer and hides custom follower rings when prefers-reduced-motion is enabled.",
    "Follower layers use pointer-events-none so underlying buttons and links remain 100% clickable.",
    "Decorative follower elements are hidden from screen readers via aria-hidden='true'.",
  ],
  props: [
    {
      name: "accentColor",
      type: "string",
      default: "undefined",
      description:
        "Optional hex or CSS color override applied to the inner core dot and trailing ring border.",
    },
    {
      name: "ringStiffness",
      type: "number",
      default: "260",
      description: "Spring stiffness of the trailing outer ring.",
    },
    {
      name: "ringDamping",
      type: "number",
      default: "22",
      description: "Spring damping of the trailing outer ring.",
    },
    {
      name: "ringSize",
      type: "number",
      default: "34",
      description: "Idle diameter in pixels of the outer ring.",
    },
    {
      name: "showCoordinates",
      type: "boolean",
      default: "true",
      description:
        "Displays a live X/Y coordinate telemetry badge in the top-right corner.",
    },
  ],
  usageCode: `import { CursorFollower } from "@/components/ui/cursor-follower";

export function Example() {
  return (
    <CursorFollower className="p-8">
      <div data-cursor-label="OPEN PROJECT ↗" className="rounded-xl border p-6">
        Hover me to morph the trailing cursor ring into a HUD pill.
      </div>
    </CursorFollower>
  );
}`,
};

export default meta;
