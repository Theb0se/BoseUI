import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Digital Radar",
  description:
    "Tactical polar radar sweep background featuring concentric nautical range rings, degree azimuth ticks, a rotating phosphor conic beam, and target blips that illuminate with decaying afterglow on sweep contact.",
  tagline: "Tactical polar radar sweep with phosphor target persistence.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Tactical HUD", "Interactive"],
  createdAt: "2026-10-08",
  keywords: [
    "digital radar",
    "polar radar sweep",
    "tactical hud background",
    "sonar sweep",
    "telemetry canvas",
  ],
  features: [
    "Multi-slice phosphor conic sweep beam that triggers expanding target pings upon angular intersection.",
    "Precision azimuth degree ring, dashed diagonal crosshairs, and nautical mile range markers.",
    "Live interactive HUD controls for target count, telemetry callouts, phosphor color, and sweep velocity.",
  ],
  accessibility: [
    "Marks the tactical radar <canvas> with aria-hidden='true' to keep screen reader navigation focused on semantic content.",
    "All interactive HUD controls include keyboard focus styles and descriptive accessible labels.",
  ],
  props: [
    {
      name: "sweepSpeed",
      type: "number",
      default: "1.0",
      description: "Angular velocity multiplier for the rotating radar beam.",
    },
    {
      name: "blipCount",
      type: "number",
      default: "8",
      description: "Number of tracked target contacts distributed across the polar grid.",
    },
    {
      name: "color",
      type: "string",
      default: '"#10B981"',
      description: "Primary radar phosphor color in hex format.",
    },
    {
      name: "rangeRings",
      type: "number",
      default: "4",
      description: "Number of concentric range rings rendered from the radar origin.",
    },
    {
      name: "showTelemetry",
      type: "boolean",
      default: "true",
      description: "Displays flight-level callouts, target IDs, and compass bearings.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground UI rendered above the radar canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { DigitalRadar } from "@/components/ui/DigitalRadar";

export function Example() {
  return (
    <DigitalRadar
      color="#10B981"
      sweepSpeed={1.0}
      blipCount={8}
      rangeRings={4}
      showTelemetry
    />
  );
}`,
};

export default meta;
