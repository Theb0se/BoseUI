import type { PulseComponentMeta } from "../../types/component";

export const HeartBurstButtonMeta: PulseComponentMeta = {
  title: "Heart Burst Button",
  description:
    "Instagram and Twitter-style like button featuring an elastic scale-pop spring, expanding shockwave ring, radial multi-colored particle confetti sparks, and double-tap card preview.",
  tagline: "Instagram-inspired elastic heart button with radial particle confetti sparks.",
  category: "Buttons" as any,
  badges: ["Instagram", "Confetti", "Spring Physics", "Micro-interaction"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "heart burst button",
    "instagram like button",
    "twitter heart animation",
    "confetti particle burst",
    "shockwave ring",
    "double tap like",
    "elastic pop spring",
    "like counter",
  ],
  features: [
    "Elastic scale-pop spring animation on heart icon with subtle rotational tilt.",
    "Expanding shockwave outline ring that dissipates smoothly on trigger.",
    "Radial burst of 12 multi-color confetti particles with staggered trajectories and fades.",
    "Animated live number roll for like count using AnimatePresence.",
    "Interactive photo canvas supporting double-click/double-tap to burst a large floating heart.",
    "Configurable color themes (Instagram sunset, Crimson, Violet, Gold) and button sizes.",
  ],
  accessibility: [
    "Uses semantic HTML button with reactive aria-label ('Like post' / 'Unlike post').",
    "Clear visual focus ring for keyboard navigation.",
    "Gracefully handles prefers-reduced-motion without breaking functionality.",
  ],
  props: [
    {
      name: "initialLiked",
      type: "boolean",
      default: "false",
      description: "Initial liked state of the button.",
    },
    {
      name: "initialCount",
      type: "number",
      default: "1420",
      description: "Initial numerical like counter value.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      default: '"md"',
      description: "Size scale of the heart button icon and padding.",
    },
    {
      name: "theme",
      type: '"instagram" | "crimson" | "violet" | "gold"',
      default: '"instagram"',
      description: "Color palette used for the heart fill, shockwave, and confetti particles.",
    },
    {
      name: "onToggle",
      type: "(liked: boolean, count: number) => void",
      description: "Callback triggered whenever the like status changes.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS classes for the container wrapper.",
    },
  ],
  usageCode: `import { HeartBurstButton } from "@/components/ui/heart-burst-button";

export function Example() {
  return (
    <HeartBurstButton
      initialLiked={false}
      initialCount={1420}
      theme="instagram"
      onToggle={(liked, count) => console.log({ liked, count })}
    />
  );
}`,
};

export default HeartBurstButtonMeta;
