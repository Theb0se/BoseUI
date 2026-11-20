import type { PulseComponentMeta } from "../../types/component";

export const NavbarMeta: PulseComponentMeta = {
  title: "Navbar",
  description:
    "Kinetic responsive navigation bar with scroll-direction sensing, shared-layout spring indicators, multi-level dropdowns, and an animated mobile drawer.",
  tagline: "Responsive kinetic navigation bar with scroll detection, spring indicators, and mobile drawer.",
  category: "Navigation",
  badges: ["New", "Shared Layout", "Responsive", "A11y Ready"],
  createdAt: "2026-11-20",
  featured: true,
  keywords: [
    "navbar",
    "navigation bar",
    "header",
    "responsive navbar",
    "floating navbar",
    "framer motion navbar",
    "mobile menu",
    "dropdown menu",
  ],
  features: [
    "Smart scroll sensing: automatically collapses or hides on downward scroll and glides back on upward scroll.",
    "Dual layoutId spring indicators: smooth hover capsule and active link indicator.",
    "Multi-level animated dropdown sub-menus with spring scale and staggered disclosure.",
    "Integrated mobile navigation drawer with animated hamburger toggle and backdrop blur.",
    "Multiple layout variants: floating island, fixed header, or frosted glass.",
    "Respects prefers-reduced-motion with instant fallback transitions.",
  ],
  accessibility: [
    "Semantic <header> and <nav aria-label='Main Navigation'> landmark markup.",
    "Full keyboard navigation with Escape key dismissal of open dropdowns and mobile menus.",
    "Supports aria-expanded, aria-haspopup, and aria-current='page' attributes.",
    "High-contrast focus-visible rings for keyboard-only navigation.",
  ],
  props: [
    {
      name: "brand",
      type: "React.ReactNode",
      description: "Custom brand slot (logo and product name).",
    },
    {
      name: "items",
      type: "NavbarItem[]",
      default: "DEFAULT_ITEMS",
      description: "Array of navigation items, sub-menus, icons, and badge tags.",
    },
    {
      name: "actions",
      type: "NavbarAction[]",
      default: "DEFAULT_ACTIONS",
      description: "Right-aligned call-to-action buttons with primary or ghost variants.",
    },
    {
      name: "variant",
      type: '"floating" | "fixed" | "glass"',
      default: '"floating"',
      description: "Visual presentation mode for the navbar container.",
    },
    {
      name: "hideOnScroll",
      type: "boolean",
      default: "true",
      description: "Whether to hide the navbar during downward scrolling.",
    },
    {
      name: "activeHref",
      type: "string",
      default: '"#features"',
      description: "Active link href identifier for styling and aria-current.",
    },
    {
      name: "onNavigate",
      type: "(href: string) => void",
      description: "Callback fired when a user selects a navigation target.",
    },
  ],
  usageCode: `import { Navbar } from "@/components/ui/Navbar";
import { Sparkles } from "lucide-react";

export function Example() {
  return (
    <Navbar
      variant="floating"
      hideOnScroll={true}
      items={[
        { label: "Features", href: "#features" },
        {
          label: "Products",
          href: "#products",
          badge: "New",
          children: [
            {
              label: "Kinetic UI",
              href: "#kinetic",
              description: "Spring-animated UI primitives.",
              icon: Sparkles,
            },
          ],
        },
        { label: "Showcase", href: "#showcase" },
        { label: "Docs", href: "#docs" },
      ]}
      actions={[
        { label: "Sign In", href: "/login", variant: "ghost" },
        { label: "Get Started", href: "/signup", variant: "primary" },
      ]}
    />
  );
}`,
};

export default NavbarMeta;
