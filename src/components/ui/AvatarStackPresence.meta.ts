import type { PulseComponentMeta } from "../../types/component";

export const AvatarStackPresenceMeta: PulseComponentMeta = {
  title: "Avatar Stack Presence",
  description:
    "Slack and Figma-style overlapping user avatar stack with live online/idle/offline status indicator dots, +N overflow chip, rich member profile popover cards with timezone and quick ping, and full team drawer directory.",
  tagline: "Overlapping team avatar stack with live presence dots and rich profile hover cards.",
  category: "Overlays" as any,
  badges: ["Collaboration", "Presence", "Avatars"],
  createdAt: "2026-10-09",
  keywords: [
    "avatar stack",
    "presence indicators",
    "figma avatars",
    "slack presence",
    "overflow avatar",
    "hover card profile",
    "team stack",
  ],
  features: [
    "Overlapping negative-space avatar ring styling with crisp border knockouts.",
    "Real-time presence status dots with emerald pulsing online, amber idle, and slate offline indicators.",
    "Dynamic +N overflow chip with expandable full-directory modal.",
    "Rich profile card popovers with timezones, role titles, recent activities, and interactive pings.",
    "Quick status filter buttons and adjustable visible avatar capacity limits.",
  ],
  accessibility: [
    "Comprehensive aria-labels for each avatar announcing member name and current presence state.",
    "Full keyboard navigation into the hover card and team directory modal.",
    "Accessible focus rings and WCAG AAA compliance for avatar text contrast.",
  ],
  props: [
    {
      name: "members",
      type: "TeamMember[]",
      description: "Array of team member objects with name, role, initials, status, and timezone.",
    },
    {
      name: "maxVisible",
      type: "number",
      default: "5",
      description: "Maximum number of individual avatar rings displayed before grouping into +N.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Diameter scaling preset for the avatar stack.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { AvatarStackPresence } from "@/components/ui/AvatarStackPresence";

export function Example() {
  return (
    <AvatarStackPresence
      maxVisible={4}
      size="md"
    />
  );
}`,
};

export default AvatarStackPresenceMeta;
