import type { PulseComponentMeta } from "../../types/component";

export const TestimonialsBlockMeta: PulseComponentMeta = {
  title: "Testimonials Block",
  description:
    "Customer social proof section combining an autoplaying enterprise story carousel with customer review cards, verified company badges, and interactive emoji reaction pickers.",
  tagline: "Customer review section featuring story carousels and interactive reaction pickers.",
  category: "Cards",
  badges: ["Block", "Features", "Social", "Testimonials", "Carousel", "Cards"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "testimonials block",
    "customer reviews",
    "autoplay story carousel",
    "reaction picker",
    "social proof",
    "client feedback",
    "framer motion carousel",
  ],
  features: [
    "Integrated AutoplayStoryCarousel with time-budgeted progress bars and case study highlights.",
    "Interactive ReactionPicker enabling visitors to react with emojis (🔥, 🚀, ❤️, 🎉) with live counts.",
    "Verified customer metadata, author roles, company badges, and quantitative success metrics.",
    "Tabbed quick-switcher allowing seamless browsing between different customer accounts.",
    "Responsive card container with backdrop blur, glassmorphism, and accessible color contrasts.",
  ],
  accessibility: [
    "ARIA attributes for quote elements, author semantics, and interactive tab switches.",
    "Accessible emoji labels and live reaction counter feedback.",
    "Autoplay pause support when hovering or navigating through content.",
    "Keyboard accessible tabs and reaction triggers.",
  ],
  props: [
    {
      name: "eyebrow",
      type: "string",
      default: "'SOCIAL PROOF & REVIEWS'",
      description: "Section tag displayed above the main heading.",
    },
    {
      name: "title",
      type: "string",
      default: "'Loved by High-Velocity Engineering Teams'",
      description: "Main section headline.",
    },
    {
      name: "description",
      type: "string",
      default: "'Join thousands of product creators and design engineers...'",
      description: "Supporting description copy below the headline.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { TestimonialsBlock } from "@/components/ui/TestimonialsBlock";

export function Example() {
  return (
    <TestimonialsBlock
      title="Loved by Engineering Leaders"
      eyebrow="Social Proof"
    />
  );
}`,
};
