"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Exported Interface                                         */
/* ------------------------------------------------------------------ */

export interface TextMaskGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Text revealed through the flickering grid. Default: "Brand" */
  text?: string;
  /** Responsive CSS font-size clamp or size string. Default: "clamp(4rem, 18vw, 16rem)" */
  fontSize?: string;
  /** Font weight of the letterforms. Default: 800 */
  fontWeight?: number | string;
  /** Font family for the letterforms. Default: "system-ui, -apple-system, sans-serif" */
  fontFamily?: string;
  /** Probability of each square flickering per second [0..1]. Default: 0.35 */
  flickerChance?: number;
  /** Size of each square grid cell in pixels. Default: 4 */
  squareSize?: number;
  /** Gap between adjacent grid squares in pixels. Default: 5 */
  gridGap?: number;
  /** Maximum opacity ceiling for the grid squares [0..1]. Default: 0.4 */
  maxOpacity?: number;
  /** Color of the grid squares. Default: "currentColor" */
  color?: string;
  /** ViewBox width for the SVG mask coordinate space. Default: 1000 */
  viewBoxWidth?: number;
  /** ViewBox height for the SVG mask coordinate space. Default: 260 */
  viewBoxHeight?: number;
  /** Whether to animate letters with a staggered entrance. Default: false */
  stagger?: boolean;
  /** Additional Tailwind CSS classes merged into container */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Self-Contained Color Parser & Canvas Grid Engine                   */
/* ------------------------------------------------------------------ */

