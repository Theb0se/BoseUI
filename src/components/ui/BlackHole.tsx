"use client";

import React, { useEffect, useRef, useState } from "react";
import { Orbit, Sparkles, Sliders, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlackHoleProps {
  /** Radius of the central event horizon void in pixels (default: 95) */
  size?: number;
  /** Primary color of the relativistic accretion disk (default: "#FF7A18") */
  diskColor?: string;
  /** Angular velocity multiplier for orbiting matter (default: 1.2) */
  spinSpeed?: number;
  /** Filament density / particle resolution in the accretion disk (default: 260) */
  particleCount?: number;
  /** Radial inward gravitational pull rate & spacetime curvature (default: 0.35) */
  pull?: number;
  /** Whether to enable full relativistic gravitational lensing ray bending (default: true) */
  lensing?: boolean;
  /** Optional overlay content rendered above the canvas */
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
  if (Number.isNaN(num)) return [1.0, 0.48, 0.09];
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
uniform float u_size;
uniform vec3 u_diskColor;
uniform float u_spinSpeed;
uniform float u_density;
uniform float u_pull;
uniform float u_lensing;
uniform vec2 u_pointer;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02 + vec2(13.4, 7.1);
    a *= 0.5;
  }
  return v;
}

// Starfield lookup on escaped ray direction
vec3 sampleStarfield(vec3 dir, float time) {
  vec2 uv = vec2(atan(dir.z, dir.x) * 1.5, dir.y * 3.0);
  vec2 grid = floor(uv * 28.0);
  vec2 f = fract(uv * 28.0) - 0.5;
  float rnd = hash21(grid);
  vec3 stars = vec3(0.0);

  if (rnd > 0.72) {
    vec2 offset = (vec2(hash21(grid + 1.3), hash21(grid + 7.9)) - 0.5) * 0.65;
    float d = length(f - offset);
    float twinkle = 0.7 + 0.3 * sin(time * (1.5 + rnd * 4.0) + rnd * 6.28);
    float star = smoothstep(0.18 * (rnd - 0.65), 0.0, d) * twinkle;
    float core = exp(-d * 38.0) * twinkle;
    vec3 tint = mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.9, 0.75), fract(rnd * 13.7));
    stars += tint * (star * 0.65 + core * 1.25);
  }

  // Subtle deep cosmic dust nebula
  float neb = fbm(uv * 1.6 + vec2(0.2, -0.1));
  stars += u_diskColor * pow(max(0.0, neb - 0.35), 2.4) * 0.14;
  return stars;
}

