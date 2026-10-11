import type { PulseComponentMeta } from "../../types/component";

export const HoldToEngageFABMeta: PulseComponentMeta = {
  title: "Hold To Engage FAB",
  description:
    "Floating action trigger with 45° spring rotational morphing and staggered satellite action pill expansion.",
  tagline: "Floating action hub with spring rotational morph and satellite pills.",
  category: "Buttons",
  badges: ["New", "Micro-interaction", "Mobile UI"],
  createdAt: "2026-10-10",
  featured: false,
  keywords: [
    "fab button",
    "floating action button",
    "speed dial",
    "satellite menu",
    "framer motion fab",
  ],
  features: [
    "Spring-damped 45° rotation on primary plus icon transitioning into an exit cross.",
    "Staggered satellite action pills orbiting into place with spring trajectories.",
    "Action confirmation checkmark transition before menu dismissal.",
    "Completely customizable icon payloads and callbacks.",
  ],
  accessibility: [
    "Semantically bound with aria-expanded status.",
    "Focusable action pills navigable via keyboard.",
    "Reduced-motion friendly delays and scales.",
  ],
  props: [
    {
      name: "icon",
      type: "React.ComponentType",
      description: "Custom trigger icon component.",
    },
    {
      name: "actions",
      type: "FABAction[]",
      description: "Array of satellite action pill definitions.",
    },
  ],
  usageCode: `import { HoldToEngageFAB } from "@/components/ui/hold-to-engage-fab";
import { Share2, Bookmark, Sparkles } from "lucide-react";

export function Example() {
  return (
    <HoldToEngageFAB
      actions={[
        { id: "share", label: "Share", icon: Share2 },
        { id: "bookmark", label: "Bookmark", icon: Bookmark },
        { id: "star", label: "Favorite", icon: Sparkles },
      ]}
    />
  );
}`,
};

export default HoldToEngageFABMeta;
