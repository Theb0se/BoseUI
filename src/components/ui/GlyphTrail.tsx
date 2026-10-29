"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Config & Constants                                                 */
/* ------------------------------------------------------------------ */

export const DEFAULT_GLYPH_LINES = [
  "stem docs",
  "ideas logic",
  "natural input",
  "text corca math",
  "formulas notation",
  "functions variables",
  "collaborative editing",
];

// Symbols a character can turn into while the cursor passes over it.
export const DEFAULT_GLYPHS = Array.from(
  "∈∃∀∇∂∫∑∏√∞≠≈≤≥⊂⊃⊆⊇∪∩→←↔⇄⇌⊢⊥∴∵ℝℕℤℂℚ𝔽𝕋𝔻ℬℒℰ𝒟𝒦𝒥𝒞𝒫ΩΨΦΣΛμπβθζ≪≫{}[]()+-=~<>|*7xkhaLZ"
);

// Full class strings so Tailwind can see them at build time.
export const GLYPH_PALETTE = [
  { text: "text-violet-400", border: "border-violet-400/70" },
  { text: "text-orange-400", border: "border-orange-400/70" },
  { text: "text-teal-400", border: "border-teal-400/70" },
  { text: "text-lime-400", border: "border-lime-400/70" },
  { text: "text-sky-400", border: "border-sky-400/70" },
  { text: "text-pink-400", border: "border-pink-400/70" },
  { text: "text-rose-400", border: "border-rose-400/70" },
  { text: "text-cyan-400", border: "border-cyan-400/70" },
  { text: "text-amber-400", border: "border-amber-400/70" },
  { text: "text-emerald-400", border: "border-emerald-400/70" },
] as const;

const SETTLE_MS = 380; // original letter shown in colour before fading to grey

const pick = <T,>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Cell {
  id: number;
  ch: string;
  space: boolean;
  locked: boolean;
}

interface Live {
  glyph: string;
  color: number;
  boxed: boolean;
  /** 0 normal · 1 bold · 2 italic */
  weight: 0 | 1 | 2;
  phase: "hot" | "settle";
  until: number;
}

export interface GlyphTrailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Lines of text, centered and set in monospace */
  lines?: string[];
  /** A word that stays white and never scrambles */
  highlight?: string;
  /** Custom character set to scramble into. Defaults to mathematical glyphs */
  glyphs?: string | string[];
  /** Pointer influence radius in px. Default: 30 */
  radius?: number;
  /** Average time (ms) a character stays scrambled after pointer leaves. Default: 1200 */
  lifeMs?: number;
  className?: string;
}

/**
 * GlyphTrail
 * Monospace text that scrambles into coloured math symbols under the pointer,
 * then relaxes back to the original letters.
 */
