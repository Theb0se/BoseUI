import type { PulseComponentMeta } from "../../types/component";

export const AnimatedThemeTogglerMeta: PulseComponentMeta = {
  title: "Animated Theme Toggler",
  description:
    "Ultra-smooth theme toggler utilizing the modern View Transitions API with fluid liquid, wave, and organic curve reveal transitions, viscous Apple-inspired easing, tactile micro-ripples, and a kinetic morphing SVG Sun/Moon icon.",
  tagline: "Ultra-smooth theme toggle featuring organic liquid blobs, rolling ocean waves, and viscous fluid transitions.",
  category: "Buttons",
  badges: ["View Transitions API", "Liquid Physics", "Wave Transitions", "Micro-Animations", "A11y Ready"],
  createdAt: "2026-10-30",
  featured: true,
  keywords: [
    "animated theme toggler",
    "theme toggle",
    "view transitions api",
    "liquid theme transition",
    "wave transition",
    "ocean wave dark mode",
    "goo melt",
    "fluid curtain",
    "dark mode toggle",
    "sun moon morph",
    "framer motion icon",
    "smooth theme switch",
  ],
  features: [
    "12 organic liquid and wave transitions: Liquid Blob, Ocean Wave, Waterfall, Tide Sweep (Left/Right), Concentric Ripple, Liquid Droplet, Goo Melt, Aurora Wave, Bubble Burst, Whirlpool, and Fluid Curtain.",
    "Fluid multi-harmonic undulation: computes 36-40 polygon vertices with multi-step keyframes so waves undulate, roll, and crest naturally across the screen during the transition.",
    "Tactile button micro-physics: spring squish on tap (stiffness: 450, damping: 16) with an expanding internal liquid ink drop on click.",
    "Viscous fluid easing: defaults to cubic-bezier(0.22, 1, 0.36, 1) for natural fluid inertia and soft viscous deceleration.",
    "Kinetic Morphing Icon: pure SVG morphing transition with animated SVG mask crescent, 8 kinetic sun rays that pop with spring physics, and twinkling stars for night mode.",
    "Precision percentage coordinates: uses percentage-based clip-path calculations to prevent coordinate drift across fractional Windows display scaling (125%, 150%, 175%).",
    "Graceful degradation: detects document.startViewTransition and user's prefers-reduced-motion, falling back cleanly to instantaneous or subtle crossfade changes on unsupported browsers.",
  ],
  accessibility: [
    "Semantically rendered as an accessible button with role='switch' and aria-checked attribute.",
    "Keyboard accessible with focus-visible rings and full Enter / Spacebar activation.",
    "Honors prefers-reduced-motion media query by bypassing screen-wide clip-path geometry sweeps.",
  ],
  props: [
    {
      name: "variant",
      type: '"liquid-blob" | "ocean-wave" | "waterfall" | "tide-sweep" | "tide-sweep-left" | "concentric-ripple" | "liquid-droplet" | "goo-melt" | "aurora-wave" | "bubble-burst" | "fluid-curtain" | "whirlpool" | "circle"',
      default: '"liquid-blob"',
      description: "Organic liquid, wave, or curved transition reveal pattern.",
    },
    {
      name: "duration",
      type: "number",
      default: "520",
      description: "Duration of the View Transition clip-path animation in milliseconds.",
    },
    {
      name: "easing",
      type: "string",
      default: '"cubic-bezier(0.22, 1, 0.36, 1)"',
      description: "CSS timing function for the transition. Defaults to fluid viscous deceleration curve.",
    },
    {
      name: "fromCenter",
      type: "boolean",
      default: "false",
      description: "When true, expands outward from the center of the viewport rather than from the button's click coordinates.",
    },
    {
      name: "theme",
      type: '"light" | "dark"',
      default: "undefined",
      description: "Controlled theme value when integrated with next-themes or state stores.",
    },
    {
      name: "onThemeChange",
      type: "(theme: 'light' | 'dark') => void",
      default: "undefined",
      description: "Callback fired when the toggle completes state change.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Dimensions of the circular button and inner SVG icon.",
    },
    {
      name: "glow",
      type: "boolean",
      default: "true",
      description: "Renders an ambient theme-colored halo glow behind the toggle button.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional CSS classes merged via cn utility.",
    },
  ],
  usageCode: `import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function HeaderThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      variant="liquid-blob"
      duration={520}
      theme={isDark ? "dark" : "light"}
      onThemeChange={(next) => setTheme(next)}
      glow
    />
  );
}`,
};

export default AnimatedThemeTogglerMeta;
