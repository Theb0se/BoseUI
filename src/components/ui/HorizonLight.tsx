"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

/**
 * Fragment Shader: Planetary Horizon Light & Volumetric Ember Corona
 *
 * Renders a physical curved planetary horizon limb with:
 * - Razor-sharp incandescent core along the curved horizon arc
 * - Volumetric atmospheric scatter rising above the horizon
 * - Subtle radial sunbeams / god-rays emanating from the horizon apex (interactive with pointer X/Y)
 * - Deep Warm Graphite eclipse occlusion (or warm architectural bone in light mode) below the horizon curve
 * - High-frequency optical dither to eliminate 8-bit gradient banding
 */
const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_lightMode;
  uniform float u_apexY;
  uniform float u_intensity;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_deepColor;
  uniform vec3 u_coreColor;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Quintic C2 interpolation for ultra-soft, crease-free volumetric transitions
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float softFbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    // 2 low-frequency octaves for wide, pillowy atmospheric light shafts
    for (int i = 0; i < 2; i++) {
      v += a * noise(p);
      p = rot * p * 1.65 + vec2(1.7, 9.2);
      a *= 0.45;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);

    // Normalized centered coordinates: x in [-aspect*0.5, aspect*0.5], y in [0, 1] (0 = bottom, 1 = top)
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);

    // Interactive pointer offset shifts the solar apex gently along the horizon
    float mouseShiftX = (u_mouse.x - 0.5) * 0.28 * aspect;
    float mouseLiftY = (u_mouse.y - 0.5) * 0.03;

    // Giant planetary circle centered far below the frame so its top arc forms the horizon line
    float radius = max(aspect * 1.45, 2.1);
    float apexY = u_apexY + mouseLiftY;
    vec2 planetCenter = vec2(0.0, apexY - radius);

    // Signed distance from planetary surface:
    // dist > 0.0 => sky/atmosphere above the horizon
    // dist == 0.0 => exact curved horizon rim
    // dist < 0.0 => planetary surface below the horizon
    vec2 toFrag = p - planetCenter;
    float dist = length(toFrag) - radius;

    // Horizontal distance from the solar apex (shifted slightly by pointer)
    float horizDist = (p.x - mouseShiftX * 0.35) / max(aspect * 0.55, 0.8);
    float centerFalloff = exp(-horizDist * horizDist * 1.85);
    float wideFalloff = exp(-horizDist * horizDist * 0.65);

    // Soft, wide-angle volumetric rays anchored deep below the horizon so atan() never pinches
    vec2 rayOrigin = vec2(mouseShiftX * 0.3, apexY - 0.65);
    vec2 rayDir = normalize(p - rayOrigin);
    float angle = atan(rayDir.x, max(rayDir.y, 0.15));

    // Combine gentle cosine lobes with low-frequency quintic noise for diffused, cloud-soft beams
    float primaryWave = sin(angle * 2.4 + u_time * 0.08) * 0.5 + 0.5;
    float secondaryWave = cos(angle * 4.1 - u_time * 0.05) * 0.5 + 0.5;
    float softNoise = softFbm(vec2(angle * 2.2 + u_time * 0.04, max(dist, 0.0) * 1.1 - u_time * 0.07));
    float rawRays = mix(primaryWave * 0.55 + secondaryWave * 0.45, softNoise, 0.5);
    float raySmooth = smoothstep(0.15, 0.85, rawRays);

    // Fade ray modulation smoothly away from the horizon limb so the core stays seamless
    float rayAltitudeFade = smoothstep(0.0, 0.16, max(dist, 0.0)) * smoothstep(0.65, 0.08, max(dist, 0.0));
    float rayMod = mix(1.0, mix(0.86, 1.16, raySmooth), rayAltitudeFade);

    // 1. Ultra-crisp horizon limb line (the glowing arc itself)
    float rimCore = exp(-abs(dist) * 140.0) * (0.35 + 0.95 * centerFalloff) * u_intensity;
    float rimTight = exp(-abs(dist) * 38.0) * (0.25 + 0.85 * centerFalloff) * u_intensity;

    // 2. Upper atmospheric scatter (rising above the horizon: dist > 0)
    float aboveMask = smoothstep(-0.02, 0.015, dist);
    float posDist = max(dist, 0.0);
    float innerCorona = exp(-posDist * 11.5) * centerFalloff * aboveMask * u_intensity;
    float midAtmosphere = exp(-posDist * 4.2) * wideFalloff * rayMod * aboveMask * u_intensity;
    float outerBloom = exp(-posDist * 1.85) * wideFalloff * rayMod * aboveMask * u_intensity;

    // 3. Sub-horizon inner planetary rim glow (subtle reflection below the arc: dist < 0)
    float belowMask = 1.0 - smoothstep(-0.005, 0.01, dist);
    float negDist = max(-dist, 0.0);
    float subHorizonGlow = exp(-negDist * 16.0) * (0.2 + 0.65 * centerFalloff) * belowMask * u_intensity;

    vec3 darkBg = vec3(0.047, 0.047, 0.043);      // #0c0c0b
    vec3 lightBg = vec3(0.957, 0.945, 0.918);     // #f4f1ea

    // Dark Mode composition: Eclipse planet with luminous corona
    vec3 darkCol = darkBg;
    darkCol += u_deepColor * outerBloom * 0.75;
    darkCol += u_primaryColor * midAtmosphere * 0.72;
    darkCol += u_secondaryColor * innerCorona * 0.68;
    darkCol += mix(u_primaryColor, u_secondaryColor, 0.5) * rimTight * 0.85;
    darkCol += u_coreColor * rimCore * 0.95;
    darkCol += mix(u_deepColor, u_primaryColor, 0.35) * subHorizonGlow * 0.45;

    // Light Mode composition: Warm architectural bone with crisp horizon illumination
    vec3 lightCol = lightBg;
    lightCol = mix(lightCol, vec3(1.0, 0.86, 0.76), outerBloom * 0.55);
    lightCol = mix(lightCol, u_secondaryColor, midAtmosphere * 0.38);
    lightCol = mix(lightCol, u_primaryColor, innerCorona * 0.42);
    lightCol = mix(lightCol, u_primaryColor, rimTight * 0.58);
    lightCol += vec3(1.0, 0.96, 0.90) * rimCore * 0.42;
    lightCol = mix(lightCol, vec3(0.92, 0.89, 0.84), belowMask * (1.0 - subHorizonGlow * 0.6) * 0.35);

    vec3 col = mix(darkCol, lightCol, u_lightMode);

    // Subtle edge vignette so the top corners stay clean for navbar & typography
    float topFade = smoothstep(0.98, 0.62, uv.y);
    col = mix(mix(darkBg, lightBg, u_lightMode), col, topFade);

    // High-frequency filmic grain dither to prevent 8-bit gradient banding
    float grain = (hash(gl_FragCoord.xy + fract(u_time) * 100.0) - 0.5) / 255.0;
    col += grain * 1.6;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
        .split("")
        .map((c) => c + c)
        .join("")
      : clean.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(num)) return [1.0, 0.302, 0.11];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export interface HorizonLightPreset {
  id: string;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  deepColor: string;
  coreColor: string;
}

