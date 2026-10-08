import type { PulseComponentMeta } from "../../types/component";

export const CarouselWithDotsMeta: PulseComponentMeta = {
  title: "Carousel with Dots",
  description:
    "Horizontally snapping card carousel with swipe gesture physics, a pill-shaped morphing dot indicator, keyboard arrow support, and circular navigation buttons.",
  tagline: "Swipeable card carousel with pill dot indicator and arrow controls.",
  category: "Cards",
  badges: ["New", "Swipe Gestures", "Pill Dots"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "carousel with dots",
    "apple card carousel",
    "swipeable slider",
    "pill page indicator",
    "framer motion carousel",
  ],
  features: [
    "Horizontal drag and swipe gestures with velocity-sensitive slide snapping.",
    "Pill-shaped frosted page indicator where the active dot smoothly expands into a capsule.",
    "Circular previous/next arrow controls plus optional autoPlay timer.",
  ],
  accessibility: [
    "Uses `role='region'` and `aria-roledescription='carousel'` with numbered slide labels.",
    "Supports `ArrowLeft` and `ArrowRight` keyboard navigation when focused.",
    "Respects `prefers-reduced-motion` for instant slide changes.",
  ],
  props: [
    {
      name: "slides",
      type: "CarouselSlide[]",
      description: "Array of slide items ({ id, eyebrow, title, description, stat }).",
    },
    {
      name: "defaultIndex",
      type: "number",
      default: "0",
      description: "Initial active slide index (0-based).",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "false",
      description: "Automatically advances slides on a timer when true.",
    },
    {
      name: "interval",
      type: "number",
      default: "4500",
      description: "Auto-play rotation interval in milliseconds.",
    },
    {
      name: "onSlideChange",
      type: "(index: number) => void",
      description: "Callback fired whenever the active slide changes.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the carousel root.",
    },
  ],
  usageCode: `import { CarouselWithDots } from "@/components/ui/carousel-with-dots";

export function Example() {
  return (
    <CarouselWithDots
      onSlideChange={(index) => console.log("Active slide:", index)}
    />
  );
}`,
};

export default CarouselWithDotsMeta;
