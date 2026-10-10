"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flame, Sparkles, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LavaLampProps {
  /** Number of buoyant metaball wax blobs (3 to 12). Default: 7 */
  blobCount?: number;
  /** Core molten wax hex color. Default: "#FF3B00" */
  primaryColor?: string;
  /** Subsurface rim/highlight wax hex color. Default: "#FFB800" */
  secondaryColor?: string;
  /** Deep vessel background hex color. Default: "#0F071E" */
  backgroundColor?: string;
  /** Thermal buoyancy cycle speed multiplier. Default: 1.0 */
  speed?: number;
  /** Polynomial smooth-minimum (smin) surface tension blending factor (0.15 to 0.85). Default: 0.45 */
  viscosity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

function hexToRgbNorm(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      (parseInt(clean[0] + clean[0], 16) || 255) / 255,
      (parseInt(clean[1] + clean[1], 16) || 59) / 255,
      (parseInt(clean[2] + clean[2], 16) || 0) / 255,
    ];
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [1.0, 0.23, 0.0];
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
  uniform int u_blobCount;
  uniform float u_viscosity;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_bgColor;
  uniform vec2 u_pointer;
  // xy = position, z = radius, w = vertical stretch factor
  uniform vec4 u_blobs[12];

  // Polynomial smooth-minimum (Inigo Quilez smin) for liquid surface tension necking & merging
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / max(0.0001, k), 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sceneSDF(vec2 p) {
    float k = mix(0.07, 0.38, clamp(u_viscosity, 0.05, 0.95));
    float d = 10.0;

    for (int i = 0; i < 12; i++) {
      if (i >= u_blobCount) break;
      vec4 b = u_blobs[i];
      // Thermal vertical stretching/tear-drop deformation during ascent/descent
      vec2 delta = p - b.xy;
      delta.y /= b.w;
      float dist = (length(delta) - b.z) * min(1.0, b.w);
      d = smin(d, dist, k);
    }

    // Bottom incandescent heating coil wax reservoir pool
    float bottomMeniscus =
      (p.y + 0.56) +
      sin(p.x * 3.4 + u_time * 1.2) * 0.022 +
      cos(p.x * 5.8 - u_time * 0.85) * 0.012;
    d = smin(d, bottomMeniscus, k * 0.95);

    // Top cooler wax meniscus cap
    float topMeniscus = (0.58 - p.y) + sin(p.x * 3.1 - u_time * 0.9) * 0.016;
    d = smin(d, topMeniscus, k * 0.55);

    // Pointer thermal heat attractor blob
    float ptrDist = length(p - u_pointer) - 0.105;
    d = smin(d, ptrDist, k * 0.88);

    return d;
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / max(1.0, u_resolution.y), 1.0);
    vec2 p = (v_uv - 0.5) * aspect;

    float d = sceneSDF(p);

    // Finite-difference 2D gradient to reconstruct smooth 3D hemisphere normal
    float eps = 0.0028;
    vec2 grad = vec2(
      sceneSDF(p + vec2(eps, 0.0)) - sceneSDF(p - vec2(eps, 0.0)),
      sceneSDF(p + vec2(0.0, eps)) - sceneSDF(p - vec2(0.0, eps))
    ) / (2.0 * eps);

    // 1. Liquid suspension fluid & incandescent bottom heating coil illumination
    float bottomHeat = exp(-max(0.0, v_uv.y) * 2.6) * (0.85 + 0.15 * sin(u_time * 2.0));
    float centerColumn = exp(-pow((v_uv.x - 0.5) * 1.8, 2.0));
    vec3 col = u_bgColor;
    col += u_primaryColor * bottomHeat * 0.34;
    col += u_secondaryColor * pow(bottomHeat, 2.2) * centerColumn * 0.28;

    // Volumetric outer glow radiating from molten wax into the surrounding liquid
    float outerHalo = exp(-max(0.0, d) * 7.5);
    float innerHalo = exp(-max(0.0, d) * 22.0);
    col += u_primaryColor * outerHalo * 0.42;
    col += u_secondaryColor * innerHalo * 0.28;

    // 2. Inside the Molten Wax Metaballs: 3D Subsurface Scattering & Blinn-Phong Lighting
    if (d < 0.0) {
      // Optical thickness / core depth inside the wax blob
      float coreDepth = clamp(-d * 5.2, 0.0, 1.0);
      vec2 gClamped = clamp(grad * 0.62, -0.96, 0.96);
      float nz = sqrt(max(0.04, 1.0 - dot(gClamped, gClamped)));
      vec3 normal = normalize(vec3(-gClamped.x, -gClamped.y, nz));

      // Dual light sources: top-left key light + incandescent bottom thermal up-light
      vec3 keyLight = normalize(vec3(-0.38, 0.62, 0.68));
      vec3 bottomUpLight = normalize(vec3(0.0, -0.88, 0.47));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);

      float diffKey = max(0.0, dot(normal, keyLight));
      float diffBottom = max(0.0, dot(normal, bottomUpLight)) * (1.2 - v_uv.y * 0.7);
      float fresnel = pow(1.0 - max(0.0, normal.z), 2.6);

      // Blinn-Phong glossy specular highlights
      vec3 halfKey = normalize(keyLight + viewDir);
      vec3 halfBot = normalize(bottomUpLight + viewDir);
      float specKey = pow(max(0.0, dot(normal, halfKey)), 52.0);
      float specBot = pow(max(0.0, dot(normal, halfBot)), 24.0) * (1.0 - v_uv.y);

      // Internal thermal subsurface scattering:
      // Cooler outer skin (primaryColor) -> incandescent hot core & bottom-lit wax (secondaryColor -> white-hot)
      float thermalFactor = clamp(
        coreDepth * 0.68 + (1.0 - v_uv.y) * 0.42 + diffBottom * 0.45,
        0.0,
        1.0
      );
      vec3 waxCol = mix(u_primaryColor * 0.88, u_secondaryColor * 1.12, thermalFactor);

      // White-hot incandescent core inside thick wax regions near the heating coil
      float hotCore = pow(coreDepth, 2.2) * (1.15 - v_uv.y * 0.65);
      waxCol = mix(waxCol, vec3(1.0, 0.97, 0.86), clamp(hotCore * 0.58, 0.0, 0.75));

      // Translucent subsurface rim scattering where light grazes the wax skin
      waxCol = mix(waxCol, u_secondaryColor * 1.35, fresnel * 0.65);

      // Add 3D diffuse + crisp glassy specular highlights
      waxCol *= 0.82 + 0.25 * diffKey;
      waxCol += vec3(1.0, 0.96, 0.9) * (specKey * 0.72 + specBot * 0.35);

      // Smooth anti-aliased boundary transition
      float edgeMask = smoothstep(0.0, -0.006, d);
      col = mix(col, waxCol, edgeMask);
    }

    // 3. Cylindrical Glass Vessel Reflections & Edge Vignette
    float xFromCenter = abs(v_uv.x - 0.5) * 2.0;
    // Vertical glass highlight ribbons near left and right vessel curvature
    float glassSpecLeft = exp(-pow((v_uv.x - 0.11) * 28.0, 2.0)) * 0.11;
    float glassSpecRight = exp(-pow((v_uv.x - 0.89) * 34.0, 2.0)) * 0.08;
    col += vec3(0.9, 0.95, 1.0) * (glassSpecLeft + glassSpecRight) * (0.4 + 0.6 * v_uv.y);

    // Subtle cylindrical edge darkening
    float cylinderVig = 1.0 - 0.35 * pow(xFromCenter, 2.6);
    col *= cylinderVig;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

