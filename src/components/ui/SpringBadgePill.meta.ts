import type { PulseComponentMeta } from "../../types/component";

export const SpringBadgePillMeta: PulseComponentMeta = {
  title: "Spring Badge Pill",
  description:
    "Kinetic notification and status pill featuring spring count increment hops, breathing radar beacon dots, and fluid exit transitions.",
  tagline: "Kinetic status badge with spring hops and animated radar beacon.",
  category: "Buttons",
  badges: ["New", "Micro-interaction", "Status UI"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "badge pill",
    "spring badge",
    "notification counter",
    "status tag",
    "radar beacon",
  ],
  features: [
    "Spring-driven count bump animations whenever numeric values change.",
    "Integrated live radar beacon dot with pulsating radio waves.",
    "Optional interactive dismissal with spring exit scale collapse.",
    "Multiple status presets: default, success, warning, danger, and monochrome outline.",
  ],
  accessibility: [
    "Announces count changes using semantic HTML markup.",
    "Focusable dismissal button with proper aria-label.",
    "Respects prefers-reduced-motion by bypassing positional hops.",
  ],
  props: [
    {
      name: "count",
      type: "number",
      description: "Optional metric number that animates on change.",
    },
    {
      name: "label",
      type: "string",
      default: '"Updates"',
      description: "Descriptive label inside the pill.",
    },
    {
      name: "variant",
      type: '"default" | "success" | "warning" | "danger" | "outline"',
      default: '"default"',
      description: "Color theme and visual intent of the badge.",
    },
    {
      name: "pulseBeacon",
      type: "boolean",
      default: "true",
      description: "Shows radiating pulse indicator dot.",
    },
    {
      name: "dismissible",
      type: "boolean",
      default: "false",
      description: "Shows close button with spring dismiss physics.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      description: "Callback fired when the badge is dismissed.",
    },
  ],
  usageCode: `import { SpringBadgePill } from "@/components/ui/spring-badge-pill";

export function Example() {
  return (
    <SpringBadgePill
      count={4}
      label="Builds Passing"
      variant="success"
      pulseBeacon={true}
    />
  );
}`,
};

export default SpringBadgePillMeta;
