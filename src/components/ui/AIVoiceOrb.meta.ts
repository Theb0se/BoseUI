import type { PulseComponentMeta } from "../../types/component";

export const AIVoiceOrbMeta: PulseComponentMeta = {
  title: "AI Voice Orb",
  description:
    "Siri and GPT-4o style dynamic chromatic voice visualizer orb built with Canvas 2D. Smoothly transitions across idle, listening, thinking, and speaking states with organic fluid harmonic blobs.",
  tagline: "Dynamic Siri and GPT-4o style chromatic voice mesh orb in Canvas 2D.",
  category: "Motion",
  badges: ["New", "AI", "Voice", "Canvas"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "ai voice orb",
    "siri visualizer",
    "gpt-4o voice orb",
    "voice assistant ui",
    "audio mesh",
    "canvas 2d orb",
  ],
  features: [
    "Pure Canvas 2D implementation without heavy Three.js or WebGL dependencies.",
    "4 interactive states: idle, listening, thinking, and speaking.",
    "3 aesthetic palettes: chromatic, aurora, and monochrome.",
    "Responsive audioLevel input for real mic or speech synthesis reactivity.",
    "Zero layout shift with automatic high-DPI (Retina) screen scaling.",
  ],
  accessibility: [
    "Gracefully stops organic oscillation when prefers-reduced-motion is enabled.",
    "Accessible as an interactive voice trigger button.",
  ],
  props: [
    {
      name: "state",
      type: '"idle" | "listening" | "thinking" | "speaking"',
      default: '"idle"',
      description: "Active lifecycle interaction state of the voice orb.",
    },
    {
      name: "size",
      type: "number",
      default: "240",
      description: "Diameter of the voice canvas in pixels.",
    },
    {
      name: "theme",
      type: '"chromatic" | "aurora" | "monochrome"',
      default: '"chromatic"',
      description: "Color palette gradient combination.",
    },
    {
      name: "audioLevel",
      type: "number",
      default: "0",
      description: "Audio amplitude from 0 to 1 for live acoustic reaction.",
    },
  ],
  usageCode: `import { AIVoiceOrb } from "@/components/ui/AIVoiceOrb";

export function Example() {
  return (
    <AIVoiceOrb
      state="listening"
      theme="chromatic"
      audioLevel={0.45}
      size={240}
    />
  );
}`,
};

export default AIVoiceOrbMeta;
