import type { PulseComponentMeta } from "../../types/component";

export const MacBookProMockupMeta: PulseComponentMeta = {
  title: "MacBook Pro Mockup",
  description:
    "Precision Apple MacBook Pro laptop hardware frame with a camera notch, aluminum chassis base deck, Liquid Retina XDR screen viewport, and 3D cursor parallax tilt.",
  tagline: "Apple MacBook Pro laptop frame with camera notch and 3D parallax tilt.",
  category: "Mockups",
  badges: ["New", "Apple", "Device", "Laptop"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "macbook mockup",
    "laptop mockup",
    "apple laptop",
    "macbook pro",
    "device frame",
    "3d tilt",
    "screen showcase",
  ],
  features: [
    "Hardware-accurate aluminum top lid with display notch and slim bezels.",
    "Integrated bottom keyboard deck lip and display opening indentation.",
    "Realistic specular light glare overlay that reacts to cursor position.",
    "Space Black and Silver aluminum finishes.",
    "Responsive aspect ratio (16:10) that scales cleanly on all viewport widths.",
  ],
  accessibility: [
    "Respects prefers-reduced-motion by disabling 3D rotation and specular glare shifts.",
    "Interactive children remain fully accessible and focusable.",
  ],
  props: [
    {
      name: "color",
      type: '"space-black" | "silver"',
      default: '"space-black"',
      description: "Aluminum chassis finish.",
    },
    {
      name: "enableTilt",
      type: "boolean",
      default: "true",
      description: "Enable 3D cursor parallax tilt.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom app UI, video, or screenshot.",
    },
  ],
  usageCode: `import { MacBookProMockup } from "@/components/ui/MacBookProMockup";

export function Example() {
  return (
    <MacBookProMockup color="space-black" enableTilt>
      <div className="flex h-full items-center justify-center bg-neutral-950 text-white p-8">
        <h2 className="text-2xl font-bold">Your SaaS Dashboard</h2>
      </div>
    </MacBookProMockup>
  );
}`,
};

export default MacBookProMockupMeta;
