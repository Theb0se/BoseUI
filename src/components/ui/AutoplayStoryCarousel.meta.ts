import type { PulseComponentMeta } from "../../types/component";

export const AutoplayStoryCarouselMeta: PulseComponentMeta = {
  title: "Autoplay Story Carousel",
  description:
    "Apple News and Instagram-style interactive story carousel featuring segmented pill progress bars, directional half-card tap navigation, hover-to-pause gestures, and fluid slide transitions.",
  tagline: "Apple News-inspired story carousel with pill progress bars and hold-to-pause.",
  category: "Cards" as any,
  badges: ["New", "Story Carousel", "Pill Progress", "Autoplay", "Apple News"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "story carousel",
    "autoplay carousel",
    "pill progress bar",
    "instagram stories",
    "apple news story",
    "hold to pause",
    "fluid transitions",
  ],
  features: [
    "Segmented pill progress bars that fill sequentially across autoplay intervals.",
    "Half-card tap navigation: left 40% returns to previous slide, right 60% advances.",
    "Pointer hold / hover-to-pause mechanism preserving elapsed progress accurately.",
    "Direction-aware Framer Motion spring slide transitions.",
    "Simulated audio sound toggle and customizable duration presets.",
  ],
  accessibility: [
    "Includes play/pause toggle button for users who need non-moving content.",
    "Aria indicators and keyboard operable slide progression dots.",
    "Respects reduced motion preferences by switching to instant crossfade transitions.",
  ],
  props: [
    {
      name: "slides",
      type: "StorySlide[]",
      description: "Array of story slide objects containing titles, badges, and metrics.",
    },
    {
      name: "duration",
      type: "number",
      default: "5000",
      description: "Display duration per story slide in milliseconds.",
    },
    {
      name: "defaultIndex",
      type: "number",
      default: "0",
      description: "Initial story slide index.",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "true",
      description: "Whether the carousel automatically progresses through stories.",
    },
    {
      name: "onSlideChange",
      type: "(index: number) => void",
      description: "Callback invoked whenever the active slide index updates.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { AutoplayStoryCarousel } from "@/components/ui/AutoplayStoryCarousel";

export function Example() {
  return (
    <AutoplayStoryCarousel
      duration={5000}
      autoPlay={true}
      onSlideChange={(index) => console.log("Current story:", index)}
    />
  );
}`,
};

export default AutoplayStoryCarouselMeta;
