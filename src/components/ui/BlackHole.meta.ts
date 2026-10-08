import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Black Hole",
  description:
    "Interstellar-inspired gravitational lensing black hole background powered by a WebGL relativistic ray-marching shader with a pitch-black event horizon, incandescent photon ring, bent upper and lower lensing arcs, and Doppler-beamed accretion plasma.",
  tagline: "WebGL relativistic accretion disk with geodesic light bending.",
  category: "Backgrounds",
  badges: ["WebGL", "Shader", "Physics", "Cosmic"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "black hole",
    "gargantua",
    "interstellar",
    "accretion disk",
    "gravitational lensing",
    "space background",
    "singularity",
    "photon ring",
    "webgl shader",
  ],
  features: [
    "Real-time WebGL geodesic light-bending ray marcher around a Schwarzschild/Kerr event horizon",
    "True 3D tilted accretion disk with multi-octave FBM spiraling plasma filaments and bent upper/lower gravitational lensing arches",
    "Relativistic Doppler beaming that shifts the approaching disk toward incandescent white-gold and the receding side toward deep amber-crimson",
    "Gravitationally lensed background starfield and razor-sharp incandescent photon sphere ring",
    "Interactive telemetry HUD with live presets (Gargantua, Quasar Jet, Crimson Singularity) when children are omitted",
  ],
  accessibility: [
    "Decorative WebGL canvas is marked aria-hidden so screen readers focus on foreground content",
    "High-contrast translucent HUD controls with keyboard-focusable buttons and range sliders",
  ],
  props: [
    {
      name: "size",
      type: "number",
      default: "95",
      description: "Radius scale of the central event horizon void in pixels.",
    },
    {
      name: "diskColor",
      type: "string",
      default: '"#FF7A18"',
      description: "Primary hex color of the glowing accretion disk and lensing halo.",
    },
    {
      name: "spinSpeed",
      type: "number",
      default: "1.2",
      description: "Angular velocity and relativistic Doppler beaming multiplier for orbiting matter.",
    },
    {
      name: "particleCount",
      type: "number",
      default: "260",
      description: "Filament resolution scale in the relativistic accretion disk.",
    },
    {
      name: "pull",
      type: "number",
      default: "0.35",
      description: "Radial inward gravitational pull and spacetime curvature strength.",
    },
    {
      name: "lensing",
      type: "boolean",
      default: "true",
      description: "Whether to enable full relativistic gravitational light bending.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground content rendered above the black hole canvas.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes applied to the root container.",
    },
  ],
  usageCode: `import { BlackHole } from "@/components/ui/BlackHole";

export function BlackHoleDemo() {
  return (
    <BlackHole
      size={95}
      diskColor="#FF7A18"
      spinSpeed={1.2}
      particleCount={260}
      pull={0.35}
      lensing
    />
  );
}`,
};

export default meta;
