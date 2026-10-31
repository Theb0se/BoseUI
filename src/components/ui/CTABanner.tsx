"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Embedded Flickering Grid Canvas (self-contained, no import)        */
/* ------------------------------------------------------------------ */

interface InternalGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
  className?: string;
}

function parseColor(c: string): string {
  if (typeof window === "undefined") return "rgba(0,0,0,";
  if (c.startsWith("#")) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h.slice(0, 6), 16);
    if (!Number.isNaN(n)) return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},`;
  }
  const m = c.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},`;
  try {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "rgba(0,0,0,";
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${d[0]},${d[1]},${d[2]},`;
  } catch {
    return "rgba(0,0,0,";
  }
}

function InternalGridCanvas({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(255,255,255)",
  maxOpacity = 0.3,
  className,
}: InternalGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const colorPrefix = useMemo(() => parseColor(color), [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      if (w <= 0 || h <= 0) return null;
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cell = squareSize + gridGap;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number | null = null;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let grid: ReturnType<typeof setupCanvas> = null;
    let lastTime = performance.now();

    const init = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        setCanvasSize({ width: w, height: h });
        grid = setupCanvas(canvas, w, h);
      }
    };

    const animate = (time: number) => {
      if (!grid) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const step = flickerChance * dt;
      for (let i = 0; i < grid.squares.length; i++) {
        if (Math.random() < step) grid.squares[i] = Math.random() * maxOpacity;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cell = (squareSize + gridGap) * grid.dpr;
      const sq = squareSize * grid.dpr;
      for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {
          const idx = i * grid.rows + j;
          if (idx >= grid.squares.length) continue;
          ctx.fillStyle = `${colorPrefix}${grid.squares[idx]})`;
          ctx.fillRect(Math.floor(i * cell), Math.floor(j * cell), sq, sq);
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    init();

    ro = new ResizeObserver(init);
    ro.observe(container);

    io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    io.observe(container);

    if (isInView && grid) rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [setupCanvas, colorPrefix, flickerChance, maxOpacity, squareSize, gridGap, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none block"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                  */
/* ------------------------------------------------------------------ */

export interface CTABannerProps {
  /** Bold headline text */
  heading: string;
  /** Muted supporting copy under the headline */
  subheading: string;
  /** Placeholder text for the email input. Default: "Enter your email" */
  placeholder?: string;
  /** Submit button label. Default: "Get started" */
  buttonLabel?: string;
  /** Called with the validated email on submit */
  onSubmit?: (email: string) => Promise<void> | void;
  /**
   * Accent color used for the grid squares and the submit button background.
   * Accepts any valid CSS color. Default: "#6366f1" (indigo-500)
   */
  accentColor?: string;
  /** Additional Tailwind CSS classes merged on the outermost container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Animation Variants                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ------------------------------------------------------------------ */
/* Small sub-components for button states                              */
/* ------------------------------------------------------------------ */

/** Tiny spinner — pure Framer Motion, no external dep */
function Spinner() {
  return (
    <motion.span
      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    />
  );
}

/** Animated SVG checkmark (pathLength 0 → 1) */
function CheckMark() {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <motion.path
        d="M2.5 8.5L6.5 12.5L13.5 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* CTABanner Component                                                 */
/* ------------------------------------------------------------------ */

type ButtonState = "idle" | "loading" | "success";

export function CTABanner({
  heading,
  subheading,
  placeholder = "Enter your email",
  buttonLabel = "Get started",
  onSubmit,
  accentColor = "#6366f1",
  className,
}: CTABannerProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [btnState, setBtnState] = useState<ButtonState>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  /** Very lightweight radial mask: edges show grid, center fades out for readability */
  const gridMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,1) 100%)",
    maskImage:
      "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,1) 100%)",
  };

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setShakeKey((k) => k + 1);
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setBtnState("loading");
    try {
      await onSubmit?.(email.trim());
      setBtnState("success");
    } catch {
      setBtnState("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
    if (btnState === "success") setBtnState("idle");
  };

  // Shake keyframes for validation failure
  const shakeTransition = shouldReduceMotion
    ? {}
    : { duration: 0.4, ease: "easeInOut" };

  const shakeAnimate = shouldReduceMotion
    ? {}
    : { x: [0, -10, 10, -8, 8, -4, 4, 0] };

  return (
    <motion.div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white",
        className
      )}
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* ── Flickering Grid Layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
        style={gridMaskStyle}
      >
        <InternalGridCanvas
          squareSize={3}
          gridGap={5}
          flickerChance={0.35}
          color={accentColor}
          maxOpacity={0.55}
          className="h-full w-full"
        />
      </div>

      {/* ── Overlay gradient for text legibility ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-neutral-950/30 via-neutral-950/60 to-neutral-950/80"
      />

      {/* ── Glow blob (slow infinite float) ── */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/4 left-1/2 z-[1] h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: accentColor }}
          animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-20">
        {/* Pill badge */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: accentColor }}
          />
          Now in public beta
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {heading}
        </motion.h2>

        {/* Subheading */}
        <motion.p
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mt-4 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {subheading}
        </motion.p>

        {/* ── Form ── */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mt-8 w-full max-w-md"
        >
          {/* aria-live region for status announcements */}
          <div aria-live="polite" className="sr-only">
            {btnState === "success" && "You're in! Check your inbox."}
            {error && error}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Input + Button row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              {/* Email input with optional shake animation */}
              <motion.div
                key={shakeKey}
                animate={shakeKey > 0 ? shakeAnimate : {}}
                transition={shakeTransition}
                className="flex-1"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id="cta-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  disabled={btnState === "success"}
                  placeholder={placeholder}
                  aria-describedby={error ? "cta-email-error" : undefined}
                  aria-invalid={!!error}
                  className={cn(
                    "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/35 outline-none backdrop-blur-sm transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-offset-0",
                    error
                      ? "border-red-500/70 focus-visible:ring-red-500/50"
                      : "border-white/10 focus-visible:border-white/30 focus-visible:ring-white/20",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={btnState === "loading" || btnState === "success"}
                whileHover={
                  shouldReduceMotion || btnState !== "idle"
                    ? undefined
                    : { scale: 1.03 }
                }
                whileTap={
                  shouldReduceMotion || btnState !== "idle"
                    ? undefined
                    : { scale: 0.97 }
                }
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                className={cn(
                  "relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                  "disabled:cursor-not-allowed disabled:opacity-70",
                  btnState === "success" && "opacity-90"
                )}
                style={{ background: accentColor, minWidth: "130px" }}
                aria-label={
                  btnState === "loading"
                    ? "Submitting…"
                    : btnState === "success"
                    ? "You're in!"
                    : buttonLabel
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {btnState === "idle" && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      {buttonLabel}
                    </motion.span>
                  )}
                  {btnState === "loading" && (
                    <motion.span
                      key="spinner"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <Spinner />
                      <span>Sending…</span>
                    </motion.span>
                  )}
                  {btnState === "success" && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <CheckMark />
                      <span>You&apos;re in!</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Inline error with AnimatePresence height + opacity */}
            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  id="cta-email-error"
                  role="alert"
                  key="error"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden text-left text-xs text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          {/* Trust line */}
          <p className="mt-4 text-xs text-white/35">
            No credit card required · Cancel any time
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CTABanner;
