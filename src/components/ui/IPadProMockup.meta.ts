import type { PulseComponentMeta } from "../../types/component";

export const IPadProMockupMeta: PulseComponentMeta = {
  title: "iPad Pro Mockup",
  description:
    "Apple iPad Pro hardware frame with symmetrical ultra-thin bezels, landscape/portrait spring orientation transitions, Apple Pencil magnetic strip, and 3D parallax tilt.",
  tagline: "Apple iPad Pro tablet frame with landscape/portrait mode and 3D parallax tilt.",
  category: "Mockups",
  badges: ["New", "Apple", "Device", "Tablet"],
  createdAt: "2026-10-12",
  featured: false,
  keywords: [
    "ipad mockup",
    "tablet mockup",
    "apple ipad pro",
    "device frame",
    "3d tilt",
    "tablet frame",
  ],
  features: [
    "Supports both landscape and portrait orientations with smooth layout spring transitions.",
    "Hardware-accurate Apple Pencil magnetic charging dock indicator.",
    "Realistic specular light glare overlay that follows mouse movements.",
    "Space Black and Silver aluminum finishes.",
    "Renders any React children inside the Tandem OLED screen container.",
  ],
  accessibility: [
    "Disables 3D parallax tilt when prefers-reduced-motion is enabled.",
    "Content inside the screen remains fully accessible.",
  ],
  props: [
    {
      name: "orientation",
      type: '"landscape" | "portrait"',
      default: '"landscape"',
      description: "Screen orientation.",
    },
    {
      name: "color",
      type: '"space-black" | "silver"',
      default: '"space-black"',
      description: "Chassis finish color.",
    },
    {
      name: "enableTilt",
      type: "boolean",
      default: "true",
      description: "Enable 3D cursor tilt physics.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom screen content or app UI.",
    },
  ],
  usageCode: `import { IPadProMockup } from "@/components/ui/IPadProMockup";

export function Example() {
  return (
    <IPadProMockup orientation="landscape" color="space-black">
      <div className="flex h-full items-center justify-center bg-neutral-900 text-white p-6">
        <h3 className="text-xl font-bold">Your Tablet Experience</h3>
      </div>
    </IPadProMockup>
  );
}`,
};

export default IPadProMockupMeta;