void main() {
  float minDim = min(u_resolution.x, u_resolution.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / minDim;

  // Map pixel size prop to normalized Schwarzschild horizon scale
  float rScale = clamp(u_size / (minDim * 0.24), 0.45, 1.55);
  uv /= rScale;

  // Camera setup with subtle orbital tilt and roll (Interstellar Gargantua framing)
  float rollAngle = -0.15 + u_pointer.x * 0.08;
  float cRoll = cos(rollAngle);
  float sRoll = sin(rollAngle);
  uv = mat2(cRoll, -sRoll, sRoll, cRoll) * uv;

  float camPitch = 0.145 + u_pointer.y * 0.06;
  vec3 ro = vec3(0.0, sin(camPitch) * 6.2, -cos(camPitch) * 6.2);
  vec3 forward = normalize(-ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 rd = normalize(forward * 1.75 + right * uv.x + up * uv.y);

  // Schwarzschild & Kerr relativistic ray marching parameters
  float rs = 0.52; // Event horizon radius
  float innerDisk = rs * 1.42; // ISCO (Innermost Stable Circular Orbit)
  float outerDisk = rs * 6.8;
  float gravStrength = mix(0.0, 0.195 * (0.75 + u_pull * 0.75), u_lensing);

  vec3 pos = ro;
  vec3 dir = rd;
  vec3 accumGlow = vec3(0.0);
  float transmittance = 1.0;
  bool hitHorizon = false;
  float minApproach = 100.0;

  // Geodesic light-bending integration loop
  for (int step = 0; step < 88; step++) {
    float r = length(pos);
    minApproach = min(minApproach, r);

    if (r < rs) {
      hitHorizon = true;
      break;
    }
    if (r > 9.5 && step > 18) {
      break;
    }

    // Adaptive step size: fine near photon sphere & equatorial plane, larger far away
    float distPlane = abs(pos.y);
    float dt = clamp(min(r - rs * 0.85, distPlane * 0.75 + 0.045) * 0.35, 0.025, 0.22);

    // Gravitational deflection acceleration (-1.5 * rs * L^2 / r^5 approximation)
    vec3 accel = -pos * (gravStrength / (r * r * r + 0.004));
    vec3 nextDir = normalize(dir + accel * dt);
    vec3 nextPos = pos + nextDir * dt;

    // Check if ray crosses or grazes the equatorial accretion disk slab
    float slabHalfHeight = 0.055 + 0.025 * smoothstep(innerDisk, outerDisk, r);
    if (min(abs(pos.y), abs(nextPos.y)) < slabHalfHeight || pos.y * nextPos.y <= 0.0) {
      float tCross = (pos.y * nextPos.y <= 0.0)
        ? clamp(abs(pos.y) / (abs(pos.y - nextPos.y) + 0.0001), 0.0, 1.0)
        : 0.5;
      vec3 hitPos = mix(pos, nextPos, tCross);
      float diskR = length(hitPos.xz);

      if (diskR > innerDisk && diskR < outerDisk) {
        float radialNorm = (diskR - innerDisk) / (outerDisk - innerDisk);
        float radialProfile = smoothstep(0.0, 0.09, radialNorm) *
                              pow(1.0 - radialNorm, 1.45);

        // Relativistic differential Keplerian rotation (omega ~ r^-1.5)
        float angle = atan(hitPos.z, hitPos.x);
        float omega = u_spinSpeed * 1.65 / pow(diskR, 1.15);
        float spiralPhase = angle + omega * u_time + (u_pull * 4.5) / (diskR + 0.15);

        // Multi-octave spiraling plasma filaments + fine rings
        float filamentScale = clamp(u_density / 260.0, 0.5, 2.0);
        vec2 polarUv = vec2(diskR * 5.5 * filamentScale - u_time * u_pull * 0.8, spiralPhase * 2.0);
        float n1 = fbm(polarUv);
        float n2 = fbm(vec2(diskR * 14.0 * filamentScale, spiralPhase * 4.0 - n1 * 2.2));
        float rings = 0.55 + 0.45 * sin(diskR * 36.0 * filamentScale + n1 * 5.0);
        float plasmaDensity = radialProfile * mix(n1, n2, 0.55) * rings;

        // Relativistic Doppler beaming & gravitational redshift
        vec3 tangentVel = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
        float beta = clamp(0.52 * sqrt(rs / diskR) * clamp(u_spinSpeed, 0.2, 2.5), 0.0, 0.72);
        float cosTheta = dot(nextDir, tangentVel);
        float doppler = 1.0 / max(0.28, 1.0 - beta * cosTheta);
        float beaming = pow(doppler, 2.65);

        // Temperature color gradient: white-hot ISCO + Doppler blueshift vs crimson outer redshift
        vec3 hotCore = vec3(1.0, 0.97, 0.90);
        vec3 midTone = u_diskColor;
        vec3 coolOuter = u_diskColor * vec3(0.65, 0.22, 0.08);

        float tempFactor = clamp((1.0 - radialNorm * 0.75) * pow(doppler, 0.85), 0.0, 1.6);
        vec3 localColor = mix(coolOuter, midTone, smoothstep(0.0, 0.65, tempFactor));
        localColor = mix(localColor, hotCore, smoothstep(0.65, 1.35, tempFactor));

        // Subtle blue-white shift on extreme approaching side
        localColor = mix(localColor, vec3(0.82, 0.93, 1.0), smoothstep(1.3, 1.9, doppler) * 0.35);

        float verticalFade = exp(-pow(hitPos.y / slabHalfHeight, 2.0) * 2.2);
        float stepEmission = plasmaDensity * verticalFade * beaming * 1.15;

        accumGlow += transmittance * localColor * stepEmission;
        transmittance *= exp(-plasmaDensity * verticalFade * 0.65);
      }
    }

    pos = nextPos;
    dir = nextDir;
  }

  vec3 finalColor = vec3(0.0);

  // Escaped rays sample the gravitationally lensed starfield
  if (!hitHorizon) {
    finalColor += transmittance * sampleStarfield(dir, u_time);
  }

  // Razor-sharp incandescent Photon Ring at the critical impact parameter
  float photonRingDist = abs(minApproach - rs * 1.045);
  float photonRing = exp(-photonRingDist * 46.0) * 1.35 + exp(-photonRingDist * 12.0) * 0.32;
  vec3 photonColor = mix(u_diskColor, vec3(1.0, 0.96, 0.86), 0.72);
  finalColor += photonColor * photonRing * (hitHorizon ? 0.45 : 1.0);

  // Add accumulated volumetric accretion disk & lensed upper/lower arches
  finalColor += accumGlow;

  // Ambient relativistic corona bloom
  float screenR = length(uv);
  float ambientCorona = exp(-max(0.0, screenR - rs * 0.9) * 2.1) * 0.16;
  finalColor += u_diskColor * ambientCorona;

  // ACES-inspired filmic tone mapping & gamma correction
  finalColor = (finalColor * (2.51 * finalColor + 0.03)) / (finalColor * (2.43 * finalColor + 0.59) + 0.14);
  finalColor = pow(clamp(finalColor, 0.0, 1.0), vec3(0.92));

  // Subtle dither to prevent 8-bit banding in deep space gradients
  finalColor += (hash21(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const PRESETS = [
  {
    name: "Gargantua",
    diskColor: "#FF7A18",
    size: 95,
    spinSpeed: 1.2,
    pull: 0.35,
    lensing: true,
  },
  {
    name: "Quasar Jet",
    diskColor: "#38BDF8",
    size: 85,
    spinSpeed: 1.85,
    pull: 0.55,
    lensing: true,
  },
  {
    name: "Crimson Singularity",
    diskColor: "#F43F5E",
    size: 105,
    spinSpeed: 0.9,
    pull: 0.25,
    lensing: true,
  },
] as const;

export function BlackHole({
  size = 95,
  diskColor = "#FF7A18",
  spinSpeed = 1.2,
  particleCount = 260,
  pull = 0.35,
  lensing = true,
  children,
  className,
}: BlackHoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeSize, setActiveSize] = useState(size);
  const [activeColor, setActiveColor] = useState(diskColor);
  const [activeSpin, setActiveSpin] = useState(spinSpeed);
  const [activePull, setActivePull] = useState(pull);
  const [activeLensing, setActiveLensing] = useState(lensing);
  const pointerRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });

  useEffect(() => {
    setActiveSize(size);
  }, [size]);
  useEffect(() => {
    setActiveColor(diskColor);
  }, [diskColor]);
  useEffect(() => {
    setActiveSpin(spinSpeed);
  }, [spinSpeed]);
  useEffect(() => {
    setActivePull(pull);
  }, [pull]);
  useEffect(() => {
    setActiveLensing(lensing);
  }, [lensing]);

  const paramsRef = useRef({
    size: activeSize,
    color: hexToNormalizedRgb(activeColor),
    spinSpeed: activeSpin,
    particleCount,
    pull: activePull,
    lensing: activeLensing ? 1.0 : 0.0,
  });

  useEffect(() => {
    paramsRef.current = {
      size: activeSize,
      color: hexToNormalizedRgb(activeColor),
      spinSpeed: activeSpin,
      particleCount,
      pull: activePull,
      lensing: activeLensing ? 1.0 : 0.0,
    };
  }, [activeSize, activeColor, activeSpin, particleCount, activePull, activeLensing]);

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
    const uSize = gl.getUniformLocation(program, "u_size");
    const uDiskColor = gl.getUniformLocation(program, "u_diskColor");
    const uSpinSpeed = gl.getUniformLocation(program, "u_spinSpeed");
    const uDensity = gl.getUniformLocation(program, "u_density");
    const uPull = gl.getUniformLocation(program, "u_pull");
    const uLensing = gl.getUniformLocation(program, "u_lensing");
    const uPointer = gl.getUniformLocation(program, "u_pointer");

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resizeCanvas = () => {
      if (!container || !canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(1, Math.floor((container.clientWidth || 800) * dpr));
      const h = Math.max(1, Math.floor((container.clientHeight || 520) * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    let rafId = 0;
    let accumTime = 0;
    let lastNow = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastNow) * 0.001);
      lastNow = now;
      accumTime += dt;

      const p = paramsRef.current;
      const ptr = pointerRef.current;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, accumTime);
      gl.uniform1f(uSize, p.size * dpr);
      gl.uniform3f(uDiskColor, p.color[0], p.color[1], p.color[2]);
      gl.uniform1f(uSpinSpeed, p.spinSpeed);
      gl.uniform1f(uDensity, p.particleCount);
      gl.uniform1f(uPull, p.pull);
      gl.uniform1f(uLensing, p.lensing);
      gl.uniform2f(uPointer, ptr.x, ptr.y);

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
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerRef.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    pointerRef.current.tx = 0;
    pointerRef.current.ty = 0;
  };

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#020308] text-white select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Subtle radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(2,3,8,0.72)_100%)]"
      />

      {children && (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      )}
    </div>
  );
}

export default BlackHole;