export const HORIZON_LIGHT_PRESETS: HorizonLightPreset[] = [
  {
    id: "ember",
    label: "Vermilion Eclipse",
    primaryColor: "#FF4D1C",
    secondaryColor: "#FF8A3D",
    deepColor: "#6E1404",
    coreColor: "#FFF3E0",
  },
  {
    id: "cobalt",
    label: "Orbital Cobalt",
    primaryColor: "#2563EB",
    secondaryColor: "#38BDF8",
    deepColor: "#0B1D51",
    coreColor: "#F0F9FF",
  },
  {
    id: "emerald",
    label: "Solaris Borealis",
    primaryColor: "#10B981",
    secondaryColor: "#6EE7B7",
    deepColor: "#064E3B",
    coreColor: "#ECFDF5",
  },
  {
    id: "supernova",
    label: "Violet Supernova",
    primaryColor: "#9333EA",
    secondaryColor: "#F472B6",
    deepColor: "#3B0764",
    coreColor: "#FAF5FF",
  },
];

export interface HorizonLightProps {
  /** Primary atmospheric scatter color (default: "#FF4D1C" International Vermilion) */
  primaryColor?: string;
  /** Inner corona glow color (default: "#FF8A3D" Solar Amber) */
  secondaryColor?: string;
  /** Outer deep atmospheric bloom color (default: "#6E1404" Deep Crimson Ember) */
  deepColor?: string;
  /** Razor-sharp planetary limb core color (default: "#FFF3E0" Incandescent Core) */
  coreColor?: string;
  /** Vertical position of the planetary horizon apex (0.2 to 0.75, default: 0.43) */
  horizonHeight?: number;
  /** Overall corona and limb intensity multiplier (0.4 to 1.8, default: 1.0) */
  intensity?: number;
  /** Speed multiplier for volumetric FBM god-rays (default: 1.0) */
  speed?: number;
  /** Whether pointer X/Y gently shifts the solar apex along the curved limb */
  interactive?: boolean;
  /** Shader surface mode: "dark" (Warm Graphite eclipse), "light" (Architectural Bone), or "auto" */
  themeMode?: "dark" | "light" | "auto";
  /** Optional custom foreground content */
  children?: React.ReactNode;
  /** Additional container class names */
  className?: string;
}

