import type { PulseComponentMeta } from "../../types/component";

export const StickyScrollStoryMeta: PulseComponentMeta = {
  title: "Sticky Scroll Storytelling",
  description:
    "Pinned split-screen storytelling layout where scrolling through text chapters on the left animates the sticky media stage on the right in real time.",
  tagline: "Pinned storytelling layout with synced media transitions.",
  category: "Cards",
  badges: ["New", "Scroll Sync", "Storytelling"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "sticky scroll storytelling",
    "pinned scroll section",
    "scrollytelling",
    "apple scroll animation",
    "synced media scroll",
  ],
  features: [
    "Split layout with scrollable narrative chapters on the left and a sticky media card on the right.",
    "Automatically tracks scroll position and syncs the active chapter with spring transitions.",
    "Clickable chapter blocks and top progress dots for instant keyboard/pointer navigation.",
  ],
  accessibility: [
    "Includes clickable chapter indicators with descriptive aria-labels for non-scroll navigation.",
    "Maintains high-contrast focus and active states on the current narrative step.",
    "Respects prefers-reduced-motion for media card transitions.",
  ],
  props: [
    {
      name: "sections",
      type: "StorySection[]",
      description: "Array of chapters ({ id, badge, title, description, metricLabel, metricValue }).",
    },
    {
      name: "heading",
      type: "string",
      default: '"Scroll inside the container or click any chapter"',
      description: "Helper text displayed in the top bar of the storytelling container.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer wrapper.",
    },
  ],
  usageCode: `import { StickyScrollStory } from "@/components/ui/sticky-scroll-story";

export function Example() {
  return <StickyScrollStory />;
}`,
};

export default StickyScrollStoryMeta;
