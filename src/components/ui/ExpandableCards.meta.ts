import type { PulseComponentMeta } from "../../types/component";

export const ExpandableCardsMeta: PulseComponentMeta = {
  title: "Expandable Cards",
  description:
    "Interactive horizontal accordion showcase cards highlighting UI library features and architectural pillars with spring flex-grow expansions, gradient backdrops, and animated quotes.",
  tagline: "Horizontal accordion UI feature showcase with spring flex expansions.",
  category: "Cards",
  badges: ["New", "Interactive", "Spring Physics", "Accordion"],
  createdAt: "2026-10-28",
  featured: true,
  keywords: [
    "expandable cards",
    "story cards",
    "horizontal accordion",
    "ui library showcase",
    "feature showcase cards",
    "framer motion cards",
    "interactive cards",
    "flex grow cards",
  ],
  features: [
    "Spring-driven flex-grow animation smoothly expanding the active card while compacting siblings.",
    "Responsive layout: transitions gracefully from a horizontal accordion on desktop to a vertical stack on mobile.",
    "Fully dynamic prop API: logos, brand gradients, quotes, titles, and actions are passed directly as props.",
    "Accessible keyboard navigation with tab focus, Enter/Space expansion, and reduced motion fallbacks.",
  ],
  accessibility: [
    "Each card implements role='button', tabIndex={0}, and dynamic aria-expanded state.",
    "Keyboard activation supported via Enter and Space keys.",
    "Respects prefers-reduced-motion to switch states instantly without spring oscillations.",
  ],
  props: [
    {
      name: "stories",
      type: "ExpandableCardItem[]",
      description: "Array of card items containing id, name, tagline, quote, author, role, initials, href, ctaText, bg, border, and logo (ReactNode or Component).",
    },
    {
      name: "items",
      type: "ExpandableCardItem[]",
      description: "Alternative alias prop for stories.",
    },
    {
      name: "defaultActiveId",
      type: "number | string",
      default: "1",
      description: "ID of the card that should be expanded by default on initial render.",
    },
    {
      name: "title",
      type: "React.ReactNode",
      description: "Custom headline element rendered at the top left of the section.",
    },
    {
      name: "subtitle",
      type: "React.ReactNode",
      description: "Descriptive eyebrow subtitle text rendered above the main headline.",
    },
    {
      name: "headerAction",
      type: "React.ReactNode",
      description: "Custom top-right element or link to override the default explore action.",
    },
    {
      name: "moreStoriesText",
      type: "string",
      description: "Label for the link in the header linking to the component catalog.",
    },
    {
      name: "moreStoriesHref",
      type: "string",
      description: "Destination URL for the header action.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional Tailwind CSS class overrides applied to the outer section container.",
    },
  ],
  usageCode: `import { ExpandableCards, type ExpandableCardItem } from "@/components/ui/ExpandableCards";
import { Sparkles, Terminal, Shield, Zap } from "lucide-react";

const customStories: ExpandableCardItem[] = [
  {
    id: 1,
    name: "Kinetic Physics",
    tagline: "Spring-mass-damping equations tuned for real-time 120Hz tactility.",
    logo: <Sparkles className="h-7 w-7 text-white" />,
    quote: [
      "Motion in BoseUI isn't a cosmetic afterthought — it's tactile communication.",
      "Every interaction preserves physical velocity and momentum.",
    ],
    author: "Alex Rivera",
    role: "Design Technologist",
    href: "/components/kinetic-slider",
    bg: "bg-gradient-to-b from-rose-500 via-pink-600 to-orange-500",
  },
  {
    id: 2,
    name: "Source Ownership",
    tagline: "Clean TypeScript and Tailwind CSS living directly in your repository.",
    logo: <Terminal className="h-7 w-7 text-white" />,
    quote: [
      "No mysterious node_modules dependencies or locked-in runtimes.",
      "Run one CLI command, own the raw code directly.",
    ],
    author: "Elena Vance",
    role: "Design Systems Architect",
    href: "/docs",
    bg: "bg-gradient-to-b from-[#0e1726] to-[#050914]",
  },
];

export function Example() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ExpandableCards
        stories={customStories}
        title="Custom Design Architecture"
        subtitle="Feature Pillars"
      />
    </div>
  );
}`,
};
