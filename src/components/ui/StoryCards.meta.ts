import type { PulseComponentMeta } from "../../types/component";

export const StoryCardsMeta: PulseComponentMeta = {
  title: "Story Cards",
  description:
    "Interactive looped story card showcase featuring continuous virtual looping, spring-animated expanding active slides, mouse-wheel scrub, touch gestures, and keyboard navigation.",
  tagline: "Interactive looped story carousel with spring expansions and gesture controls.",
  category: "Cards",
  badges: ["New", "Interactive", "Spring Physics", "Touch Friendly"],
  createdAt: "2026-10-23",
  featured: true,
  keywords: [
    "story cards",
    "expandable carousel",
    "loop carousel",
    "framer motion cards",
    "interactive stories",
    "touch swipe cards",
    "virtual trackpad scroll",
  ],
  features: [
    "Virtual circular index math allowing continuous, endless forward and backward looping.",
    "Spring-physics flex width interpolation allocating expanded focus to the active story.",
    "Multi-input gesture support: arrow keys, mouse wheel/trackpad horizontal scrub, and touch swipes.",
    "Accessible semantic landmarks with aria-live announcements and full keyboard controls.",
  ],
  accessibility: [
    "Uses semantic <section> with aria-label='Stories' and aria-live announcements.",
    "Provides Left/Right arrow key navigation while ignoring inputs and editable fields.",
    "Respects prefers-reduced-motion to instantly switch slides without spring oscillations.",
  ],
  props: [
    {
      name: "cards",
      type: "StoryCard[]",
      description: "Array of story items with id, title, description, image, and optional ctaLabel/href.",
    },
    {
      name: "initialIndex",
      type: "number",
      default: "0",
      description: "Starting active card index.",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "false",
      description: "Automatically cycle through stories on an interval.",
    },
    {
      name: "autoPlayInterval",
      type: "number",
      default: "5000",
      description: "Autoplay advance interval in milliseconds.",
    },
    {
      name: "showNavigation",
      type: "boolean",
      default: "true",
      description: "Render previous and next icon buttons in the header.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "true",
      description: "When true, cycling wraps seamlessly around the beginning and end.",
    },
    {
      name: "enableWheelScroll",
      type: "boolean",
      default: "true",
      description: "Allow trackpad or mouse-wheel gestures to step through cards.",
    },
    {
      name: "title",
      type: "string",
      default: "What's happening",
      description: "Section headline text.",
    },
    {
      name: "subtitle",
      type: "string",
      default: "Discover the latest stories.",
      description: "Section descriptive subtitle text.",
    },
  ],
  usageCode: `import { StoryCards } from "@/components/ui/StoryCards";

export function Example() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <StoryCards
        title="Featured Stories"
        subtitle="Swipe or scroll to explore latest releases."
        autoPlay={false}
      />
    </div>
  );
}`,
};

export default StoryCardsMeta;
