"use client";

import React, { useEffect, useRef, useState } from "react";
import { CloudFog, Layers, Gauge, Droplets, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AtmosphericFogProps {
  /** Volumetric mist opacity and thickness (0.1 to 1.5) */
  density?: number;
  /** Drift velocity multiplier */
  speed?: number;
  /** Primary mist bank color in hex */
  fogColor?: string;
  /** Deep sky / background color in hex */
  backgroundColor?: string;
  /** Number of parallax mist octaves/layers (1 to 6) */
  layers?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [0.796, 0.835, 0.882];
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
uniform float u_density;
uniform float u_speed;
uniform vec3 u_fogColor;
uniform vec3 u_bgColor;
uniform float u_layers;
uniform vec2 u_pointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Interleaved gradient noise for filmic 8-bit anti-banding dithering
float ignDither(vec2 fragCoord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(fragCoord, magic.xy)));
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = rot * p * 2.03 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

float ridgeHeight(float x, float seed, float baseH, float amp) {
  float n1 = sin(x * 1.4 + seed) * 0.5 + cos(x * 2.7 - seed * 1.3) * 0.3;
  float n2 = noise(vec2(x * 3.2 + seed * 4.0, seed)) * 0.45;
  float n3 = noise(vec2(x * 7.5 - seed * 2.0, seed * 2.0)) * 0.18;
  return baseH + (n1 + n2 + n3) * amp;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.13 * u_speed;

  // Base twilight sky gradient with moonlit zenith & crepuscular light shafts
  vec3 zenith = u_bgColor * 0.68;
  vec3 horizon = mix(u_bgColor, u_fogColor * 0.42, 0.48);
  vec3 col = mix(horizon, zenith, pow(uv.y, 0.8));

  vec2 lightPos = vec2(aspect * 0.72, 0.82);
  float moonDist = length(p - lightPos);
  float moonHalo = exp(-moonDist * 2.6) * 0.34;
  col += u_fogColor * moonHalo;

  // Soft diagonal crepuscular light shafts radiating from the moonlit sky
  vec2 toLight = p - lightPos;
  float rayAngle = atan(toLight.y, toLight.x);
  float rays = sin(rayAngle * 14.0 + u_time * 0.15) * 0.5 + 0.5;
  rays *= sin(rayAngle * 23.0 - u_time * 0.1) * 0.5 + 0.5;
  float rayMask = exp(-moonDist * 1.45) * smoothstep(0.05, 0.85, uv.y);
  col += u_fogColor * rays * rayMask * 0.14 * u_density;

  // Interleave mountain valley ridges and domain-warped volumetric FBM mist banks
  // from back (i = 0, distant high ridge) to front (i = u_layers - 1, low foreground ridge)
  vec2 ptr = vec2(u_pointer.x * aspect, 1.0 - u_pointer.y);

  for (int i = 0; i < 6; i++) {
    if (float(i) >= u_layers) break;
    float layerIdx = float(i);
    float progress = layerIdx / max(u_layers - 1.0, 1.0);

    // 1. Render mountain/valley ridge silhouette for this depth plane
    float rBase = mix(0.48, 0.11, progress);
    float rAmp = mix(0.14, 0.06, progress);
    float rElev = ridgeHeight(p.x * (0.85 + layerIdx * 0.18), 1.7 + layerIdx * 3.9, rBase, rAmp);

    float ridgeMask = smoothstep(rElev + 0.006, rElev - 0.006, uv.y);
    // Distant ridges are hazier; near ridges are darker silhouettes
    vec3 ridgeTint = mix(
      mix(u_bgColor * 0.85, u_fogColor * 0.38, 0.45),
      u_bgColor * 0.32,
      progress
    );
    col = mix(col, ridgeTint, ridgeMask * 0.92);

    // 2. Render domain-warped FBM mist bank weaving over and along this valley ridge
    float depthScale = 1.0 + layerIdx * 0.48;
    float driftDir = mod(layerIdx, 2.0) == 0.0 ? 1.0 : -0.78;
    float layerSpeed = (0.35 + layerIdx * 0.24) * driftDir;

    vec2 lp = p * vec2(1.25 * depthScale, 2.2 * depthScale);
    lp.x += t * layerSpeed + layerIdx * 4.3;
    lp.y += sin(t * 0.28 + layerIdx) * 0.1;

    // Subtle pointer parting displacement
    float dPtr = length(p - ptr);
    lp += normalize(p - ptr + 0.001) * exp(-dPtr * 3.8) * 0.16;

    vec2 q = vec2(
      fbm(lp + vec2(0.0, 0.0) + 0.11 * t),
      fbm(lp + vec2(5.2, 1.3) - 0.09 * t)
    );
    vec2 r = vec2(
      fbm(lp + 2.6 * q + vec2(1.7, 9.2) + 0.14 * t),
      fbm(lp + 2.6 * q + vec2(8.3, 2.8) + 0.1 * t)
    );
    float fbmVal = fbm(lp + 2.1 * r);

    // Mist settles into the valley trough just around and below each ridge elevation
    float mistTop = rElev + 0.18;
    float mistBot = rElev - 0.26;
    float valleyEnvelope = smoothstep(mistTop, rElev - 0.02, uv.y) * smoothstep(mistBot, rElev + 0.04, uv.y);

    float billow = smoothstep(0.28, 0.8, fbmVal) * valleyEnvelope;
    float mistAlpha = clamp(billow * u_density * (0.52 - progress * 0.05), 0.0, 0.88);

    // Rim lighting on the top edge of the mist bank from the moonlit sky
    float topHighlight = smoothstep(rElev - 0.04, mistTop, uv.y) * fbmVal;
    vec3 mistLayerColor = mix(u_fogColor * 0.68, u_fogColor * 1.08, topHighlight);

    col = mix(col, mistLayerColor, mistAlpha);
  }

  // Deep valley floor ground mist
  float floorMist = smoothstep(0.22, 0.0, uv.y) * 0.34 * u_density;
  col = mix(col, u_fogColor * 0.82, clamp(floorMist, 0.0, 0.82));

  // Apply filmic interleaved gradient noise dithering to eliminate any 8-bit banding
  float dither = (ignDither(gl_FragCoord.xy) - 0.5) / 255.0;
  col += dither * 1.8;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const FOG_PRESETS = [
  { label: "Moonlit Slate", fog: "#CBD5E1", bg: "#090D16" },
  { label: "Nordic Pine", fog: "#99F6E4", bg: "#041318" },
  { label: "Crimson Dusk", fog: "#FDA4AF", bg: "#160712" },
  { label: "Golden Dawn", fog: "#FDE68A", bg: "#171008" },
];

export function AtmosphericFog({
  density = 0.7,
  speed = 1.0,
  fogColor = "#CBD5E1",
  backgroundColor = "#090D16",
  layers = 4,
  children,
  className,
}: AtmosphericFogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simDensity, setSimDensity] = useState(density);
  const [simSpeed, setSimSpeed] = useState(speed);
  const [simFogColor, setSimFogColor] = useState(fogColor);
  const [simBgColor, setSimBgColor] = useState(backgroundColor);
  const [simLayers, setSimLayers] = useState(layers);

  useEffect(() => setSimDensity(density), [density]);
  useEffect(() => setSimSpeed(speed), [speed]);
  useEffect(() => setSimFogColor(fogColor), [fogColor]);
  useEffect(() => setSimBgColor(backgroundColor), [backgroundColor]);
  useEffect(() => setSimLayers(layers), [layers]);

  const pointerRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const paramsRef = useRef({
    density: simDensity,
    speed: simSpeed,
    fogColor: simFogColor,
    bgColor: simBgColor,
    layers: simLayers,
  });

  useEffect(() => {
    paramsRef.current = {
      density: simDensity,
      speed: simSpeed,
      fogColor: simFogColor,
      bgColor: simBgColor,
      layers: simLayers,
    };
  }, [simDensity, simSpeed, simFogColor, simBgColor, simLayers]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
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

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uDensity = gl.getUniformLocation(program, "u_density");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uFogColor = gl.getUniformLocation(program, "u_fogColor");
    const uBgColor = gl.getUniformLocation(program, "u_bgColor");
    const uLayers = gl.getUniformLocation(program, "u_layers");
    const uPointer = gl.getUniformLocation(program, "u_pointer");

    const updateSize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.floor((container.clientWidth || 800) * dpr));
      const h = Math.max(1, Math.floor((container.clientHeight || 520) * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    let rafId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const p = paramsRef.current;
      const fogRgb = hexToRgbNormalized(p.fogColor);
      const bgRgb = hexToRgbNormalized(p.bgColor);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uDensity, p.density);
      gl.uniform1f(uSpeed, p.speed);
      gl.uniform3f(uFogColor, fogRgb[0], fogRgb[1], fogRgb[2]);
      gl.uniform3f(uBgColor, bgRgb[0], bgRgb[1], bgRgb[2]);
      gl.uniform1f(uLayers, p.layers);
      gl.uniform2f(uPointer, pointerRef.current.x, pointerRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / Math.max(rect.width, 1),
      y: (e.clientY - rect.top) / Math.max(rect.height, 1),
    };
  };

  const resetDefaults = () => {
    setSimDensity(density);
    setSimSpeed(speed);
    setSimFogColor(fogColor);
    setSimBgColor(backgroundColor);
    setSimLayers(layers);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#090D16] text-slate-100 select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:p-8">
          {/* Header & Telemetry */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/20 bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
                <CloudFog className="h-3.5 w-3.5 text-slate-300" />
                <span>Valley Ridge &amp; Volumetric FBM Shader</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Atmospheric Fog
              </h2>
              <p className="max-w-md text-xs text-slate-300/80 sm:text-sm">
                Domain-warped mist weaving between layered mountain valley
                ridges with crepuscular rays and filmic dithering.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs text-slate-300 backdrop-blur-md">
              <Layers className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-mono">{simLayers} RIDGES</span>
              <span className="text-white/20">|</span>
              <span className="font-mono">{Math.round(simDensity * 100)}% MIST</span>
            </div>
          </div>

          {/* Bottom Interactive HUD */}
          <div className="mt-auto flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/65 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {FOG_PRESETS.map((preset) => {
                const active =
                  simFogColor.toLowerCase() === preset.fog.toLowerCase();
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSimFogColor(preset.fog);
                      setSimBgColor(preset.bg);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                      active
                        ? "border-white/30 bg-white/15 text-white shadow-sm"
                        : "border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: preset.fog }}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-300">
                <Droplets className="h-3.5 w-3.5 text-slate-300" />
                <span>Density</span>
                <input
                  type="range"
                  min={0.15}
                  max={1.4}
                  step={0.05}
                  value={simDensity}
                  onChange={(e) => setSimDensity(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-slate-200"
                />
              </label>

              <label className="flex items-center gap-2 text-slate-300">
                <Gauge className="h-3.5 w-3.5 text-sky-300" />
                <span>Speed</span>
                <input
                  type="range"
                  min={0.1}
                  max={2.5}
                  step={0.1}
                  value={simSpeed}
                  onChange={(e) => setSimSpeed(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-sky-300"
                />
              </label>

              <label className="flex items-center gap-2 text-slate-300">
                <Layers className="h-3.5 w-3.5 text-indigo-300" />
                <span>Layers</span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={simLayers}
                  onChange={(e) => setSimLayers(Number(e.target.value))}
                  className="h-1.5 w-16 cursor-pointer accent-indigo-300"
                />
              </label>

              <button
                type="button"
                onClick={resetDefaults}
                title="Reset parameters"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AtmosphericFog;
