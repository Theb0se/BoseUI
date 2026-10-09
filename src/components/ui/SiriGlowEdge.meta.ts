import type { PulseComponentMeta } from "../../types/component";

export const SiriGlowEdgeMeta: PulseComponentMeta = {
  title: "Siri Glow Edge",
  description:
    "Apple Intelligence-inspired fluid perimeter rainbow chromatic aura with multi-layer conic gradient blur, breathing light cycles, live voice waveform reaction, and adjustable glow thickness.",
  tagline: "Apple Intelligence chromatic perimeter glow with voice waveform reactions.",
  category: "Motion" as any,
  badges: ["New", "Apple Intelligence", "Siri Aura", "Conic Glow"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "siri glow",
    "apple intelligence",
    "chromatic aura",
    "rainbow border",
    "conic gradient glow",
    "voice waveform",
    "breathing light",
  ],
  features: [
    "Multi-layer rotating conic rainbow gradient wrapping any container or card.",
    "Dual-blur architecture combining sharp perimeter border sheen with atmospheric ambient bloom.",
    "Realistic breathing light cycle with state-dependent pulse speeds (idle, listening, thinking, responding).",
    "Dynamic live audio waveform bars synchronized with assistant voice modes.",
    "Adjustable aura intensity and spread radius slider controls.",
  ],
  accessibility: [
    "Uses accessible ARIA status updates when assistant state transitions between listening and idle.",
    "Respects reduced motion preferences by dampening rotational speed and breathing pulsation.",
    "High-contrast card core ensures text remains comfortably legible over luminous borders.",
  ],
  props: [
    {
      name: "initialState",
      type: '"idle" | "listening" | "thinking" | "responding"',
      default: '"idle"',
      description: "Initial state of the Apple Intelligence assistant aura.",
    },
    {
      name: "intensity",
      type: "number",
      default: "1.0",
      description: "Brightness and opacity multiplier for the chromatic aura.",
    },
    {
      name: "glowWidth",
      type: "number",
      default: "14",
      description: "Perimeter blur spread radius in pixels.",
    },
    {
      name: "enableBreathing",
      type: "boolean",
      default: "true",
      description: "Whether the aura subtly expands and breathes over time.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Content wrapped inside the illuminated glassmorphic card.",
    },
    {
      name: "className",
      type: "string",
      description: "Tailwind CSS classes for the root container.",
    },
  ],
  usageCode: `import { SiriGlowEdge } from "@/components/ui/SiriGlowEdge";

export function Example() {
  return (
    <SiriGlowEdge initialState="listening" intensity={1.2}>
      <div className="p-6">
        <h3 className="font-semibold text-white">Apple Intelligence Active</h3>
        <p className="text-sm text-neutral-300">Listening to user instructions...</p>
      </div>
    </SiriGlowEdge>
  );
}`,
};

export default SiriGlowEdgeMeta;