function parseColorToRgbaPrefix(colorStr: string): string {
  if (typeof window === "undefined") {
    return "rgba(0, 0, 0, ";
  }

  // Fast-path for hex (#fff, #ffffff, #ffffff80)
  if (colorStr.startsWith("#")) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex.slice(0, 6), 16);
    if (!Number.isNaN(num)) {
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, `;
    }
  }

  // Fast-path for rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = colorStr.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, `;
  }

  // DOM 1x1 canvas fallback for named colors (e.g. "currentColor", "tomato")
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "rgba(0, 0, 0, ";
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${data[0]}, ${data[1]}, ${data[2]}, `;
  } catch {
    return "rgba(0, 0, 0, ";
  }
}

interface InternalGridCanvasProps {
  squareSize: number;
  gridGap: number;
  flickerChance: number;
  maxOpacity: number;
  color: string;
  className?: string;
}

/**
 * Self-contained canvas engine embedded directly within TextMaskGrid
 * so TextMaskGrid has 0 external file dependencies.
 */
function InternalGridCanvas({
  squareSize,
  gridGap,
  flickerChance,
  maxOpacity,
  color,
  className,
}: InternalGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColorPrefix = useMemo(() => {
    return parseColorToRgbaPrefix(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      if (w <= 0 || h <= 0) return null;
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const cellSize = squareSize + gridGap;
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      const stepChance = flickerChance * deltaTime;
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < stepChance) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity]
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, w, h);

      const cellSize = (squareSize + gridGap) * dpr;
      const size = squareSize * dpr;

      for (let i = 0; i < cols; i++) {
        const x = Math.floor(i * cellSize);
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          if (idx >= squares.length) continue;
          const opacity = squares[idx];
          ctx.fillStyle = `${memoizedColorPrefix}${opacity})`;
          const y = Math.floor(j * cellSize);
          ctx.fillRect(x, y, size, size);
        }
      }
    },
    [memoizedColorPrefix, squareSize, gridGap]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let gridParams: ReturnType<typeof setupCanvas> = null;

    const updateCanvasSize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth <= 0 || newHeight <= 0) return;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = performance.now();
    const animate = (time: number) => {
      if (!isInView || !gridParams) return;

      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    resizeObserver.observe(container);

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    if (isInView && gridParams) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [setupCanvas, updateSquares, drawGrid, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper Functions                                                   */
/* ------------------------------------------------------------------ */

function escapeSvgText(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ------------------------------------------------------------------ */
/* Main TextMaskGrid Component (100% Self-Contained)                  */
/* ------------------------------------------------------------------ */

export const TextMaskGrid: React.FC<TextMaskGridProps> = ({
  text = "Brand",
  fontSize = "clamp(4rem, 18vw, 16rem)",
  fontWeight = 800,
  fontFamily = "Inter Tight, system-ui, -apple-system, sans-serif",
  flickerChance = 0.35,
  squareSize = 4,
  gridGap = 5,
  maxOpacity = 0.4,
  color = "currentColor",
  viewBoxWidth = 1000,
  viewBoxHeight = 260,
  stagger = false,
  className,
  ...props
}) => {
  const [supportsMask, setSupportsMask] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Verify browser mask-image support
  useEffect(() => {
    if (typeof window !== "undefined" && typeof CSS !== "undefined") {
      const isSupported =
        CSS.supports("mask-image", "url(data:image/svg+xml;utf8,<svg></svg>)") ||
        CSS.supports("-webkit-mask-image", "url(data:image/svg+xml;utf8,<svg></svg>)") ||
        CSS.supports("mask-image", "none") ||
        CSS.supports("-webkit-mask-image", "none");
      setSupportsMask(isSupported);
    }
  }, []);

  /**
   * Generates an inline SVG <text> mask data URI.
   *
   * WHY THIS APPROACH:
   * 1. Vector Scalability: Scalable viewBox maintains crisp subpixel edges across any DPR without raster pixelation.
   * 2. Zero Network Overhead: Self-contained data URI requires no external image requests or font subsetting.
   * 3. Hardware-Accelerated: The GPU composite engine masks the HTML5 canvas layer in a single blend pass.
   * 4. Auto-Centering: Using text-anchor="middle" and dominant-baseline="central" ensures optical alignment.
   */
  const maskDataUri = useMemo(() => {
    const escaped = escapeSvgText(text);

    // Compute an optimal font-size in viewBox units so the text fits within the coordinate space
    const charCount = Math.max(text.length, 1);
    const approxCharWidthRatio = 0.62;
    const maxAvailableWidth = viewBoxWidth * 0.94;
    const computedSvgFontSize = Math.min(
      viewBoxHeight * 0.78,
      maxAvailableWidth / (charCount * approxCharWidthRatio)
    );

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${viewBoxWidth} ${viewBoxHeight}' width='100%' height='100%' preserveAspectRatio='xMidYMid meet'><text x='50%' y='52%' text-anchor='middle' dominant-baseline='central' font-size='${computedSvgFontSize}' font-weight='${fontWeight}' font-family='${fontFamily}' fill='white'>${escaped}</text></svg>`;

    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [text, fontWeight, fontFamily, viewBoxWidth, viewBoxHeight]);

  const maskStyles: React.CSSProperties = {
    WebkitMaskImage: maskDataUri,
    maskImage: maskDataUri,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  // Staggered letter container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: "blur(8px)",
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      role="img"
      aria-label={text}
      initial={
        shouldReduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.96, filter: "blur(12px)" }
      }
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.02,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden select-none",
        className
      )}
      {...(props as any)}
    >
      {/* ── Standard Single SVG Mask Mode (Recommended: 60-120 FPS) ── */}
      {!stagger && (
        <div
          style={supportsMask ? maskStyles : undefined}
          className="relative flex h-full w-full items-center justify-center"
        >
          {supportsMask ? (
            <div className="relative h-full w-full min-h-[140px] sm:min-h-[200px] md:min-h-[260px]">
              <InternalGridCanvas
                squareSize={squareSize}
                gridGap={gridGap}
                flickerChance={flickerChance}
                maxOpacity={maxOpacity}
                color={color}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            /* Fallback when mask-image is unsupported */
            <h1
              style={{ fontSize, fontWeight }}
              className="bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-center text-transparent dark:from-white dark:to-neutral-400"
            >
              {text}
            </h1>
          )}
        </div>
      )}

      {/* ── Optional Staggered Letter Entrance Mode ── */}
      {stagger && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center"
        >
          {text.split("").map((char, idx) => {
            if (char === " ") {
              return <span key={idx} className="w-4" />;
            }

            const charSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120' width='100%' height='100%' preserveAspectRatio='xMidYMid meet'><text x='50%' y='52%' text-anchor='middle' dominant-baseline='central' font-size='92' font-weight='${fontWeight}' font-family='${fontFamily}' fill='white'>${escapeSvgText(char)}</text></svg>`;
            const charMaskUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(charSvg)}")`;

            return (
              <motion.div
                key={idx}
                variants={letterVariants}
                className="relative inline-block overflow-hidden"
                style={{
                  width: "clamp(2.5rem, 8vw, 7rem)",
                  height: "clamp(3.5rem, 11vw, 9.5rem)",
                  WebkitMaskImage: charMaskUri,
                  maskImage: charMaskUri,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              >
                <InternalGridCanvas
                  squareSize={squareSize}
                  gridGap={gridGap}
                  flickerChance={flickerChance}
                  maxOpacity={maxOpacity}
                  color={color}
                  className="absolute inset-0 h-full w-full"
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextMaskGrid;
