import type { PulseComponentMeta } from "../../types/component";

export const meta: PulseComponentMeta = {
  title: "Planet Horizon",
  description:
    "Orbital sunrise-from-space hero background featuring a twinkling starfield, a giant curved planetary sphere with a multi-layered glowing atmospheric limb, and an animated anamorphic solar flare cresting along the terminator.",
  tagline: "Cinematic orbital sunrise with atmospheric Rayleigh scattering.",
  category: "Backgrounds",
  badges: ["Canvas 2D", "Cosmic", "Atmospheric", "Hero"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "planet horizon",
    "earth from space",
    "orbital sunrise",
    "atmospheric limb",
    "lens flare",
    "space hero background",
    "terminator line",
  ],
  features: [
    "Curved planetary sphere with multi-layered radial exosphere and razor-thin bright limb edge",
    "Animated solar crest with horizontal anamorphic lens flare streaks and chromatic iris ghosts",
    "Twinkling deep-space starfield automatically occluded by the planetary body",
    "Supports both continuous orbital autoplay and manual solar flare scrubbing from 0 to 1",
    "Built-in atmospheric theme presets (Terra Dawn, Exoplanet Violet, Martian Amber)",
  ],
  accessibility: [
    "Canvas is marked aria-hidden so foreground hero copy and CTAs remain cleanly navigable",
    "Includes play/pause orbital motion toggle for users who prefer stationary lighting",
  ],
  props: [
    {
      name: "atmosphereColor",
      type: "string",
      default: '"#38BDF8"',
      description: "Hex color of the glowing planetary atmospheric limb.",
    },
    {
      name: "flareColor",
      type: "string",
      default: '"#FDE047"',
      description: "Hex color of the cresting solar flare core and diffraction rays.",
    },
    {
      name: "flarePosition",
      type: "number",
      default: "0.5",
      description: "Normalized position (0 to 1) of the sun along the horizon when autoplay is disabled.",
    },
    {
      name: "autoplay",
      type: "boolean",
      default: "true",
      description: "Whether the solar flare smoothly orbits along the planetary horizon.",
    },
    {
      name: "starDensity",
      type: "number",
      default: "140",
      description: "Number of twinkling background stars rendered above the planet.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      description: "Optional foreground hero content rendered over the horizon.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes for the root container.",
    },
  ],
  usageCode: `import { PlanetHorizon } from "@/components/ui/PlanetHorizon";

export function PlanetHorizonDemo() {
  return (
    <PlanetHorizon
      atmosphereColor="#38BDF8"
      flareColor="#FDE047"
      flarePosition={0.5}
      autoplay
      starDensity={140}
    />
  );
}`,
};

export default meta;
