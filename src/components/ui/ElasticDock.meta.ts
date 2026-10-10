import type { PulseComponentMeta } from "../../types/component";

export const ElasticDockMeta: PulseComponentMeta = {
  title: "Elastic Dock",
  description:
    "Physics-coupled magnification dock with continuous Euclidean pointer falloff, spring-tethered icon scaling, and roving keyboard navigation.",
  tagline: "Continuous Euclidean pointer falloff and spring-tethered magnification.",
  category: "Navigation",
  badges: ["New", "Spring Physics", "A11y Ready"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "elastic dock",
    "macos dock",
    "magnifying toolbar",
    "framer motion navigation",
    "spring dock",
  ],
  features: [
    "Continuous Euclidean pointer distance interpolation with zero React re-renders during mouse movement.",
    "Shared layoutId active indicator dot and floating HUD tooltips.",
    "Full WAI-ARIA toolbar semantics with ArrowLeft, ArrowRight, Home, and End keyboard navigation.",
  ],
  accessibility: [
    "Implements role='toolbar' with roving arrow-key focus management across all dock items.",
    "Disables continuous magnification and vertical lift when prefers-reduced-motion is active.",
    "Provides aria-label and aria-current='page' state announcements for screen readers.",
  ],
  props: [
    {
      name: "items",
      type: "ElasticDockItem[]",
      description:
        "Array of dock items containing id, label, icon node, optional badge, and click handler.",
    },
    {
      name: "baseSize",
      type: "number",
      default: "46",
      description: "Resting icon button width and height in pixels.",
    },
    {
      name: "magnifiedSize",
      type: "number",
      default: "68",
      description: "Peak magnified button dimension in pixels at zero pointer distance.",
    },
    {
      name: "distance",
      type: "number",
      default: "140",
      description: "Pointer proximity radius in pixels within which neighboring icons scale.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "320",
      description: "Hooke's Law spring stiffness coefficient for magnification interpolation.",
    },
    {
      name: "damping",
      type: "number",
      default: "22",
      description: "Spring damping coefficient controlling oscillation settling.",
    },
  
    {
      name: "defaultActiveId",
      type: "string",
      defaultValue: "undefined",
      description: "Identifier of the initially active dock item",
      required: false,
    },
    {
      name: "onSelect",
      type: "(item: ElasticDockItem) => void",
      defaultValue: "undefined",
      description: "Callback fired when a dock icon is selected",
      required: false,
    },
  ],
  usageCode: `import { ElasticDock } from "@/components/ui/elastic-dock";

export function Example() {
  return (
    <div className="flex items-center justify-center py-8">
      <ElasticDock baseSize={46} magnifiedSize={68} distance={140} />
    </div>
  );
}`,
};

export default ElasticDockMeta;
