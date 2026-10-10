import type { PulseComponentMeta } from "../../types/component";

export const LiquidPillTabsMeta: PulseComponentMeta = {
  title: "Liquid Pill Tabs",
  description:
    "Segmented navigation tab bar with dual-layer spring layout projection for active and hover indicator pills and roving WAI-ARIA keyboard control.",
  tagline: "Dual-layer spring-projected active and hover pill indicators.",
  category: "Navigation",
  badges: ["New", "Shared Layout", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "liquid pill tabs",
    "animated tabs",
    "segmented control",
    "framer motion tabs",
    "sliding pill navigation",
  ],
  features: [
    "Coupled dual-layer layoutId projection separating the magnetic hover ghost pill from the active selection pill.",
    "Unique instance-scoped layout IDs via React useId so multiple tab bars on the same page never collide.",
    "Roving tabIndex and arrow-key selection following WAI-ARIA Tabs Authoring Practices.",
  ],
  accessibility: [
    "Implements role='tablist' and role='tab' with aria-selected and roving tabIndex.",
    "Supports ArrowLeft, ArrowRight, Home, and End keys to cycle and activate tabs.",
    "Instantly snaps pill indicators without motion when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "tabs",
      type: "LiquidTabItem[]",
      description:
        "Array of tab items containing id, label, and optional badge count.",
    },
    {
      name: "defaultActiveTab",
      type: "string",
      default: '"preview"',
      description: "Initial active tab ID for uncontrolled usage.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Hooke's Law spring stiffness for active pill projection.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient for active pill projection.",
    },
  
    {
      name: "activeTab",
      type: "string",
      defaultValue: "undefined",
      description: "Controlled identifier for the active tab",
      required: false,
    },
    {
      name: "onChange",
      type: "(tabId: string) => void",
      defaultValue: "undefined",
      description: "Callback fired when active tab selection changes",
      required: false,
    },
  ],
  usageCode: `import { LiquidPillTabs } from "@/components/ui/liquid-pill-tabs";

export function Example() {
  return (
    <LiquidPillTabs
      tabs={[
        { id: "preview", label: "Preview" },
        { id: "physics", label: "Spring Config", badge: "3" },
        { id: "code", label: "Source" },
      ]}
    />
  );
}`,
};

export default LiquidPillTabsMeta;
