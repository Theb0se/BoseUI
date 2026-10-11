import type { PulseComponentMeta } from "../../types/component";

export const MagneticAvatarStackMeta: PulseComponentMeta = {
  title: "Magnetic Avatar Stack",
  description:
    "Overlapping user avatar stack with dynamic proximity spreading, spring lift on hover, and an animated floating tooltip.",
  tagline: "Overlapping avatar stack with proximity fan-out and spring lift.",
  category: "Cards",
  badges: ["New", "Micro-interaction", "Social UX"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "avatar stack",
    "magnetic avatars",
    "framer motion avatars",
    "user group stack",
    "tooltip avatars",
  ],
  features: [
    "Dynamic proximity spreading that gracefully fans out avatars when the stack is hovered.",
    "Spring-driven vertical elevation and scale boost on the hovered avatar.",
    "Automatic z-index adjustment preventing overlap clipping.",
    "Built-in floating tooltip with user name and role metadata.",
    "Overflow counter badge for large teams.",
  ],
  accessibility: [
    "Keyboard focusable buttons with descriptive aria-label attributes.",
    "Focus mirrors hover state to reveal tooltips for keyboard navigators.",
    "Prefe-reduced-motion compatibility.",
  ],
  props: [
    {
      name: "avatars",
      type: "AvatarItem[]",
      description: "Array of user avatar objects with name, src/fallback, and role.",
    },
    {
      name: "max",
      type: "number",
      default: "5",
      description: "Maximum avatars displayed before showing overflow badge.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Avatar circle size preset.",
    },
    {
      name: "onSelect",
      type: "(avatar: AvatarItem) => void",
      description: "Callback fired when an avatar is clicked.",
    },
  ],
  usageCode: `import { MagneticAvatarStack } from "@/components/ui/magnetic-avatar-stack";

export function Example() {
  return (
    <MagneticAvatarStack
      size="md"
      onSelect={(user) => console.log("Selected user", user)}
    />
  );
}`,
};

export default MagneticAvatarStackMeta;
