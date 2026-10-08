import type { PulseComponentMeta } from "../../types/component";

export const PickerWheelMeta: PulseComponentMeta = {
  title: "Picker Wheel",
  description:
    "iOS-inspired 3D cylindrical scrolling drum picker for dates, times, and custom option columns with wheel, drag, and click-to-snap physics.",
  tagline: "iOS-style 3D scrolling wheel for date, time, and options.",
  category: "Inputs",
  badges: ["New", "iOS Drum Wheel", "3D Perspective"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "picker wheel",
    "ios date picker",
    "time picker wheel",
    "drum roll picker",
    "scroll wheel selector",
  ],
  features: [
    "3D cylindrical `rotateX` perspective transforms with top and bottom fade masks.",
    "Supports mouse wheel scrolling, vertical touch/pointer drag, and direct click-to-snap.",
    "Configurable multi-column architecture for date, time, or custom option lists.",
  ],
  accessibility: [
    "Each column exposes `role='listbox'` with `ArrowUp` and `ArrowDown` keyboard support.",
    "Individual items use `role='option'` and `aria-selected`.",
    "Disables 3D `rotateX` tilt when `prefers-reduced-motion` is enabled.",
  ],
  props: [
    {
      name: "columns",
      type: "PickerColumn[]",
      description: "Array of wheel columns ({ id, label, options, defaultIndex }).",
    },
    {
      name: "onChange",
      type: "(selectedValues: Record<string, string>) => void",
      description: "Callback fired with a map of column IDs to selected option strings.",
    },
    {
      name: "title",
      type: "string",
      default: '"Schedule Deployment"',
      description: "Header label displayed above the wheel.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the outer card.",
    },
  ],
  usageCode: `import { PickerWheel } from "@/components/ui/picker-wheel";

export function Example() {
  return (
    <PickerWheel
      title="Schedule Deployment"
      onChange={(values) => console.log("Selected:", values)}
    />
  );
}`,
};

export default PickerWheelMeta;
