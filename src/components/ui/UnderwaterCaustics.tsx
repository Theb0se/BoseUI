"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sun, Sparkles, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UnderwaterCausticsProps {
  /** Base underwater hex color. Default: "#0369A1" */
  waterColor?: string;
  /** Refracted cellular caustic light network brightness (0.2 to 2.0). Default: 1.0 */
  causticIntensity?: number;
  /** Animation speed multiplier. Default: 1.0 */
  speed?: number;
  /** Number of buoyant rising bubbles with horizontal sine wobble. Default: 35 */
  bubbleCount?: number;
  /** Render diagonal volumetric sunbeams from the water surface. Default: true */
  sunbeams?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      (parseInt(clean[0] + clean[0], 16) || 3) / 255,
      (parseInt(clean[1] + clean[1], 16) || 105) / 255,
      (parseInt(clean[2] + clean[2], 16) || 161) / 255,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [3 / 255, 105 / 255, 161 / 255];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_waterColor;
  uniform float u_intensity;
  uniform float u_sunbeams;

  // Dual-scale domain-warped cellular wave-interference caustic solver with sharp cusps
  float causticSolver(vec2 uv, float t) {
    vec2 p = mod(uv * 6.28318530718, 6.28318530718) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.0046;

    for (int n = 0; n < 5; n++) {
      float fn = float(n);
      float timeShift = t * (1.0 - (3.1 / (fn + 1.0)));
      i = p + vec2(
        cos(timeShift - i.x) + sin(timeShift + i.y),
        sin(timeShift - i.y) + cos(timeShift + i.x)
      );
      c += 1.0 / length(vec2(
        p.x / (sin(i.x + timeShift) / inten),
        p.y / (cos(i.y + timeShift) / inten)
      ));
    }

    c /= 5.0;
    c = 1.17 - pow(c, 1.42);
    return pow(abs(c), 8.5);
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / max(1.0, u_resolution.y), 1.0);
    // Perspective foreshortening + gentle underwater current refraction warp
    vec2 swellWarp = vec2(
      sin(v_uv.y * 5.0 + u_time * 0.7) * 0.012,
      cos(v_uv.x * 4.5 + u_time * 0.55) * 0.012
    );
    vec2 uv = (v_uv + swellWarp) * aspect;

    // Chromatic dispersion across RGB channels at sharp focal cusps
    vec2 disp = vec2(0.0045, 0.0022);
    float cR1 = causticSolver(uv * 0.92 + disp, u_time * 0.52);
    float cG1 = causticSolver(uv * 0.92, u_time * 0.52);
    float cB1 = causticSolver(uv * 0.92 - disp, u_time * 0.52);

    // Secondary finer interference harmonic layer
    float cG2 = causticSolver(uv * 1.65 + vec2(1.7, 2.3), -u_time * 0.38) * 0.45;

    vec3 causticLight = vec3(
      cR1 * 0.85 + cG2 * 0.6,
      cG1 * 1.04 + cG2 * 0.95,
      cB1 * 1.18 + cG2 * 1.1
    ) * u_intensity;

    // Marine depth gradient: sunlit turquoise surface (v_uv.y = 1) to deep abyssal floor (v_uv.y = 0)
    vec3 abyssColor = u_waterColor * 0.12 + vec3(0.005, 0.02, 0.05);
    vec3 midWater = u_waterColor * 0.58 + vec3(0.01, 0.09, 0.14);
    vec3 surfaceGlow = u_waterColor * 1.05 + vec3(0.12, 0.34, 0.42);

    vec3 col = mix(abyssColor, midWater, smoothstep(0.0, 0.65, v_uv.y));
    col = mix(col, surfaceGlow, pow(v_uv.y, 2.2));

    // Undulating surface shimmer near top edge
    float surfaceRipple = pow(v_uv.y, 5.5) * (0.6 + 0.4 * sin(uv.x * 14.0 + u_time * 1.8));
    col += vec3(0.55, 0.92, 1.0) * surfaceRipple * 0.32 * u_intensity;

    // Volumetric God-ray sunbeams angling down from the undulating surface
    if (u_sunbeams > 0.5) {
      float slantCoord = (uv.x - (1.0 - v_uv.y) * 0.42);
      float ray1 = 0.5 + 0.5 * sin(slantCoord * 11.0 + u_time * 0.42);
      float ray2 = 0.5 + 0.5 * cos(slantCoord * 19.0 - u_time * 0.58 + 1.2);
      float ray3 = 0.5 + 0.5 * sin(slantCoord * 31.0 + u_time * 0.85);
      float combinedRays = pow(ray1 * 0.55 + ray2 * 0.3 + ray3 * 0.15, 2.8);
      // Attenuate rays smoothly with depth
      float depthAtten = pow(v_uv.y, 1.25) * smoothstep(0.02, 0.95, v_uv.y);
      col += vec3(0.48, 0.92, 1.0) * combinedRays * depthAtten * 0.52 * u_intensity;
    }

    // Add refracted caustic network (brightest on the floor and near sunlit upper water)
    float causticMask = 0.55 + 0.45 * v_uv.y;
    col += causticLight * causticMask;

    // Subtle abyssal radial vignette
    float vig = smoothstep(1.18, 0.22, length(v_uv - vec2(0.5, 0.52)));
    col *= 0.68 + 0.32 * vig;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

