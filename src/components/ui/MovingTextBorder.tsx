"use client";

import React, {
  useId,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MovingTextBorderStart =
  | "top-left"
  | "top-right"
  | "bottom-right"
  | "bottom-left";

export interface MovingTextBorderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the moving text border container */
  children?: ReactNode;
  /** Text marching around the perimeter */
  text?: string;
  /** Duration in seconds for a full loop around the perimeter. Default: 12 */
  duration?: number;
  /** Whether the text flows counter-clockwise. Default: false */
  reverse?: boolean;
  /** Fill color of the text. Default: "#a78bfa" */
  textColor?: string;
  /** Font size of the marching text in px. Default: 10 */
  fontSize?: number;
  /** Letter spacing of the text in px. Default: 2 */
  letterSpacing?: number;
  /** Font weight for the SVG text. Default: 600 */
  fontWeight?: number | string;
  /** Corner radius in px matching the container's rounded corners. Default: 16 */
  borderRadius?: number;
  /** Optional background track path color */
  trackColor?: string;
  /** Width in px of the background track path. Default: 1 */
  trackWidth?: number;
  /** Kept for API compatibility. Text is always tiled so the loop is seamless. */
  autoRepeat?: boolean;
  /** Add a soft ambient glow to the text. Default: false */
  glow?: boolean;
  className?: string;
  contentClassName?: string;
  startAt?: MovingTextBorderStart;
}

export function MovingTextBorder({
  children,
  text = "AVAILABLE FOR WORK • AVAILABLE FOR WORK • ",
  duration = 12,
  reverse = false,
  textColor = "#a78bfa",
  fontSize = 10,
  letterSpacing = 2,
  fontWeight = "600",
  borderRadius = 16,
  trackColor,
  trackWidth = 1,
  autoRepeat = true,
  glow = false,
  className,
  contentClassName,
  startAt = "bottom-right",
  ...props
}: MovingTextBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });
  const [pathLength, setPathLength] = useState(0);
  const [unitWidth, setUnitWidth] = useState(0);

  const rawId = useId();
  const pathId = `border-path-${rawId.replace(/[^a-zA-Z0-9-_]/g, "")}`;
  const shouldReduceMotion = useReducedMotion();

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };
    update();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({
            width: Math.round(width),
            height: Math.round(height),
          });
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rounded-rect path, starting at top-center, clockwise
  const svgPathData = useMemo(() => {
    const inset = 3;
    const w = Math.max(dimensions.width - inset * 2, 20);
    const h = Math.max(dimensions.height - inset * 2, 20);
    const rx = Math.max(2, Math.min(borderRadius - inset, w / 2 - 1, h / 2 - 1));

    const x0 = inset;
    const y0 = inset;
    const x1 = x0 + w;
    const y1 = y0 + h;

    // Clockwise segments, each paired with the point where it begins
    const top = `H ${x1 - rx}`;
    const topR = `Q ${x1},${y0} ${x1},${y0 + rx}`;
    const right = `V ${y1 - rx}`;
    const botR = `Q ${x1},${y1} ${x1 - rx},${y1}`;
    const bottom = `H ${x0 + rx}`;
    const botL = `Q ${x0},${y1} ${x0},${y1 - rx}`;
    const left = `V ${y0 + rx}`;
    const topL = `Q ${x0},${y0} ${x0 + rx},${y0}`;

    const starts = {
      "top-left": {
        m: `M ${x0 + rx},${y0}`,
        seg: [top, topR, right, botR, bottom, botL, left, topL],
      },
      "top-right": {
        m: `M ${x1},${y0 + rx}`,
        seg: [right, botR, bottom, botL, left, topL, top, topR],
      },
      "bottom-right": {
        m: `M ${x1 - rx},${y1}`,
        seg: [bottom, botL, left, topL, top, topR, right, botR],
      },
      "bottom-left": {
        m: `M ${x0},${y1 - rx}`,
        seg: [left, topL, top, topR, right, botR, bottom, botL],
      },
    } as const;

    const { m, seg } = starts[startAt];
    return [m, ...seg, "Z"].join(" ");
  }, [dimensions, borderRadius, startAt]);

  // Measure the real path length
  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [svgPathData]);

  // Measure the real width of ONE text unit
  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const w = measureRef.current.getComputedTextLength();
    // Fallback estimate if measurement isn't available yet
    setUnitWidth(w > 0 ? w : text.length * (fontSize * 0.6 + letterSpacing));
  }, [text, fontSize, letterSpacing, fontWeight]);

  // Tile the text enough to cover the whole path PLUS one extra unit,
  // so shifting by exactly one unit is visually identical (seamless loop).
  const fullText = useMemo(() => {
    if (!text) return "";
    if (!autoRepeat) return text;
    if (unitWidth <= 0 || pathLength <= 0) return text.repeat(8);
    const repeatCount = Math.ceil((pathLength + unitWidth) / unitWidth) + 1;
    return text.repeat(repeatCount);
  }, [text, unitWidth, pathLength, autoRepeat]);

  // Infinite seamless animation
  useEffect(() => {
    const tp = textPathRef.current;
    if (!tp || unitWidth <= 0 || pathLength <= 0) return;

    // Forward: offset runs -unit -> 0. Reverse: 0 -> -unit.
    const setOffset = (shift: number) => {
      const value = reverse ? -shift : -unitWidth + shift;
      tp.setAttribute("startOffset", `${value}`);
    };

    if (shouldReduceMotion) {
      setOffset(0);
      return;
    }

    // duration = seconds for text to travel one full lap
    const speed = pathLength / Math.max(duration, 0.1); // px per second
    let raf = 0;
    let last = performance.now();
    let shift = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      shift = (shift + speed * dt) % unitWidth;
      setOffset(shift);
      raf = requestAnimationFrame(tick);
    };

    setOffset(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [unitWidth, pathLength, duration, reverse, shouldReduceMotion, fullText]);

  return (
    <div ref={containerRef} className={cn("relative rounded-2xl w-fit h-fit ", className)} {...props}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          <path ref={pathRef} id={pathId} d={svgPathData} />
          {glow && (
            <filter
              id={`glow-${pathId}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Hidden element used only to measure one text unit */}
        <text
          ref={measureRef}
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          style={{ textTransform: "uppercase", visibility: "hidden" }}
        >
          {text}
        </text>

        {trackColor && (
          <path
            d={svgPathData}
            fill="none"
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
        )}

        <motion.text
          fill={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          filter={glow ? `url(#glow-${pathId})` : undefined}
          style={{ textTransform: "uppercase" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset={0}>
            {fullText}
          </textPath>
        </motion.text>
      </svg>

      <div className={cn("relative z-10", contentClassName)}>
        {children || (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              Moving Text Border
            </span>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
              Animated typography continuously marching along the perimeter of this card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovingTextBorder;