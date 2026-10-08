"use client";

import React, { useEffect, useRef, useState } from "react";
import { Flame, Activity, Sliders, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SolarFlareProps {
  /** Incandescent core plasma color in hex (default: "#FFF7CC") */
  coreColor?: string;
  /** Primary coronal flare and chromosphere color in hex (default: "#FF5500") */
  flareColor?: string;
  /** Domain-warping FBM turbulence intensity (default: 1.0) */
  turbulence?: number;
  /** Plasma convection and flare animation speed multiplier (default: 1.0) */
  speed?: number;
  /** Intensity of coronal mass ejections and magnetic limb loops (default: 1.0) */
  eruptionIntensity?: number;
  /** Optional foreground content rendered over the solar surface */
  children?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

function hexToNormalizedRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "").trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned.padEnd(6, "0").slice(0, 6);
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [1.0, 0.33, 0.0];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_coreColor;
uniform vec3 u_flareColor;
uniform float u_turbulence;
uniform float u_eruption;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = rot * p * 2.03 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

// Voronoi cellular distance for realistic solar photosphere granulation
vec2 voronoiGranules(vec2 x, float time) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      o = 0.5 + 0.42 * sin(time * 0.85 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < d1) {
        d2 = d1;
        d1 = d;
      } else if (d < d2) {
        d2 = d;
      }
    }
  }
  return vec2(sqrt(d1), sqrt(d2));
}

