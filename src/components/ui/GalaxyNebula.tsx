"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalaxyNebulaProps {
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
  /** Spiral rotation speed. Default: 0.25 */
  rotationSpeed?: number;
  /** Primary nebula core hex color. Default: "#8B5CF6" */
  primaryColor?: string;
  /** Secondary outer dust hex color. Default: "#06B6D4" */
  secondaryColor?: string;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean, 16) || 0;
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_rotSpeed;
  uniform vec3 u_color1;
  uniform vec3 u_color2;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Spiral arm twist + slow rotation
    float swirl = angle + r * 3.2 - u_time * u_rotSpeed;
    vec2 spiralUv = vec2(cos(swirl), sin(swirl)) * r * 2.4;

    float n1 = fbm(spiralUv + u_time * 0.08);
    float n2 = fbm(spiralUv * 1.8 - u_time * 0.05 + n1);

    float nebulaMask = smoothstep(0.95, 0.05, r) * (n1 * 0.65 + n2 * 0.55);
    float coreGlow = exp(-r * 4.2);

    vec3 col = mix(vec3(0.02, 0.02, 0.05), u_color2, nebulaMask);
    col = mix(col, u_color1, clamp(n2 * nebulaMask * 1.4, 0.0, 1.0));
    col += vec3(1.0, 0.96, 0.9) * coreGlow * 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GalaxyNebula({
  speed = 1,
  rotationSpeed = 0.25,
  primaryColor = "#8B5CF6",
  secondaryColor = "#06B6D4",
  children,
  className,
}: GalaxyNebulaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preset, setPreset] = useState<"Andromeda" | "Orion" | "Supernova">(
    "Andromeda"
  );

  const palettes = {
    Andromeda: { c1: primaryColor, c2: secondaryColor },
    Orion: { c1: "#EC4899", c2: "#6366F1" },
    Supernova: { c1: "#F97316", c2: "#8B5CF6" },
  };

  const activePalette = palettes[preset];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRot = gl.getUniformLocation(prog, "u_rotSpeed");
    const uCol1 = gl.getUniformLocation(prog, "u_color1");
    const uCol2 = gl.getUniformLocation(prog, "u_color2");

    const rgb1 = hexToRgbNormalized(activePalette.c1);
    const rgb2 = hexToRgbNormalized(activePalette.c2);

    let rafId: number;
    const start = performance.now();

    const render = (now: number) => {
      const w = (canvas.width = canvas.offsetWidth || 600);
      const h = (canvas.height = canvas.offsetHeight || 360);
      gl.viewport(0, 0, w, h);

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, ((now - start) * 0.001) * speed);
      gl.uniform1f(uRot, rotationSpeed);
      gl.uniform3f(uCol1, rgb1[0], rgb1[1], rgb1[2]);
      gl.uniform3f(uCol2, rgb2[0], rgb2[1], rgb2[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [speed, rotationSpeed, activePalette.c1, activePalette.c2]);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#05050D] p-6 text-white shadow-sm",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                WebGL FBM Nebula
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
                {(["Andromeda", "Orion", "Supernova"] as const).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setPreset(name)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors",
                      preset === name
                        ? "bg-white text-black"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                Spiral Galaxy & FBM Nebula
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                Real-time WebGL fragment shader computing 5-octave Fractional
                Brownian Motion (<code className="font-mono">fbm</code>) with
                polar spiral distortion.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/55">
              GLSL Fragment Shader · 5-Octave FBM Noise · Spiral Swirl
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GalaxyNebula;