const LAVA_PRESETS = [
  {
    name: "Magma",
    primary: "#FF3B00",
    secondary: "#FFB800",
    bg: "#0F071E",
    viscosity: 0.45,
  },
  {
    name: "Cyber Acid",
    primary: "#10B981",
    secondary: "#A3E635",
    bg: "#041014",
    viscosity: 0.52,
  },
  {
    name: "Ultraviolet",
    primary: "#EC4899",
    secondary: "#38BDF8",
    bg: "#090418",
    viscosity: 0.42,
  },
];

export function LavaLamp({
  blobCount = 7,
  primaryColor = "#FF3B00",
  secondaryColor = "#FFB800",
  backgroundColor = "#0F071E",
  speed = 1.0,
  viscosity = 0.45,
  children,
  className,
}: LavaLampProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: -0.25,
    tx: 0,
    ty: -0.25,
  });

  const [liveCount, setLiveCount] = useState(blobCount);
  const [livePrimary, setLivePrimary] = useState(primaryColor);
  const [liveSecondary, setLiveSecondary] = useState(secondaryColor);
  const [liveBg, setLiveBg] = useState(backgroundColor);
  const [liveSpeed, setLiveSpeed] = useState(speed);
  const [liveViscosity, setLiveViscosity] = useState(viscosity);

  useEffect(() => setLiveCount(blobCount), [blobCount]);
  useEffect(() => setLivePrimary(primaryColor), [primaryColor]);
  useEffect(() => setLiveSecondary(secondaryColor), [secondaryColor]);
  useEffect(() => setLiveBg(backgroundColor), [backgroundColor]);
  useEffect(() => setLiveSpeed(speed), [speed]);
  useEffect(() => setLiveViscosity(viscosity), [viscosity]);

  const paramsRef = useRef({
    count: liveCount,
    primary: livePrimary,
    secondary: liveSecondary,
    bg: liveBg,
    speed: liveSpeed,
    viscosity: liveViscosity,
  });

  useEffect(() => {
    paramsRef.current = {
      count: liveCount,
      primary: livePrimary,
      secondary: liveSecondary,
      bg: liveBg,
      speed: liveSpeed,
      viscosity: liveViscosity,
    };
  }, [liveCount, livePrimary, liveSecondary, liveBg, liveSpeed, liveViscosity]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
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

    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uCountLoc = gl.getUniformLocation(program, "u_blobCount");
    const uViscLoc = gl.getUniformLocation(program, "u_viscosity");
    const uPrimLoc = gl.getUniformLocation(program, "u_primaryColor");
    const uSecLoc = gl.getUniformLocation(program, "u_secondaryColor");
    const uBgLoc = gl.getUniformLocation(program, "u_bgColor");
    const uPtrLoc = gl.getUniformLocation(program, "u_pointer");
    const uBlobsLoc = gl.getUniformLocation(program, "u_blobs");

    // Seed 12 thermal wax blob trajectories
    const blobSeeds = Array.from({ length: 12 }, (_, i) => ({
      phaseY: i * 1.15 + 0.4,
      phaseX: i * 2.05 + 1.1,
      freqY: 0.25 + (i % 4) * 0.08,
      freqX: 0.19 + (i % 3) * 0.07,
      baseRadius: 0.105 + (i % 4) * 0.025,
      spreadX: 0.16 + (i % 5) * 0.08,
    }));

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId = 0;
    let time = 0;
    const blobData = new Float32Array(48);

    const render = () => {
      const {
        count: curCount,
        primary: curPrimary,
        secondary: curSecondary,
        bg: curBg,
        speed: curSpeed,
        viscosity: curViscosity,
      } = paramsRef.current;

      time += 0.016 * curSpeed;
      const aspect = canvas.width / Math.max(1, canvas.height);

      // Smooth pointer thermal tracking
      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * 0.07;
      ptr.y += (ptr.ty - ptr.y) * 0.07;

      // Update thermal buoyancy wax blobs (dwell near bottom coil, stretch mid-column, cool & sink)
      for (let i = 0; i < 12; i++) {
        const s = blobSeeds[i];
        const cycle = time * s.freqY + s.phaseY;
        const sinC = Math.sin(cycle);
        const cosC = Math.cos(cycle);
        // Shaped thermal convection curve: lingers at bottom heater and top cooler
        const rawY = sinC + 0.24 * Math.sin(cycle * 2.0);
        const y = rawY * 0.39;
        const x =
          Math.sin(time * s.freqX + s.phaseX) *
          s.spreadX *
          Math.min(1.35, aspect * 0.72);
        const r = s.baseRadius * (0.92 + 0.14 * Math.cos(cycle * 1.5 + i));

        // Vertical stretch is strongest when rising/sinking rapidly through mid-vessel (|cosC| near 1),
        // and flattens into an oblate drop at the top/bottom turnaround points
        const verticalVelocity = Math.abs(cosC);
        const stretch = 0.84 + verticalVelocity * 0.42;

        blobData[i * 4] = x;
        blobData[i * 4 + 1] = y;
        blobData[i * 4 + 2] = r;
        blobData[i * 4 + 3] = stretch;
      }

      const [pr, pg, pb] = hexToRgbNorm(curPrimary);
      const [sr, sg, sb] = hexToRgbNorm(curSecondary);
      const [br, bg, bb] = hexToRgbNorm(curBg);

      gl.useProgram(program);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, time);
      gl.uniform1i(uCountLoc, Math.max(3, Math.min(12, Math.round(curCount))));
      gl.uniform1f(uViscLoc, curViscosity);
      gl.uniform3f(uPrimLoc, pr, pg, pb);
      gl.uniform3f(uSecLoc, sr, sg, sb);
      gl.uniform3f(uBgLoc, br, bg, bb);
      gl.uniform2f(uPtrLoc, ptr.x * aspect, ptr.y);
      gl.uniform4fv(uBlobsLoc, blobData);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = 0.5 - (e.clientY - rect.top) / Math.max(1, rect.height);
    pointerRef.current.tx = nx;
    pointerRef.current.ty = ny;
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0F071E] p-6 text-white shadow-2xl",
        className
      )}
    >
      <canvas
        ref={canvasRef}
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

export default LavaLamp;
