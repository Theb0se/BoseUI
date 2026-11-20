import type { PulseComponentMeta } from "../../types/component";

export const SidebarMeta: PulseComponentMeta = {
  title: "Sidebar",
  description:
    "Collapsible kinetic navigation sidebar with spring layout expansion, active selection capsule, popout hover tooltips, and nested sub-items.",
  tagline: "Collapsible kinetic navigation sidebar with spring expansion and popout tooltips.",
  category: "Navigation",
  badges: ["New", "Spring Physics", "Collapsible", "A11y Ready"],
  createdAt: "2026-11-20",
  featured: true,
  keywords: [
    "sidebar",
    "navigation sidebar",
    "collapsible sidebar",
    "app sidebar",
    "dashboard navigation",
    "framer motion sidebar",
    "rail menu",
  ],
  features: [
    "Smooth Hooke's Law spring physics powering fluid width collapse (68px to 260px).",
    "Shared layoutId active indicator pill tracking selection changes with spring damping.",
    "Hover popout tooltips automatically enabled in collapsed icon-rail mode.",
    "Accordion-style nested submenus with spring-animated height reveal.",
    "Grouped section headings, badge counts, and user profile footer card.",
    "Full reduced-motion compatibility with instant layout snapping.",
  ],
  accessibility: [
    "Semantic <aside aria-label='Application Sidebar'> markup.",
    "Supports keyboard focus navigation with clear 2px focus-visible outlines.",
    "Exposes aria-current='page' on active selection.",
    "Accessible collapse toggle button with screen-reader friendly aria-label and state description.",
  ],
  props: [
    {
      name: "sections",
      type: "SidebarSection[]",
      default: "DEFAULT_SECTIONS",
      description: "Array of grouped navigation sections with items, icons, and badges.",
    },
    {
      name: "activeId",
      type: "string",
      default: '"dashboard"',
      description: "Identifier of the currently active navigation item.",
    },
    {
      name: "collapsed",
      type: "boolean",
      default: "false",
      description: "Controlled state determining whether the sidebar is collapsed.",
    },
    {
      name: "collapsible",
      type: "boolean",
      default: "true",
      description: "Whether the toggle button to collapse/expand the sidebar is displayed.",
    },
    {
      name: "user",
      type: "SidebarUser",
      description: "User details displayed in the bottom footer profile card.",
    },
    {
      name: "onCollapsedChange",
      type: "(collapsed: boolean) => void",
      description: "Callback fired when the user toggles the sidebar collapse state.",
    },
    {
      name: "onItemSelect",
      type: "(item: SidebarItem) => void",
      description: "Callback fired when a navigation item is clicked.",
    },
  ],
  usageCode: `import { Sidebar } from "@/components/ui/Sidebar";
import { LayoutDashboard, Layers, Settings, Users } from "lucide-react";

export function Example() {
  return (
    <div className="h-[600px] flex">
      <Sidebar
        sections={[
          {
            title: "Application",
            items: [
              { id: "dash", label: "Dashboard", href: "#dash", icon: LayoutDashboard },
              { id: "comp", label: "Components", href: "#comp", icon: Layers, badge: "106+" },
            ],
          },
          {
            title: "Settings",
            items: [
              { id: "team", label: "Team", href: "#team", icon: Users },
              { id: "pref", label: "Preferences", href: "#pref", icon: Settings },
            ],
          },
        ]}
      />
      <main className="flex-1 p-8">Content Area</main>
    </div>
  );
}`,
};

export default SidebarMeta;
