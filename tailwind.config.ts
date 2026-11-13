import type { Config } from "tailwindcss";
import { typography, layout, shadow, duration, ease } from "./src/lib/tokens";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/registry/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors — map to CSS vars from globals.css ──────────────
      colors: {
        background:         "hsl(var(--background) / <alpha-value>)",
        "background-subtle":"hsl(var(--background-subtle) / <alpha-value>)",
        surface:            "hsl(var(--surface) / <alpha-value>)",
        "surface-raised":   "hsl(var(--surface-raised) / <alpha-value>)",
        "surface-overlay":  "hsl(var(--surface-overlay) / <alpha-value>)",
        foreground:         "hsl(var(--foreground) / <alpha-value>)",
        "foreground-muted": "hsl(var(--foreground-muted) / <alpha-value>)",
        "foreground-subtle":"hsl(var(--foreground-subtle) / <alpha-value>)",
        border:             "hsl(var(--border) / <alpha-value>)",
        "border-strong":    "hsl(var(--border-strong) / <alpha-value>)",
        ring:               "hsl(var(--ring) / <alpha-value>)",
        accent:             "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground":"hsl(var(--accent-foreground) / <alpha-value>)",
        "accent-muted":     "hsl(var(--accent-muted) / <alpha-value>)",
      },

      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        sans: [...typography.fontFamily.sans] as string[],
        mono: [...typography.fontFamily.mono] as string[],
      },
      fontSize:   typography.fontSize as any,
      fontWeight: typography.fontWeight as any,
      letterSpacing: typography.letterSpacing as any,

      // ── Layout ─────────────────────────────────────────────────
      maxWidth:     layout.maxWidth,
      borderRadius: {
        none:  layout.borderRadius.none,
        sm:    layout.borderRadius.sm,
        DEFAULT: layout.borderRadius.base,
        md:    layout.borderRadius.md,
        lg:    layout.borderRadius.lg,
        xl:    layout.borderRadius.xl,
        "2xl": layout.borderRadius["2xl"],
        "3xl": layout.borderRadius["3xl"],
        full:  layout.borderRadius.full,
      },
      zIndex: layout.zIndex,

      // ── Shadows ─────────────────────────────────────────────────
      boxShadow: {
        none:         shadow.none,
        xs:           "var(--shadow-xs)",
        sm:           "var(--shadow-sm)",
        DEFAULT:      "var(--shadow-md)",
        md:           "var(--shadow-md)",
        lg:           "var(--shadow-lg)",
        xl:           "var(--shadow-xl)",
        "2xl":        "var(--shadow-2xl)",
        inner:        shadow.inner,
        "glow-blue":  shadow["glow-blue"],
        "glow-white": shadow["glow-white"],
      },

      // ── Motion / Transition Durations ───────────────────────────
      transitionDuration: {
        instant: duration.instant,
        fast:    duration.fast,
        normal:  duration.normal,
        slow:    duration.slow,
        slower:  duration.slower,
        lazy:    duration.lazy,
        // keep default numeric aliases
        75:  "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000:"1000ms",
      },

      // ── Easing ──────────────────────────────────────────────────
      transitionTimingFunction: {
        spring: ease.spring,
        apple:  ease.apple,
        out:    ease.out,
        in:     ease.in,
        inout:  ease.inOut,
        linear: ease.linear,
        // keep defaults
        DEFAULT: ease.inOut,
      },

      // ── Keyframes & Animations ─────────────────────────────────
      keyframes: {
        // Existing
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)"    },
          "50%":       { opacity: "0.85",transform: "scale(1.06)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        // New tokens
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-down": {
          "0%":   { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)"     },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)"    },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)"     },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)"    },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)"   },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-glow":      "pulse-glow 4s ease-in-out infinite",
        shimmer:           "shimmer 6s linear infinite",
        "fade-in":         "fade-in 0.25s var(--ease-spring) both",
        "fade-up":         "fade-up 0.4s var(--ease-spring) both",
        "fade-down":       "fade-down 0.4s var(--ease-spring) both",
        "scale-in":        "scale-in 0.2s var(--ease-spring) both",
        "slide-in-left":   "slide-in-left 0.3s var(--ease-spring) both",
        "slide-in-right":  "slide-in-right 0.3s var(--ease-spring) both",
        "spin-slow":       "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