export function HorizonLight({
  primaryColor = "#FF4D1C",
  secondaryColor = "#FF8A3D",
  deepColor = "#6E1404",
  coreColor = "#FFF3E0",
  horizonHeight = 0.43,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  themeMode = "dark",
  children,
  className,
}: HorizonLightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive HUD state for standalone demo preview
  const [activePresetId, setActivePresetId] = useState<string>("ember");
  const [localLightMode, setLocalLightMode] = useState<boolean>(
    themeMode === "light"
  );
  const [localApexY, setLocalApexY] = useState<number>(horizonHeight);

  useEffect(() => {
    setLocalApexY(horizonHeight);
  }, [horizonHeight]);

  useEffect(() => {
    if (themeMode !== "auto") {
      setLocalLightMode(themeMode === "light");
    }
  }, [themeMode]);

  const activePreset = HORIZON_LIGHT_PRESETS.find(
    (p) => p.id === activePresetId
  );

  const effectivePrimary =
    activePresetId === "ember"
      ? primaryColor
      : (activePreset?.primaryColor ?? primaryColor);
  const effectiveSecondary =
    activePresetId === "ember"
      ? secondaryColor
      : (activePreset?.secondaryColor ?? secondaryColor);
  const effectiveDeep =
    activePresetId === "ember"
      ? deepColor
      : (activePreset?.deepColor ?? deepColor);
  const effectiveCore =
    activePresetId === "ember"
      ? coreColor
      : (activePreset?.coreColor ?? coreColor);

  // Keep latest uniform values in a ref so the WebGL loop updates smoothly without recreating the context
  const uniformsRef = useRef({
    primary: hexToRgbNormalized(effectivePrimary),
    secondary: hexToRgbNormalized(effectiveSecondary),
    deep: hexToRgbNormalized(effectiveDeep),
    core: hexToRgbNormalized(effectiveCore),
    apexY: localApexY,
    intensity,
    speed,
    interactive,
    lightModeTarget: localLightMode ? 1.0 : 0.0,
  });

  useEffect(() => {
    uniformsRef.current = {
      primary: hexToRgbNormalized(effectivePrimary),
      secondary: hexToRgbNormalized(effectiveSecondary),
      deep: hexToRgbNormalized(effectiveDeep),
      core: hexToRgbNormalized(effectiveCore),
      apexY: localApexY,
      intensity,
      speed,
      interactive,
      lightModeTarget: localLightMode ? 1.0 : 0.0,
    };
  }, [
    effectivePrimary,
    effectiveSecondary,
    effectiveDeep,
    effectiveCore,
    localApexY,
    intensity,
    speed,
    interactive,
    localLightMode,
  ]);

  // Sync with document theme only when themeMode === "auto"
  useEffect(() => {
    if (themeMode !== "auto") return;
    const checkTheme = () => {
      const html = document.documentElement;
      const isLight =
        html.classList.contains("light") || !html.classList.contains("dark");
      setLocalLightMode(isLight);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [themeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uLightMode = gl.getUniformLocation(program, "u_lightMode");
    const uApexY = gl.getUniformLocation(program, "u_apexY");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uPrimary = gl.getUniformLocation(program, "u_primaryColor");
    const uSecondary = gl.getUniformLocation(program, "u_secondaryColor");
    const uDeep = gl.getUniformLocation(program, "u_deepColor");
    const uCore = gl.getUniformLocation(program, "u_coreColor");

    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas || !container) return;
      // Render at max 1.5x DPR for locked 60fps performance even on 4K displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize, { passive: true });

    // Smooth damped pointer tracking
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      if (!uniformsRef.current.interactive || !container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        targetMouse.x = nx;
        targetMouse.y = ny;
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId = 0;
    let currentLightMode = uniformsRef.current.lightModeTarget;
    let currentApex = uniformsRef.current.apexY;
    const startTime = performance.now();

    const render = (now: number) => {
      const cfg = uniformsRef.current;
      const elapsed = reducedMotion
        ? 0.0
        : ((now - startTime) * 0.001) * cfg.speed;

      // Damped spring interpolation for pointer & parameters
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.04;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.04;
      currentLightMode += (cfg.lightModeTarget - currentLightMode) * 0.08;
      currentApex += (cfg.apexY - currentApex) * 0.08;

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uLightMode, currentLightMode);
      gl.uniform1f(uApexY, currentApex);
      gl.uniform1f(uIntensity, cfg.intensity);
      gl.uniform3fv(uPrimary, cfg.primary);
      gl.uniform3fv(uSecondary, cfg.secondary);
      gl.uniform3fv(uDeep, cfg.deep);
      gl.uniform3fv(uCore, cfg.core);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl select-none flex flex-col justify-between",
        localLightMode ? "bg-[#f4f1ea] text-zinc-900" : "bg-[#0c0c0b] text-white",
        className
      )}
    >
      {/* WebGL Planetary Horizon Shader */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full block"
      />

      {/* Content Layer */}
      {children ? (
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-6 sm:p-10">
          {/* Top Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-widest border backdrop-blur-md",
                localLightMode
                  ? "bg-white/60 border-zinc-900/10 text-zinc-700"
                  : "bg-white/[0.04] border-white/10 text-zinc-300"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: effectivePrimary }}
              />
              GLSL Planetary Limb SDF · 4-Octave FBM
            </div>

            {/* Mode & Preset Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              {HORIZON_LIGHT_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePresetId(preset.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all border backdrop-blur-md",
                      isSelected
                        ? localLightMode
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                          : "bg-white text-zinc-950 border-white shadow-sm"
                        : localLightMode
                          ? "bg-white/60 text-zinc-700 border-zinc-900/10 hover:bg-white/90"
                          : "bg-black/40 text-zinc-300 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    {preset.label.split(" ")[1]}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setLocalLightMode((prev) => !prev)}
                className={cn(
                  "ml-1 rounded-full px-2.5 py-1 text-xs font-mono border backdrop-blur-md transition-colors",
                  localLightMode
                    ? "bg-zinc-900/10 border-zinc-900/15 text-zinc-800 hover:bg-zinc-900/15"
                    : "bg-white/10 border-white/15 text-zinc-200 hover:bg-white/15"
                )}
              >
                {localLightMode ? "Light Surface" : "Eclipse Dark"}
              </button>
            </div>
          </div>

          {/* Center Hero Copy */}
          <div className="my-auto py-12 text-center max-w-2xl mx-auto">
            <p
              className={cn(
                "text-xs font-mono uppercase tracking-[0.25em] mb-3",
                localLightMode ? "text-zinc-600" : "text-zinc-400"
              )}
            >
              Atmospheric Scatter &amp; Solar Corona
            </p>
            <h2
              className={cn(
                "text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08]",
                localLightMode ? "text-zinc-950" : "text-white"
              )}
            >
              Planetary horizon light with volumetric god-rays.
            </h2>
            <p
              className={cn(
                "mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed",
                localLightMode ? "text-zinc-700" : "text-zinc-300/85"
              )}
            >
              Move your pointer across the horizon arc to shift the solar apex
              in real time. Rendered via a signed-distance planetary sphere and
              8-bit dithered atmospheric bloom.
            </p>
          </div>

          {/* Bottom Horizon Elevation Scrubber */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div
              className={cn(
                "text-[11px] font-mono",
                localLightMode ? "text-zinc-600" : "text-zinc-400"
              )}
            >
              APEX ELEVATION:{" "}
              <span className="font-semibold">
                {Math.round(localApexY * 100)}%
              </span>
            </div>

            <div
              className={cn(
                "flex items-center gap-3 rounded-full px-3.5 py-1.5 border backdrop-blur-md",
                localLightMode
                  ? "bg-white/65 border-zinc-900/10"
                  : "bg-black/45 border-white/10"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-mono",
                  localLightMode ? "text-zinc-600" : "text-zinc-400"
                )}
              >
                Horizon Arc
              </span>
              <input
                type="range"
                min={0.25}
                max={0.68}
                step={0.01}
                value={localApexY}
                onChange={(e) => setLocalApexY(parseFloat(e.target.value))}
                aria-label="Horizon Apex Height"
                className="w-28 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorizonLight;
