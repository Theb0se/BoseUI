/**
 * BoseUI Design Token System — Single Source of Truth
 *
 * All values here map 1-to-1 to:
 *   • CSS custom properties  (globals.css)
 *   • Tailwind theme tokens  (tailwind.config.ts)
 *   • Framer Motion presets  (src/lib/motion.ts)
 *
 * Edit here — everything else stays in sync automatically.
 */

// ─────────────────────────────────────────────
// SECTION 1 · COLOR PRIMITIVES
// Raw palette — never use directly in components.
// Reference semantic tokens (Section 2) instead.
// ─────────────────────────────────────────────

export const color = {
  // Neutrals (HSL lightness steps)
  neutral: {
    0:   "0 0% 100%",   // white
    50:  "0 0% 97%",
    100: "0 0% 94%",
    200: "0 0% 89.8%",
    300: "0 0% 80%",
    400: "0 0% 63%",
    500: "0 0% 50%",
    600: "0 0% 38%",
    700: "0 0% 25%",
    800: "0 0% 15%",
    900: "0 0% 9%",
    950: "0 0% 5%",
    1000: "0 0% 0%",    // black
  },
  // Brand blue — accent
  blue: {
    50:  "214 100% 97%",
    100: "214 95% 93%",
    200: "213 97% 87%",
    300: "212 96% 78%",
    400: "213 94% 68%",
    500: "217 91% 60%",
    600: "221 83% 53%",
    700: "224 76% 48%",
    800: "226 71% 40%",
    900: "224 64% 33%",
    950: "226 57% 21%",
  },
} as const;

// ─────────────────────────────────────────────
// SECTION 2 · SEMANTIC COLOR TOKENS
// Light + dark values. These become CSS vars.
// ─────────────────────────────────────────────

export const semanticColors = {
  light: {
    background:        color.neutral[0],
    backgroundSubtle:  color.neutral[50],
    surface:           color.neutral[0],
    surfaceRaised:     color.neutral[50],
    surfaceOverlay:    color.neutral[0],
    foreground:        color.neutral[900],
    foregroundMuted:   color.neutral[500],
    foregroundSubtle:  color.neutral[400],
    border:            color.neutral[200],
    borderStrong:      color.neutral[300],
    ring:              color.neutral[900],
    accent:            color.blue[600],
    accentForeground:  color.neutral[0],
    accentMuted:       color.blue[50],
  },
  dark: {
    background:        color.neutral[950],
    backgroundSubtle:  "0 0% 7%",
    surface:           "0 0% 8%",
    surfaceRaised:     "0 0% 11%",
    surfaceOverlay:    "0 0% 13%",
    foreground:        color.neutral[50],
    foregroundMuted:   color.neutral[400],
    foregroundSubtle:  color.neutral[600],
    border:            color.neutral[800],
    borderStrong:      color.neutral[700],
    ring:              color.neutral[300],
    accent:            color.blue[500],
    accentForeground:  color.neutral[0],
    accentMuted:       color.blue[950],
  },
} as const;

