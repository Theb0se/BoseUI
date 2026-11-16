import type { PulseComponentMeta } from "../../types/component";

export const AnnouncementBannerMeta: PulseComponentMeta = {
  title: "Announcement Banner",
  description:
    "Slim, animated top banner that announces product releases, features, or offers with Snappy spring physics, smooth rotation, and collapse animations.",
  tagline: "Spring-animated dismissible announcement banner with message rotation and sticky header awareness.",
  category: "Navigation",
  badges: ["New", "Banner", "Dismissible", "Spring"],
  createdAt: "2026-11-16",
  featured: true,
  keywords: [
    "announcement-banner",
    "announcement banner",
    "top banner",
    "notification bar",
    "dismissible",
    "framer motion banner",
    "rotating messages",
    "spring physics",
  ],
  features: [
    "Snappy spring physics preset (stiffness 380, damping 24) powering enter, rotation, and collapse transitions.",
    "Zero-jump collapsing dismiss animation that smoothly slides the entire page content up.",
    "Auto-rotating message sequence that automatically pauses on hover, keyboard focus, and background tabs.",
    "SSR and hydration safe localStorage persistence with message-id invalidation.",
    "Dynamic --announcement-height CSS variable synchronization for sticky headers.",
    "Accessible keyboard navigation with visible focus rings and WCAG AA contrast across 3 color variants.",
  ],
  accessibility: [
    "Landmark semantics with role='region' and aria-label='Announcement'.",
    "Rotating text container uses aria-live='off' to prevent interrupting screen readers.",
    "Accessible dismiss button with minimum hit target, keyboard focus states, and aria-label.",
    "Full reduced-motion compatibility disabling slide animations and auto-rotation.",
  ],
  props: [
    {
      name: "messages",
      type: "AnnouncementMessage[]",
      required: true,
      description:
        "Array of announcement messages. A single item displays statically; multiple items rotate automatically.",
    },
    {
      name: "variant",
      type: '"default" | "accent" | "inverted" | "glass" | "fade" | "outline" | "highlight"',
      default: '"default"',
      description:
        "Visual style variant: subtle neutral ('default'), teal accent ('accent'), high contrast ('inverted'), frosted ('glass'), horizontal gradient ('fade'), minimal border ('outline'), or warning yellow ('highlight').",
    },
    {
      name: "dismissible",
      type: "boolean",
      default: "true",
      description: "Whether to display the close button and enable banner dismissal.",
    },
    {
      name: "storageKey",
      type: "string",
      default: '"boseui-announcement"',
      description:
        "Local storage key namespace. Dismissal tracks messages[0].id so updated announcements reappear.",
    },
    {
      name: "rotateInterval",
      type: "number",
      default: "5000",
      description:
        "Interval in milliseconds between rotating messages when multiple messages are supplied.",
    },
    {
      name: "sticky",
      type: "boolean",
      default: "false",
      description:
        "If true, pins the banner to the top of the viewport during scrolling.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description:
        "Spring stiffness coefficient matching the Snappy preset.",
    },
    {
      name: "damping",
      type: "number",
      default: "24",
      description:
        "Spring damping coefficient controlling oscillation decay matching the Snappy preset.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      default: "undefined",
      description: "Callback invoked when the user dismisses the banner.",
    },
    {
      name: "background",
      type: "React.ReactNode",
      default: "undefined",
      description:
        "Optional background element (e.g. FlickeringGrid or canvas texture).",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind classes applied to the outer container.",
    },
  ],
  usageCode: `import { AnnouncementBanner } from "@/components/ui/announcement-banner";

export function Example() {
  return (
    <AnnouncementBanner
      variant="accent"
      messages={[
        {
          id: "text-hover-lens-launch",
          badge: "New",
          text: "Text Hover Lens follows your cursor with spring physics.",
          href: "/components/text-hover-lens",
          linkLabel: "Try it",
        },
        {
          id: "boseui-catalog-update",
          badge: "Catalog",
          text: "105+ kinetic primitives engineered for tactile modern web apps.",
          href: "/components",
          linkLabel: "Explore",
        },
      ]}
    />
  );
}`,
};

export default AnnouncementBannerMeta;
