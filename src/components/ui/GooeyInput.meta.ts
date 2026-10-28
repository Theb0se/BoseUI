import type { PulseComponentMeta } from "../../types/component";

export const GooeyInputMeta: PulseComponentMeta = {
  title: "Gooey Input",
  description:
    "Liquid search input that dynamically detaches a viscous gooey bubble containing the search icon using an SVG feColorMatrix filter.",
  tagline: "Liquid morphing search input with an SVG gooey detachment effect.",
  category: "Inputs",
  badges: ["New", "Gooey", "SVG Filter", "Spring Motion"],
  createdAt: "2026-10-23",
  featured: true,
  keywords: [
    "gooey input",
    "liquid search input",
    "svg gooey filter",
    "metaball input",
    "framer motion search",
    "spring search bar",
  ],
  features: [
    "SVG `feGaussianBlur` and `feColorMatrix` liquid viscous bridge that separates as the bar expands.",
    "Spring-driven expansion with Framer Motion shared layout animation on the search icon.",
    "Automatic input auto-focus and search text reset on collapse.",
    "Fully customizable collapsed/expanded widths, offsets, and classNames.",
    "Supports both controlled and uncontrolled search input values.",
  ],
  accessibility: [
    "Uses native `type='search'` input with `enterKeyHint='search'` for mobile virtual keyboards.",
    "Keyboard accessible trigger button with high-contrast visible focus rings.",
    "Hides decorative filter SVG with `aria-hidden='true'`.",
    "Smooth collapse on blur when the search query is empty.",
  ],
  props: [
    {
      name: "placeholder",
      type: "string",
      default: '"Type to search..."',
      description: "Placeholder text displayed inside the search input.",
    },
    {
      name: "collapsedWidth",
      type: "number",
      default: "115",
      description: "Collapsed trigger pill width in pixels.",
    },
    {
      name: "expandedWidth",
      type: "number",
      default: "200",
      description: "Expanded search input width in pixels.",
    },
    {
      name: "expandedOffset",
      type: "number",
      default: "50",
      description: "Horizontal offset in pixels to separate the detached gooey bubble.",
    },
    {
      name: "gooeyBlur",
      type: "number",
      default: "5",
      description: "Gaussian blur standard deviation for the liquid gooey SVG filter.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled value for the search query.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '""',
      description: "Initial search query in uncontrolled mode.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Callback fired whenever the search text changes.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the input expands or collapses.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Whether the input and trigger are disabled.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS class for the root wrapper.",
    },
    {
      name: "classNames",
      type: "GooeyInputClassNames",
      description: "Granular class names for root, filterWrap, buttonRow, trigger, input, and bubble.",
    },
  ],
  usageCode: `import { GooeyInput } from "@/components/ui/GooeyInput";

export function Example() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center p-8">
      <GooeyInput
        placeholder="Type to search..."
        onValueChange={(val) => console.log("Search query:", val)}
      />
    </div>
  );
}`,
};

export default GooeyInputMeta;
