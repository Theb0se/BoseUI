import type { PulseComponentMeta } from "../../types/component";

export const MegaNavbarBlockMeta: PulseComponentMeta = {
  title: "Mega Navbar Block",
  description:
    "Complete responsive navigation header block featuring a top Dynamic Island status capsule for live announcements, smooth spring-animated morphing mega dropdown menus, an expanding unified search pill trigger, and mobile drawer.",
  tagline: "Full-featured production header with morphing mega menu, search pill, and dynamic island alert.",
  category: "Navigation",
  badges: ["Block", "Features", "Navigation", "Mega Menu", "Search"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "mega navbar block",
    "morphing mega menu",
    "dynamic island toast",
    "expanding search pill",
    "header block",
    "navigation block",
    "framer motion navbar",
  ],
  features: [
    "Integrated DynamicIslandToast top announcement capsule for real-time telemetry and release alerts.",
    "MorphingMegaMenu dropdown with smooth spring geometry transitions between Products, Solutions, and Developers tabs.",
    "ExpandingSearchPill trigger with keyboard shortcut indicator for global fuzzy search.",
    "Mobile-first responsive drawer menu with clear category breakdowns and iconography.",
    "Backdrop blur glassmorphism header styling with subtle gradient mesh depth.",
  ],
  accessibility: [
    "Semantic HTML header, nav, section, and main layout structure.",
    "Full keyboard navigation and ARIA attributes for dropdowns and mobile toggles.",
    "High contrast ratios meeting WCAG AA requirements in both light and dark themes.",
    "Reduced motion support respecting user prefers-reduced-motion preferences.",
  ],
  props: [
    {
      name: "brandName",
      type: "string",
      default: "'Pulse UI'",
      description: "Name of the brand or application displayed in the header.",
    },
    {
      name: "announcementTitle",
      type: "string",
      default: "'Pulse v2.4 Engine Live'",
      description: "Headline title displayed inside the Dynamic Island notification capsule.",
    },
    {
      name: "announcementSubtitle",
      type: "string",
      default: "'14 new reactive blocks & spring physics runtime'",
      description: "Subtitle copy for expanded Dynamic Island announcement states.",
    },
    {
      name: "showIslandAlert",
      type: "boolean",
      default: "true",
      description: "Whether to render the top announcement bar with the Dynamic Island pill.",
    },
    {
      name: "onCtaClick",
      type: "() => void",
      description: "Callback function fired when user clicks the primary CTA action button.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional CSS classes to apply to the root container.",
    },
  ],
  usageCode: `import { MegaNavbarBlock } from "@/components/ui/MegaNavbarBlock";

export function Example() {
  return (
    <MegaNavbarBlock
      brandName="Pulse UI"
      announcementTitle="v2.4 Released"
      onCtaClick={() => console.log("Get started clicked")}
    />
  );
}`,
};
