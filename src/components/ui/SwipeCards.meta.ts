import type { PulseComponentMeta } from "../../types/component";

export const SwipeCardsMeta: PulseComponentMeta = {
  title: "Swipe Cards",
  description:
    "Tinder-style swipeable card deck with drag physics, rotational tilt proportional to delta X, floating LIKE and NOPE stamp overlays, stack scale-up, and rewind capabilities.",
  tagline: "Tinder-inspired swipeable card deck with drag physics and stamp overlays.",
  category: "Cards",
  badges: ["Tinder", "Gestures", "Drag Physics", "Deck"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "swipe cards",
    "tinder card deck",
    "draggable cards",
    "framer motion drag",
    "rotational tilt",
    "stamp overlays",
    "rewind card",
    "card stack physics",
  ],
  features: [
    "Intuitive horizontal drag gestures with Hooke's Law spring returns and velocity discard threshold.",
    "Dynamic rotational tilt and opacity stamps ('LIKE' / 'NOPE') mapped to drag offset.",
    "Background cards dynamically scale up and lift forward as top cards are swiped away.",
    "Tactile bottom action buttons (Rewind, Nope, Super Like, Like, Boost) with spring tap feedback.",
    "Undo / Rewind stack tracking allowing users to bring back recently swiped cards.",
  ],
  accessibility: [
    "Fully operable via standalone action buttons for keyboard and assistive tech users.",
    "All action triggers include accessible ARIA labels with state feedback.",
    "Gracefully operates with reduced motion settings enabled.",
  ],
  props: [
    {
      name: "profiles",
      type: "ProfileCard[]",
      description: "Array of profile items containing bio, metadata, tags, and visuals.",
    },
    {
      name: "onSwipe",
      type: '(card: ProfileCard, direction: "like" | "nope" | "superlike") => void',
      description: "Callback invoked when a card is swiped or action button is pressed.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS classes for the container wrapper.",
    },
  ],
  usageCode: `import { SwipeCards } from "@/components/ui/swipe-cards";

export function Example() {
  return (
    <SwipeCards
      onSwipe={(card, dir) => console.log(\`Swiped \${dir} on \${card.name}\`)}
    />
  );
}`,
};

export default SwipeCardsMeta;