// Compute a realistic sunspot with dark umbra, radial penumbra fibrils, and bright surrounding faculae
vec3 evaluateSunspot(vec2 sphereUv, vec2 spotCenter, float radius, float time) {
  vec2 delta = sphereUv - spotCenter;
  float dist = length(delta);
  float angle = atan(delta.y, delta.x);
  // Irregular warped boundary
  float warp = (noise(vec2(angle * 3.0, time * 0.15)) - 0.5) * radius * 0.28;
  float r = dist + warp;

  // Inner dark magnetic umbra
  float umbra = 1.0 - smoothstep(radius * 0.28, radius * 0.52, r);
  // Radial penumbra filaments surrounding umbra
  float fibrils = 0.5 + 0.5 * sin(angle * 28.0 + noise(delta * 18.0) * 4.5);
  float penumbraMask = smoothstep(radius * 0.35, radius * 0.55, r) *
                       (1.0 - smoothstep(radius * 0.65, radius * 1.15, r));
  float penumbra = penumbraMask * (0.45 + 0.45 * fibrils);

  // Bright magnetic plage / faculae ring outside penumbra
  float faculae = smoothstep(radius * 0.85, radius * 1.25, r) *
                  (1.0 - smoothstep(radius * 1.25, radius * 2.1, r)) *
                  fbm(sphereUv * 6.0);

  return vec3(umbra, penumbra, faculae);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // Position solar sphere slightly below center for dramatic coronal prominence headroom
  vec2 center = vec2(0.0, -0.05);
  vec2 p = uv - center;
  float r = length(p);
  float sunRadius = 0.37;
  float angle = atan(p.y, p.x);

  vec3 col = vec3(0.008, 0.009, 0.018);

  if (r < sunRadius) {
    // 3D Spherical normal projection of the solar photosphere
    float z = sqrt(max(0.0, sunRadius * sunRadius - r * r));
    vec3 normal = normalize(vec3(p.x, p.y, z));

    // Spherical latitude-longitude coordinates with differential solar rotation
    float lon = atan(normal.x, normal.z) + u_time * 0.095;
    float lat = asin(clamp(normal.y, -1.0, 1.0));
    vec2 sphereUv = vec2(lon, lat) * 3.2;

    // 1. Domain-Warped FBM + Voronoi Cellular Solar Granulation
    vec2 q = vec2(
      fbm(sphereUv + vec2(0.0, u_time * 0.2)),
      fbm(sphereUv + vec2(5.2, 1.3 - u_time * 0.16))
    );
    vec2 warpedUv = sphereUv + 1.35 * u_turbulence * (q - 0.5);

    vec2 vor = voronoiGranules(warpedUv * 4.2, u_time);
    // Bright convex granule centers separated by darker intergranular convection lanes
    float granuleCell = smoothstep(0.0, 0.22, vor.y - vor.x);
    float plasmaFbm = fbm(warpedUv * 2.4 + vec2(u_time * 0.12, -u_time * 0.08));
    float convection = mix(granuleCell, plasmaFbm, 0.52);

    // 2. Active Region Magnetic Sunspots (Umbra + Radial Penumbra Fibrils + Bright Faculae)
    vec3 spot1 = evaluateSunspot(warpedUv, vec2(0.45 + u_time * 0.095, 0.28), 0.42, u_time);
    vec3 spot2 = evaluateSunspot(warpedUv, vec2(-0.85 + u_time * 0.095, -0.35), 0.32, u_time);
    vec3 spot3 = evaluateSunspot(warpedUv, vec2(1.65 + u_time * 0.095, -0.18), 0.36, u_time);

    float totalUmbra = clamp(spot1.x + spot2.x + spot3.x, 0.0, 1.0);
    float totalPenumbra = clamp(spot1.y + spot2.y + spot3.y, 0.0, 1.0);
    float totalFaculae = clamp(spot1.z + spot2.z + spot3.z, 0.0, 1.0);

    // 3. Physical Eddington Spherical Limb Darkening & Chromospheric Rim Spicules
    float mu = clamp(normal.z, 0.0, 1.0);
    float limbDarkening = 0.32 + 0.68 * pow(mu, 0.48);
    float limbRimBoost = pow(1.0 - mu, 2.75);

    // Photosphere temperature color ramp
    vec3 deepChromosphere = u_flareColor * 0.22;
    vec3 midPhotosphere = u_flareColor * 1.05;
    vec3 brightGranule = u_coreColor * 1.25;

    vec3 surfaceCol = mix(deepChromosphere, midPhotosphere, smoothstep(0.12, 0.58, convection));
    surfaceCol = mix(surfaceCol, brightGranule, smoothstep(0.55, 0.92, convection * limbDarkening));

    // Apply physical limb darkening across the disc
    surfaceCol *= limbDarkening;

    // Brighten magnetic faculae networks (especially visible near the solar limb)
    float faculaeBoost = totalFaculae * (0.65 + 1.15 * (1.0 - mu));
    surfaceCol += u_coreColor * faculaeBoost * 0.85;

    // Darken radial penumbra filaments & deep magnetic umbra cores
    surfaceCol = mix(surfaceCol, u_flareColor * 0.32, totalPenumbra * 0.72);
    surfaceCol = mix(surfaceCol, vec3(0.03, 0.01, 0.005), totalUmbra * 0.92);

    // Incandescent chromospheric spicules & magnetic filaments right along the limb edge
    float spiculeNoise = fbm(vec2(angle * 24.0, u_time * 0.45));
    surfaceCol += mix(u_flareColor, u_coreColor, 0.65) * limbRimBoost * (0.45 + 0.55 * spiculeNoise);

    col = surfaceCol;
  } else {
    // 4. Exterior Coronal Magnetic Loops, Arched Prominences & Solar Wind Streamers
    float distFromLimb = r - sunRadius;

    // Arched magnetic flux loop geometry around the solar limb
    float loopFreq = angle * 5.0 + sin(distFromLimb * 18.0 - u_time * 0.9) * 0.45;
    float archEnvelope = pow(max(0.0, sin(loopFreq)), 3.0) * exp(-distFromLimb * 11.5);
    // Hollow magnetic arch core (bright along the loop arch, darker inside the arch)
    float archRing = exp(-pow((distFromLimb - 0.038 * (0.6 + 0.4 * sin(angle * 3.0 + u_time * 0.3))) * 28.0, 2.0));
    float magneticLoop = archEnvelope * (0.45 + 0.95 * archRing);

    // Turbulent plasma eruptions & coronal mass ejection plumes
    vec2 coronaCoord = vec2(angle * 3.8, distFromLimb * 8.5 - u_time * 0.62);
    float loopNoise = fbm(coronaCoord * u_turbulence);
    float loopArch = fbm(vec2(angle * 7.5 + sin(distFromLimb * 15.0), distFromLimb * 5.8 - u_time * 0.42));

    float prominence = (pow(max(0.0, loopNoise * loopArch * 1.72), 1.75) + magneticLoop * loopNoise * 1.4) * u_eruption;
    float falloff = exp(-distFromLimb * 6.8);
    float innerChromosphereRim = exp(-distFromLimb * 38.0);

    // Fine radial coronal helmet streamers extending into deep space
    float streamerNoise = fbm(vec2(angle * 16.0, distFromLimb * 1.8 - u_time * 0.2));
    float rays = pow(streamerNoise, 1.6) * exp(-distFromLimb * 3.6) * 0.55 * u_eruption;

    vec3 coronaGlow = u_flareColor * (falloff * 0.88 + prominence * falloff * 2.85 + rays);
    coronaGlow += u_coreColor * (innerChromosphereRim * 1.15 + prominence * exp(-distFromLimb * 13.0) * 1.45);

    col += coronaGlow;
  }

  // HDR ACES-inspired filmic tone mapping & anti-banding dither
  col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.92));
  col += (hash21(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

const SOLAR_PRESETS = [
  {
    name: "G-Type Photosphere",
    coreColor: "#FFF7CC",
    flareColor: "#FF5500",
    turbulence: 1.0,
    eruptionIntensity: 1.0,
  },
  {
    name: "Blue Hypergiant",
    coreColor: "#E0F2FE",
    flareColor: "#0284C7",
    turbulence: 1.35,
    eruptionIntensity: 1.4,
  },
  {
    name: "Red Magnetar",
    coreColor: "#FECDD3",
    flareColor: "#E11D48",
    turbulence: 1.5,
    eruptionIntensity: 1.65,
  },
] as const;

export function SolarFlare({
  coreColor = "#FFF7CC",
  flareColor = "#FF5500",
  turbulence = 1.0,
  speed = 1.0,
  eruptionIntensity = 1.0,
  children,
  className,
}: SolarFlareProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeCore, setActiveCore] = useState(coreColor);
  const [activeFlare, setActiveFlare] = useState(flareColor);
  const [activeTurb, setActiveTurb] = useState(turbulence);
  const [activeSpeed, setActiveSpeed] = useState(speed);
  const [activeEruption, setActiveEruption] = useState(eruptionIntensity);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setActiveCore(coreColor);
  }, [coreColor]);
  useEffect(() => {
    setActiveFlare(flareColor);
  }, [flareColor]);
  useEffect(() => {
    setActiveTurb(turbulence);
  }, [turbulence]);
  useEffect(() => {
    setActiveSpeed(speed);
  }, [speed]);
  useEffect(() => {
    setActiveEruption(eruptionIntensity);
  }, [eruptionIntensity]);

  const paramsRef = useRef({
    core: hexToNormalizedRgb(activeCore),
    flare: hexToNormalizedRgb(activeFlare),
    turbulence: activeTurb,
    speed: activeSpeed,
    eruption: activeEruption,
  });

  useEffect(() => {
    paramsRef.current = {
      core: hexToNormalizedRgb(activeCore),
      flare: hexToNormalizedRgb(activeFlare),
      turbulence: activeTurb,
      speed: activeSpeed,
      eruption: activeEruption,
    };
  }, [activeCore, activeFlare, activeTurb, activeSpeed, activeEruption]);

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

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

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

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uCoreColor = gl.getUniformLocation(program, "u_coreColor");
    const uFlareColor = gl.getUniformLocation(program, "u_flareColor");
    const uTurbulence = gl.getUniformLocation(program, "u_turbulence");
    const uEruption = gl.getUniformLocation(program, "u_eruption");

    const resize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.floor((container.clientWidth || 800) * dpr));
      const h = Math.max(1, Math.floor((container.clientHeight || 520) * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let rafId = 0;
    let accumTime = 0;
    let lastNow = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastNow) * 0.001);
      lastNow = now;
      const p = paramsRef.current;
      accumTime += dt * p.speed;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, accumTime);
      gl.uniform3f(uCoreColor, p.core[0], p.core[1], p.core[2]);
      gl.uniform3f(uFlareColor, p.flare[0], p.flare[1], p.flare[2]);
      gl.uniform1f(uTurbulence, p.turbulence);
      gl.uniform1f(uEruption, p.eruption);

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

  const handleReset = () => {
    setActiveCore(coreColor);
    setActiveFlare(flareColor);
    setActiveTurb(turbulence);
    setActiveSpeed(speed);
    setActiveEruption(eruptionIntensity);
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#040308] text-white select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {children ? (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col justify-between p-6 sm:p-8">
          {/* Top Solar Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/10 backdrop-blur-md">
                <Flame className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                    Heliosphere Observatory
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/35 bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                    <Activity className="h-2.5 w-2.5" /> Class X-{activeEruption.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-white/55">
                  Voronoi/FBM Photosphere &bull; Sunspot Penumbra &amp; Coronal Loops
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {SOLAR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setActiveCore(preset.coreColor);
                    setActiveFlare(preset.flareColor);
                    setActiveTurb(preset.turbulence);
                    setActiveEruption(preset.eruptionIntensity);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all backdrop-blur-md",
                    activeFlare.toLowerCase() === preset.flareColor.toLowerCase()
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/10 bg-black/40 text-white/65 hover:border-white/25 hover:text-white"
                  )}
                >
                  {preset.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setShowControls((v) => !v)}
                aria-label="Toggle solar flare shader parameters"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors backdrop-blur-md",
                  showControls
                    ? "border-orange-400/50 bg-orange-400/15 text-orange-300"
                    : "border-white/10 bg-black/40 text-white/75 hover:border-white/25 hover:text-white"
                )}
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Info & Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Coronal Mass Ejection
              </h2>
              <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
                Voronoi solar granulation, radial sunspot penumbrae, and arched
                magnetic flux prominences erupt across a limb-darkened
                photosphere.
              </p>
            </div>

            {showControls && (
              <div className="w-full max-w-xs space-y-3 rounded-xl border border-white/15 bg-black/65 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/85">
                    Magnetohydrodynamics
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Plasma Turbulence</span>
                    <span>{activeTurb.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={2.2}
                    step={0.05}
                    value={activeTurb}
                    onChange={(e) => setActiveTurb(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-orange-400"
                  />
                </label>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Eruption Intensity</span>
                    <span>{activeEruption.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={2.5}
                    step={0.05}
                    value={activeEruption}
                    onChange={(e) => setActiveEruption(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-orange-400"
                  />
                </label>

                <label className="block space-y-1 text-xs">
                  <div className="flex justify-between text-white/65">
                    <span>Convection Speed</span>
                    <span>{activeSpeed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={2.5}
                    step={0.05}
                    value={activeSpeed}
                    onChange={(e) => setActiveSpeed(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-orange-400"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SolarFlare;
