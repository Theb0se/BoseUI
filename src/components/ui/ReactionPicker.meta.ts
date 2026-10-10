import type { PulseComponentMeta } from "../../types/component";

export const ReactionPickerMeta: PulseComponentMeta = {
  title: "Reaction Picker",
  description:
    "Slack-style floating emoji reaction bar with quick reactions, spring count bump badges, toggleable personal reaction state, hover tooltip user attributions, and an expandable full emoji picker with search.",
  tagline: "Slack-style floating emoji reaction bar with spring counts and full picker popover.",
  category: "Overlays" as any,
  badges: ["Feedback", "Reactions", "Spring Physics"],
  createdAt: "2026-10-09",
  keywords: [
    "reaction picker",
    "slack reactions",
    "emoji reactions",
    "framer motion bump",
    "chat reactions",
    "interactive feedback",
  ],
  features: [
    "Floating quick reaction bar hovering seamlessly over message containers.",
    "Spring bounce animation on numeric reaction badges when voted or unvoted.",
    "Active user state highlighting reacted badges with tinted borders and glow fills.",
    "Expandable full emoji search picker popover with category filtering.",
    "Hover tooltip attribution displaying names of reacting teammates.",
  ],
  accessibility: [
    "Each reaction button includes descriptive aria-label with emoji name and current vote count.",
    "Full keyboard navigation through the quick bar and search picker popover.",
    "Color contrast adheres strictly to WCAG AA requirements in dark and light modes.",
  ],
  props: [
    {
      name: "initialReactions",
      type: "ReactionItem[]",
      description: "Array of reaction items with emoji, count, reactedByMe state, and user list.",
    },
    {
      name: "messageText",
      type: "string",
      default: '"Just shipped the brand-new financial charts..."',
      description: "Text content of the message being reacted to.",
    },
    {
      name: "authorName",
      type: "string",
      default: '"Alexander Vance"',
      description: "Name of the message author.",
    },
    {
      name: "authorRole",
      type: "string",
      default: '"Staff Design Technologist"',
      description: "Role or title of the message author.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Whether reaction bar is rendered inline with content or in popover",
      required: false,
    },
  ],
  usageCode: `import { ReactionPicker } from "@/components/ui/ReactionPicker";

export function Example() {
  return (
    <ReactionPicker
      authorName="Sophia Nakamoto"
      authorRole="Core Protocol Engineer"
      messageText="Smart contract audit passed with 0 critical findings! 🚀"
    />
  );
}`,
};

export default ReactionPickerMeta;
