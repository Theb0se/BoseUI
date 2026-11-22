import type { PulseComponentMeta } from "../../types/component";

export const ExpandingArrowButtonMeta: PulseComponentMeta = {
  title: "Expanding Arrow Button",
  description:
    "An interactive pill button featuring a spring-expanding accent block that morphs from an idle dotted chevron into a kinetic ordered Bayer dither pattern on hover and keyboard focus.",
  tagline: "Kinetic expanding button with animated Bayer dither pattern and spring physics.",
  category: "Buttons",
  badges: ["New", "Buttons", "Dither Pattern", "Spring Physics", "A11y Ready"],
  createdAt: "2026-11-22",
  featured: true,
  keywords: [
    "expanding button",
    "arrow button",
    "dither button",
    "animated dither",
    "bayer matrix",
    "spring button",
    "motion button",
    "interactive button",
  ],
  features: [
    "Smooth layout-spring expansion from a compact 52px pill to full button width.",
    "Integrated ordered Bayer 4x4 dither pattern with seamless continuous animation.",
    "Kinetic wave columns that pulse and oscillate across the expanded surface.",
    "Smart touch handling with useHoverCapable to prevent sticky hover states on mobile.",
    "Seamless keyboard focus activation with high-contrast visible focus rings.",
    "Tactile press spring feedback (whileTap={{ scale: 0.97 }}).",
    "Automatic compliance with prefers-reduced-motion.",
  ],
  accessibility: [
    "Uses semantic HTML <button> element with full keyboard tab focus.",
    "Focus triggers the same kinetic expansion as hover, ensuring parity for keyboard users.",
    "Visible high-contrast focus rings with focus-visible.",
    "Respects prefers-reduced-motion by substituting spring physics with instantaneous transitions.",
  ],
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Text or elements displayed inside the button.",
    },
    {
      name: "accentClassName",
      type: "string",
      default: '"bg-lime-300 text-neutral-950"',
      description: "Custom classes for the expanding accent block surface.",
    },
    {
      name: "labelClassName",
      type: "string",
      description: "Custom classes for the default unexpanded label text.",
    },
    {
      name: "expandedLabelClassName",
      type: "string",
      description: "Custom classes for the label text when expanded over the dither surface.",
    },
    {
      name: "showLabelOnExpand",
      type: "boolean",
      default: "true",
      description: "Whether to render the text label over the dither pattern when expanded.",
    },
    {
      name: "ditherClassName",
      type: "string",
      description: "Custom classes for the animated dither pattern container.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "420",
      description: "Spring physics stiffness value for the pill expansion.",
    },
    {
      name: "damping",
      type: "number",
      default: "30",
      description: "Spring physics damping value for the pill expansion.",
    },
  ],
  usageCode: `import { ExpandingArrowButton } from "@/components/ui/ExpandingArrowButton";

export function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      {/* Default Lime Accent */}
      <ExpandingArrowButton>
        Explore Components
      </ExpandingArrowButton>

      {/* Custom Teal Accent */}
      <ExpandingArrowButton
        accentClassName="bg-teal-400 text-neutral-950"
      >
        Get Started Now
      </ExpandingArrowButton>
    </div>
  );
}`,
};