// ─────────────────────────────────────────────
// SECTION 3 · TYPOGRAPHY
// ─────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: [
      "var(--font-inter)",
      "Inter Tight",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ],
    mono: [
      "var(--font-jetbrains-mono)",
      "JetBrains Mono",
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "monospace",
    ],
  },
  fontSize: {
    "2xs": ["0.625rem",  { lineHeight: "0.875rem", letterSpacing: "0.01em"  }],
    xs:    ["0.75rem",   { lineHeight: "1rem",     letterSpacing: "0.005em" }],
    sm:    ["0.875rem",  { lineHeight: "1.25rem",  letterSpacing: "0"       }],
    base:  ["1rem",      { lineHeight: "1.5rem",   letterSpacing: "-0.011em"}],
    lg:    ["1.125rem",  { lineHeight: "1.75rem",  letterSpacing: "-0.014em"}],
    xl:    ["1.25rem",   { lineHeight: "1.75rem",  letterSpacing: "-0.017em"}],
    "2xl": ["1.5rem",    { lineHeight: "2rem",     letterSpacing: "-0.019em"}],
    "3xl": ["1.875rem",  { lineHeight: "2.25rem",  letterSpacing: "-0.021em"}],
    "4xl": ["2.25rem",   { lineHeight: "2.5rem",   letterSpacing: "-0.022em"}],
    "5xl": ["3rem",      { lineHeight: "1",        letterSpacing: "-0.025em"}],
    "6xl": ["3.75rem",   { lineHeight: "1",        letterSpacing: "-0.027em"}],
    "7xl": ["4.5rem",    { lineHeight: "1",        letterSpacing: "-0.028em"}],
    "8xl": ["6rem",      { lineHeight: "1",        letterSpacing: "-0.029em"}],
    "9xl": ["8rem",      { lineHeight: "1",        letterSpacing: "-0.030em"}],
  },
  fontWeight: {
    light:    "300",
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
    extrabold:"800",
    black:    "900",
  },
  letterSpacing: {
    tightest: "-0.03em",
    tighter:  "-0.02em",
    tight:    "-0.01em",
    normal:   "0em",
    wide:     "0.025em",
    wider:    "0.05em",
    widest:   "0.1em",
  },
} as const;

// ─────────────────────────────────────────────
// SECTION 4 · SPACING & LAYOUT
// ─────────────────────────────────────────────

export const spacing = {
  // 4px base grid
  px:   "1px",
  0:    "0px",
  0.5:  "2px",
  1:    "4px",
  1.5:  "6px",
  2:    "8px",
  2.5:  "10px",
  3:    "12px",
  3.5:  "14px",
  4:    "16px",
  5:    "20px",
  6:    "24px",
  7:    "28px",
  8:    "32px",
  9:    "36px",
  10:   "40px",
  11:   "44px",
  12:   "48px",
  14:   "56px",
  16:   "64px",
  18:   "72px",
  20:   "80px",
  24:   "96px",
  28:   "112px",
  32:   "128px",
  36:   "144px",
  40:   "160px",
  44:   "176px",
  48:   "192px",
  52:   "208px",
  56:   "224px",
  60:   "240px",
  64:   "256px",
  72:   "288px",
  80:   "320px",
  96:   "384px",
} as const;

export const layout = {
  maxWidth: {
    xs:   "20rem",    // 320px
    sm:   "24rem",    // 384px
    md:   "28rem",    // 448px
    lg:   "32rem",    // 512px
    xl:   "36rem",    // 576px
    "2xl":"42rem",    // 672px
    "3xl":"48rem",    // 768px
    "4xl":"56rem",    // 896px
    "5xl":"64rem",    // 1024px
    "6xl":"72rem",    // 1152px
    "7xl":"80rem",    // 1280px
    prose:"65ch",
    full: "100%",
  },
  borderRadius: {
    none:  "0px",
    sm:    "0.25rem",   // 4px
    base:  "0.375rem",  // 6px
    md:    "0.5rem",    // 8px
    lg:    "0.75rem",   // 12px
    xl:    "1rem",      // 16px
    "2xl": "1.25rem",   // 20px
    "3xl": "1.5rem",    // 24px
    full:  "9999px",
  },
  zIndex: {
    base:    "0",
    raised:  "10",
    overlay: "20",
    sticky:  "30",
    drawer:  "40",
    modal:   "50",
    popover: "60",
    toast:   "70",
    tooltip: "80",
  },
} as const;

// ─────────────────────────────────────────────
// SECTION 5 · SHADOW
// ─────────────────────────────────────────────

export const shadow = {
  none: "none",
  xs:   "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm:   "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
  md:   "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  lg:   "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  xl:   "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl":"0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
  // Glow variants (use sparingly)
  "glow-blue":  "0 0 0 1px hsl(217 91% 60% / 0.3), 0 0 20px hsl(217 91% 60% / 0.15)",
  "glow-white": "0 0 0 1px rgb(255 255 255 / 0.08), 0 0 20px rgb(255 255 255 / 0.06)",
} as const;