interface Bubble {
  x: number;
  y: number;
  r: number;
  speed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
  opacity: number;
}

interface MarineSnow {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
}

const CAUSTIC_PRESETS = [
  { name: "Lagoon", color: "#0369A1", intensity: 1.05, beams: true },
  { name: "Cenote", color: "#0D9488", intensity: 1.25, beams: true },
  { name: "Abyssal", color: "#1E3A8A", intensity: 0.85, beams: false },
];

export function UnderwaterCaustics({
  waterColor = "#0369A1",
  causticIntensity = 1.0,
  speed = 1.0,
  bubbleCount = 35,
  sunbeams = true,
  children,
  className,
}: UnderwaterCausticsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleCanvasRef = useRef<HTMLCanvasElement>(null);

  const [liveColor, setLiveColor] = useState(waterColor);
  const [liveIntensity, setLiveIntensity] = useState(causticIntensity);
  const [liveSpeed, setLiveSpeed] = useState(speed);
  const [liveBubbles, setLiveBubbles] = useState(bubbleCount);
  const [liveSunbeams, setLiveSunbeams] = useState(sunbeams);

  useEffect(() => setLiveColor(waterColor), [waterColor]);
  useEffect(() => setLiveIntensity(causticIntensity), [causticIntensity]);
  useEffect(() => setLiveSpeed(speed), [speed]);
  useEffect(() => setLiveBubbles(bubbleCount), [bubbleCount]);
  useEffect(() => setLiveSunbeams(sunbeams), [sunbeams]);

  const paramsRef = useRef({
    color: liveColor,
    intensity: liveIntensity,
    speed: liveSpeed,
    bubbles: liveBubbles,
    sunbeams: liveSunbeams,
  });

  useEffect(() => {
    paramsRef.current = {
      color: liveColor,
      intensity: liveIntensity,
      speed: liveSpeed,
      bubbles: liveBubbles,
      sunbeams: liveSunbeams,
    };
  }, [liveColor, liveIntensity, liveSpeed, liveBubbles, liveSunbeams]);

  useEffect(() => {
    const container = containerRef.current;
    const glCanvas = glCanvasRef.current;
    const bubbleCanvas = bubbleCanvasRef.current;
    if (!container || !glCanvas || !bubbleCanvas) return;

    const gl = glCanvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    const ctx2d = bubbleCanvas.getContext("2d");

    const compileShader = (type: number, src: string) => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    let program: WebGLProgram | null = null;
    let uResLoc: WebGLUniformLocation | null = null;
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uColorLoc: WebGLUniformLocation | null = null;
    let uIntensityLoc: WebGLUniformLocation | null = null;
    let uSunbeamsLoc: WebGLUniformLocation | null = null;

    if (gl) {
      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          gl.useProgram(program);

          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );
          const posLoc = gl.getAttribLocation(program, "a_position");
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

          uResLoc = gl.getUniformLocation(program, "u_resolution");
          uTimeLoc = gl.getUniformLocation(program, "u_time");
          uColorLoc = gl.getUniformLocation(program, "u_waterColor");
          uIntensityLoc = gl.getUniformLocation(program, "u_intensity");
          uSunbeamsLoc = gl.getUniformLocation(program, "u_sunbeams");
        }
      }
    }

    let width = 1;
    let height = 1;
    let dpr = 1;
    const bubbles: Bubble[] = [];
    const snowParticles: MarineSnow[] = [];

    const initMarineSnow = () => {
      snowParticles.length = 0;
      for (let i = 0; i < 65; i++) {
        snowParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.7 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -0.12 - Math.random() * 0.25,
          alpha: 0.18 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const syncBubbles = (targetCount: number) => {
      while (bubbles.length < targetCount) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 2.2 + Math.random() * 7.5,
          speed: 0.55 + Math.random() * 1.45,
          wobbleAmp: 7 + Math.random() * 18,
          wobbleFreq: 1.4 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
      if (bubbles.length > targetCount) {
        bubbles.length = targetCount;
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      glCanvas.width = Math.floor(width * dpr);
      glCanvas.height = Math.floor(height * dpr);
      if (gl) {
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      }

      bubbleCanvas.width = Math.floor(width * dpr);
      bubbleCanvas.height = Math.floor(height * dpr);
      if (ctx2d) {
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      syncBubbles(paramsRef.current.bubbles);
      if (snowParticles.length === 0) initMarineSnow();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId = 0;
    let time = 0;

    const render = () => {
      const {
        color: curColor,
        intensity: curIntensity,
        speed: curSpeed,
        bubbles: curBubbles,
        sunbeams: curSunbeams,
      } = paramsRef.current;

      time += 0.016 * curSpeed;
      syncBubbles(curBubbles);

      // 1. Render WebGL Caustic + Volumetric Sunbeam Shader
      if (gl && program) {
        const [r, g, b] = hexToRgbNormalized(curColor);
        gl.useProgram(program);
        gl.uniform2f(uResLoc, glCanvas.width, glCanvas.height);
        gl.uniform1f(uTimeLoc, time);
        gl.uniform3f(uColorLoc, r, g, b);
        gl.uniform1f(uIntensityLoc, curIntensity);
        gl.uniform1f(uSunbeamsLoc, curSunbeams ? 1.0 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 2. Render suspended marine snow & 3D Fresnel glass bubbles on overlay 2D canvas
      if (ctx2d) {
        ctx2d.clearRect(0, 0, width, height);

        // Suspended marine snow / bioluminescent plankton micro-particles
        for (let i = 0; i < snowParticles.length; i++) {
          const sp = snowParticles[i];
          sp.x += sp.vx + Math.sin(time * 0.9 + sp.phase) * 0.18;
          sp.y += sp.vy * (0.6 + curSpeed * 0.4);
          if (sp.y < -5) sp.y = height + 5;
          if (sp.x < -5) sp.x = width + 5;
          if (sp.x > width + 5) sp.x = -5;

          const twinkle = 0.55 + 0.45 * Math.sin(time * 2.4 + sp.phase);
          ctx2d.fillStyle = `rgba(210, 248, 255, ${sp.alpha * twinkle})`;
          ctx2d.beginPath();
          ctx2d.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx2d.fill();
        }

        // 3D Glass-like rising bubbles with elliptical hydrodynamic wobble & Fresnel rim
        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          b.y -= b.speed * (0.65 + curSpeed * 0.55);
          if (b.y + b.r < -12) {
            b.y = height + b.r + Math.random() * 30;
            b.x = Math.random() * width;
          }

          const osc = time * b.wobbleFreq + b.phase;
          const bx = b.x + Math.sin(osc) * b.wobbleAmp;
          // Hydrodynamic oblate spheroid deformation as bubble rises
          const squash = 1 + Math.sin(osc * 2.1) * 0.11;
          const rx = b.r * squash;
          const ry = b.r / squash;

          // Internal Fresnel rim gradient (transparent core, glowing cyan/white rim)
          const bubGrad = ctx2d.createRadialGradient(
            bx - rx * 0.22,
            b.y - ry * 0.22,
            b.r * 0.1,
            bx,
            b.y,
            Math.max(rx, ry)
          );
          bubGrad.addColorStop(0, "rgba(255, 255, 255, 0.02)");
          bubGrad.addColorStop(0.68, `rgba(140, 230, 255, ${b.opacity * 0.18})`);
          bubGrad.addColorStop(0.92, `rgba(215, 250, 255, ${b.opacity * 0.65})`);
          bubGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx2d.save();
          ctx2d.beginPath();
          ctx2d.ellipse(bx, b.y, rx, ry, 0, 0, Math.PI * 2);
          ctx2d.fillStyle = bubGrad;
          ctx2d.fill();

          // Outer refractive glass contour
          ctx2d.strokeStyle = `rgba(225, 250, 255, ${b.opacity * 0.78})`;
          ctx2d.lineWidth = 1.0;
          ctx2d.stroke();

          // Secondary bottom-right internal caustic reflection arc
          ctx2d.beginPath();
          ctx2d.ellipse(
            bx,
            b.y,
            rx * 0.78,
            ry * 0.78,
            0,
            Math.PI * 0.15,
            Math.PI * 0.75
          );
          ctx2d.strokeStyle = `rgba(180, 245, 255, ${b.opacity * 0.55})`;
          ctx2d.lineWidth = Math.max(0.8, b.r * 0.14);
          ctx2d.stroke();

          // Primary crisp top-left specular highlight dot
          ctx2d.beginPath();
          ctx2d.ellipse(
            bx - rx * 0.36,
            b.y - ry * 0.36,
            Math.max(0.8, rx * 0.26),
            Math.max(0.6, ry * 0.18),
            -Math.PI * 0.25,
            0,
            Math.PI * 2
          );
          ctx2d.fillStyle = `rgba(255, 255, 255, ${Math.min(0.98, b.opacity * 1.55)})`;
          ctx2d.fill();
          ctx2d.restore();
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#02182B] p-6 text-white shadow-2xl",
        className
      )}
    >
      <canvas
        ref={glCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <canvas
        ref={bubbleCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children && (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

export default UnderwaterCaustics;
