import type { PulseComponentMeta } from "../../types/component";

export const ColorFinishPickerMeta: PulseComponentMeta = {
  title: "Color Finish Picker",
  description:
    "Apple-style device finish selector featuring concentric selection rings, synchronized ambient page background tinting, crossfading vector hardware graphics, and technical metallurgy specifications.",
  tagline: "Apple-inspired titanium finish selector with concentric rings and ambient tinting.",
  category: "Inputs",
  badges: ["New", "Apple Finish", "Color Swatches", "Ambient Glow"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "color finish picker",
    "apple color picker",
    "swatch selector",
    "titanium finish",
    "concentric rings",
    "ambient tint",
    "hardware selector",
  ],
  features: [
    "Concentric selection rings with smooth Apple-style scale and offset animations.",
    "Dynamic ambient page background tinting synchronized with selected finish hex.",
    "Smooth crossfading vector hardware preview across multiple view angles (rear, profile, camera).",
    "Comprehensive technical metallurgy specs panel with alloy, coating, and optical reflectance metrics.",
    "Fully keyboard accessible with ARIA selection attributes.",
  ],
  accessibility: [
    "Each color swatch acts as an accessible radio/button element with descriptive `aria-label`.",
    "Keyboard focus indicators preserve high contrast regardless of dark/light theme.",
    "Respects reduced motion preferences for smooth crossfade transitions.",
  ],
  props: [
    {
      name: "finishes",
      type: "ColorFinish[]",
      description: "Array of finish definitions including hex colors, ambient rgba, and metallurgy specs.",
    },
    {
      name: "defaultFinishId",
      type: "string",
      default: '"natural-titanium"',
      description: "Identifier of the finish selected by default on mount.",
    },
    {
      name: "onChange",
      type: "(finish: ColorFinish) => void",
      description: "Callback invoked whenever user selects a new color finish.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes applied to the root container.",
    },
  ],
  usageCode: `import { ColorFinishPicker } from "@/components/ui/ColorFinishPicker";

export function Example() {
  return (
    <ColorFinishPicker
      defaultFinishId="natural-titanium"
      onChange={(finish) => console.log("Selected finish:", finish.name)}
    />
  );
}`,
};

export default ColorFinishPickerMeta;
