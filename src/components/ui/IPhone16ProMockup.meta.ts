import type { PulseComponentMeta } from "../../types/component";

export const IPhone16ProMockupMeta: PulseComponentMeta = {
  title: "iPhone 16 Pro Mockup",
  description:
    "Architectural Apple iPhone 16 Pro hardware frame with an interactive spring-expanding Dynamic Island, 3D cursor parallax tilt, specular glass reflection, and titanium chassis finishes.",
  tagline: "Apple iPhone 16 Pro mockup with interactive Dynamic Island and 3D parallax tilt.",
  category: "Mockups",
  badges: ["New", "Apple", "Device", "Interactive"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "iphone mockup",
    "apple mockup",
    "iphone 16 pro",
    "dynamic island",
    "device frame",
    "3d tilt",
    "mobile mockup",
  ],
  features: [
    "Interactive Dynamic Island that fluidly morphs with spring physics on click.",
    "Hardware-accurate titanium bezels, action button, and volume rocker.",
    "Realistic specular light glare overlay that tracks cursor coordinates.",
    "4 titanium finishes: Natural, Desert, Black, and White Titanium.",
    "Accepts any React children (images, video, or interactive app UI).",
  ],
  accessibility: [
    "Gracefully respects prefers-reduced-motion by disabling 3D rotation and glare movement.",
    "Internal screen supports accessible screen reader markup.",
  ],
  props: [
    {
      name: "color",
      type: '"natural" | "desert" | "black" | "white"',
      default: '"natural"',
      description: "Titanium chassis finish.",
    },
    {
      name: "enableTilt",
      type: "boolean",
      default: "true",
      description: "Enable 3D cursor tilt physics.",
    },
    {
      name: "interactiveIsland",
      type: "boolean",
      default: "true",
      description: "Allow clicking the Dynamic Island to expand into a Live Activity.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Custom screen content or screenshot.",
    },
  ],
  usageCode: `import { IPhone16ProMockup } from "@/components/ui/IPhone16ProMockup";

export function Example() {
  return (
    <IPhone16ProMockup color="natural" enableTilt>
      <div className="flex h-full items-center justify-center bg-neutral-900 text-white p-6">
        <h1 className="text-xl font-bold">Your Mobile App</h1>
      </div>
    </IPhone16ProMockup>
  );
}`,
};

export default IPhone16ProMockupMeta;