// ─────────────────────────────────────────────
// SECTION 6 · MOTION TOKENS
// All spring / transition / easing values.
// Also exported to src/lib/motion.ts for Framer Motion.
// ─────────────────────────────────────────────

/**
 * Raw spring configs for Framer Motion.
 * Usage: transition={spring.snappy}
 */
export const spring = {
  /** Instantaneous UI feedback. For toggle switches, tabs. */
  instant: { type: "spring", stiffness: 800, damping: 40, mass: 0.5 } as const,

  /** Tight, snappy. For hover scales, button presses. */
  snappy:  { type: "spring", stiffness: 500, damping: 35, mass: 0.7 } as const,

  /** Default interactive. For cards, overlays, layout. */
  default: { type: "spring", stiffness: 350, damping: 30, mass: 0.8 } as const,

  /** Soft, weighted. For page entrances, large elements. */
  soft:    { type: "spring", stiffness: 200, damping: 28, mass: 1.0 } as const,

  /** Bouncy, playful. Use sparingly on small UI only. */
  bouncy:  { type: "spring", stiffness: 400, damping: 20, mass: 0.8 } as const,

  /** Molasses — heavy, deliberate. Hero sections. */
  molasses:{ type: "spring", stiffness: 120, damping: 30, mass: 1.5 } as const,

  /** Inertia/momentum (velocity-driven). For drag release. */
  inertia: { type: "inertia", power: 0.4, timeConstant: 300 } as const,
} as const;

/**
 * Duration + easing presets for CSS & non-spring transitions.
 * Usage: transition={tween.smooth}
 */
export const tween = {
  instant: { duration: 0.08, ease: [0.16, 1, 0.3, 1] } as const,
  fast:    { duration: 0.15, ease: [0.16, 1, 0.3, 1] } as const,
  smooth:  { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const,
  slow:    { duration: 0.4,  ease: [0.16, 1, 0.3, 1] } as const,
  linear:  { duration: 0.3,  ease: "linear"           } as const,
  // Apple-style ease-out
  apple:   { duration: 0.5,  ease: [0.25, 0.1, 0.25, 1] } as const,
  // Dramatic, editorial
  expo:    { duration: 0.6,  ease: [0.76, 0, 0.24, 1] } as const,
} as const;

/**
 * Stagger delay between children in list/grid animations.
 * Usage: staggerChildren: stagger.fast
 */
export const stagger = {
  none:    0,
  instant: 0.03,
  fast:    0.05,
  default: 0.08,
  slow:    0.12,
  glacial: 0.2,
} as const;

/**
 * Reusable animation variants for Framer Motion.
 */
export const variants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0,  transition: { ...spring.soft } },
  },
  fadeDown: {
    hidden:  { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0,   transition: { ...spring.soft } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { ...tween.smooth } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1,    transition: { ...spring.snappy } },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: 20  },
    visible: { opacity: 1, x: 0,   transition: { ...spring.default } },
  },
  slideRight: {
    hidden:  { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0,   transition: { ...spring.default } },
  },
  container: {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger.fast, delayChildren: 0.05 } },
  },
} as const;

// ─────────────────────────────────────────────
// SECTION 7 · CSS TRANSITION DURATIONS
// For raw CSS / Tailwind transition utilities.
// ─────────────────────────────────────────────

export const duration = {
  instant: "80ms",
  fast:    "150ms",
  normal:  "250ms",
  slow:    "400ms",
  slower:  "600ms",
  lazy:    "900ms",
} as const;

export const ease = {
  spring:   "cubic-bezier(0.16, 1, 0.3, 1)",   // expo ease-out (spring feel)
  apple:    "cubic-bezier(0.25, 0.1, 0.25, 1)", // system default
  out:      "cubic-bezier(0, 0, 0.2, 1)",
  in:       "cubic-bezier(0.4, 0, 1, 1)",
  inOut:    "cubic-bezier(0.4, 0, 0.2, 1)",
  linear:   "linear",
} as const;