export function GlyphTrail({
  lines = DEFAULT_GLYPH_LINES,
  highlight = "corca",
  glyphs = DEFAULT_GLYPHS,
  radius = 30,
  lifeMs = 1200,
  className,
  ...props
}: GlyphTrailProps) {
  const reduceMotion = useReducedMotion();
  const lineList = lines && lines.length > 0 ? lines : DEFAULT_GLYPH_LINES;
  const glyphPool = useMemo(() => {
    if (Array.isArray(glyphs)) return glyphs;
    return Array.from(glyphs);
  }, [glyphs]);

  const rows = useMemo<Cell[][]>(() => {
    let id = 0;
    return lineList.map((line) => {
      const chars = Array.from(line);
      const hlChars = highlight ? Array.from(highlight) : [];
      const at = highlight ? line.indexOf(highlight) : -1;
      const start = at >= 0 ? Array.from(line.slice(0, at)).length : -1;
      return chars.map((ch, i) => ({
        id: id++,
        ch,
        space: ch === " ",
        locked: start >= 0 && i >= start && i < start + hlChars.length,
      }));
    });
  }, [lineList, highlight]);

  const flat = useMemo(() => rows.flat(), [rows]);

  const rootRef = useRef<HTMLDivElement>(null);
  const cellEls = useRef<(HTMLSpanElement | null)[]>([]);
  const centers = useRef<{ x: number; y: number }[]>([]);
  const live = useRef(new Map<number, Live>());
  const raf = useRef(0);
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  /* Cache each character's centre relative to the container */
  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rb = root.getBoundingClientRect();
    centers.current = flat.map((_, i) => {
      const el = cellEls.current[i];
      if (!el) return { x: -1e5, y: -1e5 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - rb.left + r.width / 2,
        y: r.top - rb.top + r.height / 2,
      };
    });
  }, [flat]);

  useIsomorphicLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    const ro = root ? new ResizeObserver(measure) : null;
    if (root && ro) ro.observe(root);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    return () => ro?.disconnect();
  }, [measure]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* Decay loop — only runs while something is active */
  const tick = useCallback(() => {
    const now = performance.now();
    let changed = false;

    live.current.forEach((cell, id) => {
      if (now < cell.until) return;
      if (cell.phase === "hot") {
        cell.phase = "settle";
        cell.glyph = flat[id]?.ch ?? ""; // original letter, still coloured
        cell.boxed = false;
        cell.until = now + SETTLE_MS;
      } else {
        live.current.delete(id); // colour fades back to grey
      }
      changed = true;
    });

    if (changed) rerender();
    raf.current = live.current.size ? requestAnimationFrame(tick) : 0;
  }, [flat]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !rootRef.current) return;
    const rb = rootRef.current.getBoundingClientRect();
    const px = e.clientX - rb.left;
    const py = e.clientY - rb.top;
    const r2 = radius * radius;
    const now = performance.now();
    const life = () => lifeMs * (0.7 + Math.random() * 0.8);
    let changed = false;

    centers.current.forEach((c, i) => {
      const cell = flat[i];
      if (!cell || cell.space || cell.locked) return;
      const dx = c.x - px;
      const dy = c.y - py;
      if (dx * dx + dy * dy > r2) return;

      const existing = live.current.get(i);
      if (existing && existing.phase === "hot") {
        existing.until = now + life();
        if (Math.random() < 0.04) {
          existing.glyph = pick(glyphPool);
          changed = true;
        }
        return;
      }

      live.current.set(i, {
        glyph: pick(glyphPool),
        color: Math.floor(Math.random() * GLYPH_PALETTE.length),
        boxed: Math.random() < 0.45,
        weight: (Math.random() < 0.3
          ? 1
          : Math.random() < 0.2
          ? 2
          : 0) as 0 | 1 | 2,
        phase: "hot",
        until: now + life(),
      });
      changed = true;
    });

    if (changed) rerender();
    if (!raf.current && live.current.size)
      raf.current = requestAnimationFrame(tick);
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={lineList.join(", ")}
      onPointerMove={onPointerMove}
      className={cn(
        "relative select-none bg-black px-8 py-14 font-mono text-2xl leading-snug text-neutral-500",
        className
      )}
      {...props}
    >
      {rows.map((row, r) => (
        <div key={r} className="flex justify-center whitespace-pre">
          {row.map((cell) => {
            const lv = live.current.get(cell.id);
            const color = lv ? GLYPH_PALETTE[lv.color] : null;
            const glyph = lv?.glyph ?? cell.ch;

            return (
              <span
                key={cell.id}
                ref={(el) => {
                  cellEls.current[cell.id] = el;
                }}
                className="relative inline-block w-[1ch] text-center"
              >
                <motion.span
                  key={glyph}
                  initial={lv ? { opacity: 0.35, scale: 0.8 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className={cn(
                    "inline-block transition-colors",
                    lv?.phase === "hot" ? "duration-100" : "duration-700",
                    cell.locked
                      ? "text-white"
                      : color
                      ? color.text
                      : "text-neutral-500",
                    lv?.weight === 1 && "font-bold",
                    lv?.weight === 2 && "italic"
                  )}
                >
                  {glyph}
                </motion.span>

                {!cell.space && !cell.locked && (
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      opacity: lv?.boxed ? 1 : 0,
                      scale: lv?.boxed ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={cn(
                      "pointer-events-none absolute inset-y-0 -inset-x-px rounded-[5px] border",
                      color ? color.border : "border-transparent"
                    )}
                  />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GlyphTrail;
