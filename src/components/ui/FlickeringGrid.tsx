"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface FlickeringGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of each square grid cell in pixels. Default: 4 */
  squareSize?: number;
  /** Gap between adjacent grid squares in pixels. Default: 6 */
  gridGap?: number;
  /** Probability of each square updating its opacity per second. Default: 0.3 */
  flickerChance?: number;
  /** CSS color string for the grid squares. Default: "rgb(0, 0, 0)" */
  color?: string;
  /** Explicit fixed canvas width (optional; defaults to container width) */
  width?: number;
  /** Explicit fixed canvas height (optional; defaults to container height) */
  height?: number;
  /** Maximum opacity ceiling for the grid squares [0..1]. Default: 0.3 */
  maxOpacity?: number;
  /** Additional Tailwind CSS classes */
  className?: string;
}

/**
 * Fast, SSR-safe color parser converting hex, rgb, or color strings to an RGBA prefix "rgba(r, g, b, ".
 */
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

  // Fallback to DOM 1x1 canvas for named colors (e.g. "currentColor", "tomato", "blue")
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

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
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
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      if (newWidth <= 0 || newHeight <= 0) return;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = performance.now();
    const animate = (time: number) => {
      if (!isInView || !gridParams) return;

      const deltaTime = Math.min((time - lastTime) / 1000, 0.1); // clamp deltaTime to prevent huge jumps on tab resume
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
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full overflow-hidden", className)}
      {...props}
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
};

export default FlickeringGrid;
