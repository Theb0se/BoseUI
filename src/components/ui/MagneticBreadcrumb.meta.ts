import type { PulseComponentMeta } from "../../types/component";

export const MagneticBreadcrumbMeta: PulseComponentMeta = {
  title: "Magnetic Breadcrumb",
  description:
    "Hierarchical breadcrumb navigation trail with a spring-projected hover capsule and subtle vertical lift across path segments.",
  tagline: "Breadcrumb navigation trail with spring-projected hover capsule.",
  category: "Navigation",
  badges: ["New", "Shared Layout", "WAI-ARIA"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "magnetic breadcrumb",
    "animated breadcrumbs",
    "sliding pill breadcrumb",
    "framer motion navigation",
    "hierarchy trail ui",
  ],
  features: [
    "Shared layoutId hover pill that glides smoothly between path segments using Hooke's Law springs.",
    "Instance-scoped layout IDs via React useId for multi-instance page safety.",
    "Semantic ordered list structure with active segment switching.",
  ],
  accessibility: [
    "Wraps an ordered list (<ol>) inside a <nav aria-label='Breadcrumb'> landmark.",
    "Marks the active path segment with aria-current='page' and separators with aria-hidden='true'.",
    "Disables vertical lift and pill glide animations when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "items",
      type: "BreadcrumbSegment[]",
      description: "Ordered array of breadcrumb path segments with id and label.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "380",
      description: "Hooke's Law spring stiffness for the sliding hover capsule.",
    },
    {
      name: "damping",
      type: "number",
      default: "26",
      description: "Spring damping coefficient controlling capsule oscillation.",
    },
  ],
  usageCode: `import { MagneticBreadcrumb } from "@/components/ui/magnetic-breadcrumb";

export function Example() {
  return (
    <MagneticBreadcrumb stiffness={380} damping={26} />
  );
}`,
};

export default MagneticBreadcrumbMeta;
