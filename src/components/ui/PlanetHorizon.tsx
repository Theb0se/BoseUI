"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Sun, Play, Pause, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanetHorizonProps {
  /** Primary glow color of the planetary atmospheric limb (default: "#38BDF8") */
  atmosphereColor?: string;
  /** Core highlight color of the cresting orbital sun flare (default: "#FDE047") */
  flareColor?: string;
  /** Normalized position of the solar flare along the horizon arc from 0 to 1 (default: 0.5) */
  flarePosition?: number;
  /** Whether the solar flare automatically orbits along the planetary limb (default: true) */
  autoplay?: boolean;
  /** Number of twinkling background stars in upper space (default: 140) */
  starDensity?: number;
  /** Optional foreground content rendered over the horizon scene */
  children?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  speed: number;
  phase: number;
  tint: string;
}

interface CityHub {
  /** Angle offset from top of planet sphere (-0.38 to +0.38 rad) */
  angle: number;
  /** Radial depth inward from the planetary horizon limb (0.015 to 0.22 of planetRadius) */
  depthFrac: number;
  size: number;
  intensity: number;
  satellites: Array<{ dx: number; dy: number; r: number; alpha: number }>;
  links: number[];
}

interface CloudBand {
  angle: number;
  depthFrac: number;
  arcSpan: number;
  thickness: number;
  alpha: number;
  speed: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "").trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned.padEnd(6, "0").slice(0, 6);
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 56, g: 189, b: 248 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

const HORIZON_PRESETS = [
  {
    name: "ISS Terra Dawn",
    atmosphereColor: "#38BDF8",
    flareColor: "#FDE047",
  },
  {
    name: "Exoplanet Violet",
    atmosphereColor: "#A855F7",
    flareColor: "#F472B6",
  },
  {
    name: "Martian Amber",
    atmosphereColor: "#F97316",
    flareColor: "#FEF08A",
  },
] as const;

export function PlanetHorizon({
  atmosphereColor = "#38BDF8",
  flareColor = "#FDE047",
  flarePosition = 0.5,
  autoplay = true,
  starDensity = 140,
  children,
  className,
}: PlanetHorizonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeAtmoColor, setActiveAtmoColor] = useState(atmosphereColor);
  const [activeFlareColor, setActiveFlareColor] = useState(flareColor);
  const [activeFlarePos, setActiveFlarePos] = useState(flarePosition);
  const [isAutoplay, setIsAutoplay] = useState(autoplay);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setActiveAtmoColor(atmosphereColor);
  }, [atmosphereColor]);
  useEffect(() => {
    setActiveFlareColor(flareColor);
  }, [flareColor]);
  useEffect(() => {
    setActiveFlarePos(flarePosition);
  }, [flarePosition]);
  useEffect(() => {
    setIsAutoplay(autoplay);
  }, [autoplay]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const tints = ["#FFFFFF", "#E0F2FE", "#FEF3C7", "#DDD6FE", "#BAE6FD"];
    const count = Math.max(20, Math.min(400, starDensity));
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random() * 0.84,
      radius: 0.35 + Math.random() * 1.35,
      baseAlpha: 0.25 + Math.random() * 0.75,
      speed: 0.6 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      tint: tints[Math.floor(Math.random() * tints.length)],
    }));

    // Generate realistic night-side metropolitan hubs & spiderweb highway corridors
    const hubCount = 26;
    const cityHubs: CityHub[] = Array.from({ length: hubCount }, (_, i) => {
      const spread = (i / (hubCount - 1) - 0.5) * 0.66 + (Math.random() - 0.5) * 0.04;
      const depthFrac = 0.014 + Math.pow(Math.random(), 1.35) * 0.16;
      const satCount = 8 + Math.floor(Math.random() * 12);
      const satellites = Array.from({ length: satCount }, () => {
        const a = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 1.6) * 28;
        return {
          dx: Math.cos(a) * dist * 1.35,
          dy: Math.sin(a) * dist * 0.65,
          r: 0.5 + Math.random() * 1.15,
          alpha: 0.3 + Math.random() * 0.7,
        };
      });
      return {
        angle: -Math.PI / 2 + spread,
        depthFrac,
        size: 1.6 + Math.random() * 2.2,
        intensity: 0.55 + Math.random() * 0.45,
        satellites,
        links: [],
      };
    });

    // Connect nearby metropolitan hubs into realistic highway/rail spiderwebs
    for (let i = 0; i < cityHubs.length; i++) {
      for (let j = i + 1; j < cityHubs.length; j++) {
        const dAngle = Math.abs(cityHubs[i].angle - cityHubs[j].angle);
        const dDepth = Math.abs(cityHubs[i].depthFrac - cityHubs[j].depthFrac);
        if (dAngle < 0.085 && dDepth < 0.065 && cityHubs[i].links.length < 3) {
          cityHubs[i].links.push(j);
        }
      }
    }

    // Generate atmospheric cloud wisps drifting over the planetary curvature
    const cloudBands: CloudBand[] = Array.from({ length: 18 }, () => ({
      angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.72,
      depthFrac: 0.004 + Math.random() * 0.14,
      arcSpan: 0.03 + Math.random() * 0.065,
      thickness: 6 + Math.random() * 16,
      alpha: 0.08 + Math.random() * 0.14,
      speed: 0.002 + Math.random() * 0.004,
    }));

    // Hexagonal camera aperture vertices
    const drawHexagon = (
      cx: number,
      cy: number,
      radius: number,
      rot: number,
      fill: string | CanvasGradient,
      stroke?: string
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * Math.PI * 2;
        const hx = Math.cos(a) * radius;
        const hy = Math.sin(a) * radius;
        if (s === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };

    let rafId = 0;
    let time = 0;

    const render = () => {
      time += 0.012;
      const atmoRgb = hexToRgb(activeAtmoColor);
      const sunRgb = hexToRgb(activeFlareColor);

      // Deep orbital space background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#010206");
      bgGrad.addColorStop(0.5, "#030610");
      bgGrad.addColorStop(1, "#060B18");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Planetary sphere geometry (giant curved Earth limb anchored below viewport)
      const planetRadius = Math.max(width, height) * 1.58;
      const planetCx = width * 0.5;
      const horizonApexY = height * 0.6;
      const planetCy = horizonApexY + planetRadius;

      // Compute solar flare angle along the visible upper arc of the planet
      const halfSpanAngle = Math.asin(
        Math.min(0.95, (width * 0.46) / planetRadius)
      );
      const normalizedPos = isAutoplay
        ? 0.5 + 0.36 * Math.sin(time * 0.42)
        : Math.max(0, Math.min(1, activeFlarePos));

      const sunAngle =
        -Math.PI / 2 + (normalizedPos - 0.5) * 2 * halfSpanAngle;
      // Subtle vertical cresting oscillation so the sun peeks slightly above the limb at zenith
      const crestElevation = Math.cos((normalizedPos - 0.5) * Math.PI) * 5;
      const sunX = planetCx + Math.cos(sunAngle) * (planetRadius + crestElevation);
      const sunY = planetCy + Math.sin(sunAngle) * (planetRadius + crestElevation);
      const crestIntensity = 0.78 + 0.22 * Math.cos((normalizedPos - 0.5) * Math.PI);

      // Draw twinkling starfield above the planet limb (fading near solar glare)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = s.x * width;
        const sy = s.y * height;

        const distToCenter = Math.hypot(sx - planetCx, sy - planetCy);
        if (distToCenter < planetRadius - 2) continue;

        const distToSun = Math.hypot(sx - sunX, sy - sunY);
        const glareSuppression = Math.min(1, distToSun / 240);
        const twinkle = 0.6 + 0.4 * Math.sin(time * s.speed + s.phase);

        ctx.globalAlpha = s.baseAlpha * twinkle * glareSuppression;
        ctx.fillStyle = s.tint;
        ctx.beginPath();
        ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 1. Multi-Wavelength Rayleigh Atmospheric Scattering (Exosphere -> Mesosphere -> Stratosphere -> Troposphere)
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // Deep Cobalt Upper Mesosphere & Thermosphere Halo
      const mesosphereGrad = ctx.createRadialGradient(
        planetCx,
        planetCy,
        planetRadius * 0.985,
        planetCx,
        planetCy,
        planetRadius * 1.095
      );
      mesosphereGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      mesosphereGrad.addColorStop(
        0.14,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.72)`
      );
      mesosphereGrad.addColorStop(
        0.38,
        `rgba(${Math.round(atmoRgb.r * 0.35)}, ${Math.round(
          atmoRgb.g * 0.55
        )}, 245, 0.38)`
      );
      mesosphereGrad.addColorStop(0.72, "rgba(15, 40, 120, 0.12)");
      mesosphereGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = mesosphereGrad;
      ctx.beginPath();
      ctx.arc(planetCx, planetCy, planetRadius * 1.095, 0, Math.PI * 2);
      ctx.fill();

      // Localized Solar Terminator Rayleigh Spectrum (Warm Amber/Gold Troposphere -> Cyan Stratosphere -> Cobalt)
      const terminatorRadius = Math.max(width, height) * 0.62;
      const terminatorScatter = ctx.createRadialGradient(
        sunX,
        sunY,
        4,
        sunX,
        sunY,
        terminatorRadius
      );
      terminatorScatter.addColorStop(
        0,
        `rgba(255, 250, 230, ${(0.75 * crestIntensity).toFixed(3)})`
      );
      terminatorScatter.addColorStop(
        0.12,
        `rgba(${sunRgb.r}, ${sunRgb.g}, ${sunRgb.b}, ${(0.58 * crestIntensity).toFixed(3)})`
      );
      terminatorScatter.addColorStop(
        0.28,
        `rgba(249, 115, 22, ${(0.32 * crestIntensity).toFixed(3)})`
      );
      terminatorScatter.addColorStop(
        0.52,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.24)`
      );
      terminatorScatter.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = terminatorScatter;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Planetary Sphere Body, Night-Side City Networks & Terminator Cloud Wisps
      ctx.save();
      ctx.beginPath();
      ctx.arc(planetCx, planetCy, planetRadius, 0, Math.PI * 2);
      ctx.clip();

      // Base planetary surface gradient (sunlit terminator twilight vs deep night side)
      const bodyGrad = ctx.createRadialGradient(
        sunX,
        sunY + 30,
        planetRadius * 0.02,
        planetCx,
        planetCy,
        planetRadius
      );
      bodyGrad.addColorStop(
        0,
        `rgba(${Math.round(atmoRgb.r * 0.35 + sunRgb.r * 0.15)}, ${Math.round(
          atmoRgb.g * 0.38 + sunRgb.g * 0.12
        )}, ${Math.round(atmoRgb.b * 0.45)}, 1)`
      );
      bodyGrad.addColorStop(0.18, "#09152B");
      bodyGrad.addColorStop(0.45, "#040814");
      bodyGrad.addColorStop(1, "#020308");

      ctx.fillStyle = bodyGrad;
      ctx.fillRect(0, horizonApexY - 10, width, height - horizonApexY + 20);

      // Compute screen positions for night-side city hubs & render spiderweb highways
      const hubPositions = cityHubs.map((hub) => {
        const r = planetRadius * (1 - hub.depthFrac);
        const rotAngle = hub.angle + Math.sin(time * 0.08) * 0.02;
        const hx = planetCx + Math.cos(rotAngle) * r;
        const hy = planetCy + Math.sin(rotAngle) * r;
        // Fade out city lights where sunlight illuminates the terminator
        const distFromSun = Math.hypot(hx - sunX, hy - sunY);
        const nightFactor = Math.max(
          0,
          Math.min(1, (distFromSun - 110) / 210)
        );
        // Perspective foreshortening near the curved limb
        const limbForeshorten = Math.min(1, hub.depthFrac * 18);
        return { hx, hy, nightFactor, limbForeshorten, hub };
      });

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Draw interconnecting spiderweb highway tendrils
      for (let i = 0; i < hubPositions.length; i++) {
        const p1 = hubPositions[i];
        if (p1.nightFactor <= 0.05) continue;

        for (const targetIdx of p1.hub.links) {
          const p2 = hubPositions[targetIdx];
          const linkAlpha =
            Math.min(p1.nightFactor, p2.nightFactor) * 0.24 * p1.hub.intensity;
          if (linkAlpha <= 0.02) continue;

          ctx.strokeStyle = `rgba(251, 191, 36, ${linkAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          const midX = (p1.hx + p2.hx) * 0.5;
          const midY = (p1.hy + p2.hy) * 0.5 - 4;
          ctx.moveTo(p1.hx, p1.hy);
          ctx.quadraticCurveTo(midX, midY, p2.hx, p2.hy);
          ctx.stroke();
        }
      }

      // Draw metropolitan sodium-vapor golden cores & suburban sprawl clusters
      for (let i = 0; i < hubPositions.length; i++) {
        const { hx, hy, nightFactor, limbForeshorten, hub } = hubPositions[i];
        if (nightFactor <= 0.04) continue;

        const baseAlpha = nightFactor * hub.intensity;

        // Warm sodium-vapor atmospheric glow around major metro hub
        const cityGlow = ctx.createRadialGradient(
          hx,
          hy,
          0,
          hx,
          hy,
          hub.size * 9
        );
        cityGlow.addColorStop(0, `rgba(254, 240, 138, ${(baseAlpha * 0.55).toFixed(3)})`);
        cityGlow.addColorStop(0.35, `rgba(245, 158, 11, ${(baseAlpha * 0.25).toFixed(3)})`);
        cityGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = cityGlow;
        ctx.beginPath();
        ctx.ellipse(
          hx,
          hy,
          hub.size * 9,
          hub.size * 9 * (0.38 + 0.45 * limbForeshorten),
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Crisp metropolitan core
        ctx.fillStyle = `rgba(255, 251, 235, ${(baseAlpha * 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // Satellite towns & arterial nodes
        for (let s = 0; s < hub.satellites.length; s++) {
          const sat = hub.satellites[s];
          const sx = hx + sat.dx;
          const sy = hy + sat.dy * (0.4 + 0.5 * limbForeshorten);
          ctx.fillStyle = `rgba(253, 186, 116, ${(
            baseAlpha *
            sat.alpha *
            0.75
          ).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, sat.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Atmospheric Cloud Wisps illuminated near the terminator & diffusing night lights
      ctx.save();
      for (let i = 0; i < cloudBands.length; i++) {
        const c = cloudBands[i];
        const r = planetRadius * (1 - c.depthFrac);
        const startA = c.angle - c.arcSpan * 0.5 + Math.sin(time * c.speed) * 0.02;
        const endA = startA + c.arcSpan;
        const midA = (startA + endA) * 0.5;
        const cx = planetCx + Math.cos(midA) * r;
        const cy = planetCy + Math.sin(midA) * r;
        const distSun = Math.hypot(cx - sunX, cy - sunY);
        const sunLit = Math.max(0, 1 - distSun / 340);

        ctx.strokeStyle =
          sunLit > 0.25
            ? `rgba(${sunRgb.r}, ${sunRgb.g}, ${sunRgb.b}, ${(
                c.alpha *
                (0.5 + sunLit * 1.2)
              ).toFixed(3)})`
            : `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, ${(
                c.alpha * 0.55
              ).toFixed(3)})`;
        ctx.lineWidth = c.thickness;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(planetCx, planetCy, r, startA, endA);
        ctx.stroke();
      }
      ctx.restore();

      // Inner atmospheric horizon haze along the curved planetary rim
      const innerRimGrad = ctx.createRadialGradient(
        planetCx,
        planetCy,
        planetRadius * 0.982,
        planetCx,
        planetCy,
        planetRadius
      );
      innerRimGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      innerRimGrad.addColorStop(
        0.65,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.22)`
      );
      innerRimGrad.addColorStop(
        0.92,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.62)`
      );
      innerRimGrad.addColorStop(
        1,
        `rgba(224, 242, 254, 0.85)`
      );
      ctx.fillStyle = innerRimGrad;
      ctx.fillRect(0, horizonApexY - 20, width, height);
      ctx.restore();

      // 3. Multi-Band Atmospheric Limb Rim (Troposphere Gold -> Stratosphere Cyan -> Mesosphere Blue)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Stratospheric cyan-blue glow band
      ctx.strokeStyle = `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.72)`;
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(
        planetCx,
        planetCy,
        planetRadius + 1.5,
        -Math.PI * 0.85,
        -Math.PI * 0.15
      );
      ctx.stroke();

      // Warm golden-amber tropospheric refraction band near the sun
      const spanNearSun = 0.16;
      ctx.strokeStyle = `rgba(251, 146, 60, ${(0.75 * crestIntensity).toFixed(3)})`;
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.arc(
        planetCx,
        planetCy,
        planetRadius - 0.5,
        sunAngle - spanNearSun,
        sunAngle + spanNearSun
      );
      ctx.stroke();

      // Razor-sharp incandescent airglow limb edge
      ctx.strokeStyle = "rgba(240, 249, 255, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(
        planetCx,
        planetCy,
        planetRadius,
        -Math.PI * 0.82,
        -Math.PI * 0.18
      );
      ctx.stroke();

      // 4. Physical Solar Corona, Starburst & Anamorphic Hexagonal Lens Flare
      const bloomRadius = 185 * crestIntensity;
      const flareBloom = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        bloomRadius
      );
      flareBloom.addColorStop(0, "rgba(255, 255, 255, 1)");
      flareBloom.addColorStop(0.09, "rgba(255, 253, 240, 0.98)");
      flareBloom.addColorStop(
        0.22,
        `rgba(${sunRgb.r}, ${sunRgb.g}, ${sunRgb.b}, 0.85)`
      );
      flareBloom.addColorStop(
        0.48,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.35)`
      );
      flareBloom.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = flareBloom;
      ctx.beginPath();
      ctx.arc(sunX, sunY, bloomRadius, 0, Math.PI * 2);
      ctx.fill();

      // Primary & secondary anamorphic horizontal lens streaks
      const streakWidth = Math.min(width * 0.82, 580) * crestIntensity;
      const streakGrad = ctx.createLinearGradient(
        sunX - streakWidth,
        sunY,
        sunX + streakWidth,
        sunY
      );
      streakGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      streakGrad.addColorStop(
        0.2,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.18)`
      );
      streakGrad.addColorStop(
        0.42,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.58)`
      );
      streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
      streakGrad.addColorStop(
        0.58,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.58)`
      );
      streakGrad.addColorStop(
        0.8,
        `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, 0.18)`
      );
      streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = streakGrad;
      ctx.beginPath();
      ctx.ellipse(sunX, sunY, streakWidth, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(sunX, sunY - 3.5, streakWidth * 0.55, 1.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // 6-Blade Aperture Diffraction Starburst Spikes
      const bladeAngles = [-0.52, 0.52, -1.05, 1.05, Math.PI / 2];
      for (const rayAngle of bladeAngles) {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(rayAngle);
        const rayLen =
          (rayAngle === Math.PI / 2 ? 115 : 165) * crestIntensity;
        const rayGrad = ctx.createLinearGradient(-rayLen, 0, rayLen, 0);
        rayGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        rayGrad.addColorStop(
          0.5,
          `rgba(${sunRgb.r}, ${sunRgb.g}, ${sunRgb.b}, 0.55)`
        );
        rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rayLen, 1.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Hexagonal Camera Aperture Ghost Reflections along optical axis
      const vecX = width * 0.5 - sunX;
      const vecY = height * 0.44 - sunY;
      const hexGhosts = [
        { t: 0.35, r: 16, alpha: 0.16, tint: "cyan" },
        { t: 0.65, r: 28, alpha: 0.11, tint: "gold" },
        { t: 0.95, r: 12, alpha: 0.22, tint: "cyan" },
        { t: 1.28, r: 42, alpha: 0.09, tint: "violet" },
        { t: 1.58, r: 22, alpha: 0.14, tint: "gold" },
        { t: 1.85, r: 58, alpha: 0.07, tint: "cyan" },
      ] as const;

      for (const g of hexGhosts) {
        const gx = sunX + vecX * g.t;
        const gy = sunY + vecY * g.t;
        const a = g.alpha * crestIntensity;
        const gGrad = ctx.createRadialGradient(gx, gy, g.r * 0.15, gx, gy, g.r);

        if (g.tint === "gold") {
          gGrad.addColorStop(0, `rgba(${sunRgb.r}, ${sunRgb.g}, ${sunRgb.b}, ${(a * 0.35).toFixed(3)})`);
          gGrad.addColorStop(0.82, `rgba(251, 191, 36, ${a.toFixed(3)})`);
        } else if (g.tint === "violet") {
          gGrad.addColorStop(0, `rgba(168, 85, 247, ${(a * 0.3).toFixed(3)})`);
          gGrad.addColorStop(0.82, `rgba(236, 72, 153, ${a.toFixed(3)})`);
        } else {
          gGrad.addColorStop(0, `rgba(${atmoRgb.r}, ${atmoRgb.g}, ${atmoRgb.b}, ${(a * 0.35).toFixed(3)})`);
          gGrad.addColorStop(0.82, `rgba(125, 211, 252, ${a.toFixed(3)})`);
        }
        gGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        drawHexagon(
          gx,
          gy,
          g.r,
          0.25 + g.t * 0.3,
          gGrad,
          `rgba(255, 255, 255, ${(a * 0.45).toFixed(3)})`
        );
      }

      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [activeAtmoColor, activeFlareColor, activeFlarePos, isAutoplay, starDensity]);

  return (
    <div
      ref={containerRef}
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl bg-[#010206] text-white select-none",
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
          {/* Top Orbital Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 backdrop-blur-md">
                <Globe className="h-4 w-4 text-sky-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                    ISS Cupola Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                    <Sun className="h-2.5 w-2.5" /> Orbital Dawn
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Altitude 408 km &bull; Rayleigh Limb &amp; Night-Side Metro Grid
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {HORIZON_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setActiveAtmoColor(preset.atmosphereColor);
                    setActiveFlareColor(preset.flareColor);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all backdrop-blur-md",
                    activeAtmoColor.toLowerCase() ===
                      preset.atmosphereColor.toLowerCase()
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/10 bg-black/40 text-white/65 hover:border-white/25 hover:text-white"
                  )}
                >
                  {preset.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsAutoplay((v) => !v)}
                aria-label={isAutoplay ? "Pause solar orbit" : "Play solar orbit"}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/75 transition-colors hover:border-white/25 hover:text-white backdrop-blur-md"
              >
                {isAutoplay ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowControls((v) => !v)}
                aria-label="Toggle horizon controls"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors backdrop-blur-md",
                  showControls
                    ? "border-sky-400/50 bg-sky-400/15 text-sky-300"
                    : "border-white/10 bg-black/40 text-white/75 hover:border-white/25 hover:text-white"
                )}
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Content & Manual Flare Scrubber */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Sunrise From Orbit
              </h2>
              <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
                Multi-band Rayleigh scattering transitions from golden
                tropospheric refraction to deep mesospheric cobalt while city
                light networks glow across the night side.
              </p>
            </div>

            {showControls && (
              <div className="w-full max-w-xs space-y-3 rounded-xl border border-white/15 bg-black/65 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/85">
                    Solar Crest Position
                  </span>
                  <span className="text-[11px] text-sky-300">
                    {isAutoplay
                      ? "Auto-Orbiting"
                      : `${Math.round(activeFlarePos * 100)}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min={0.05}
                  max={0.95}
                  step={0.01}
                  value={activeFlarePos}
                  onChange={(e) => {
                    setIsAutoplay(false);
                    setActiveFlarePos(Number(e.target.value));
                  }}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-sky-400"
                />

                <div className="flex items-center justify-between gap-2 pt-1 text-xs text-white/65">
                  <span>Atmosphere Tint</span>
                  <input
                    type="color"
                    value={activeAtmoColor}
                    onChange={(e) => setActiveAtmoColor(e.target.value)}
                    className="h-6 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
                  />
                  <span>Flare Tint</span>
                  <input
                    type="color"
                    value={activeFlareColor}
                    onChange={(e) => setActiveFlareColor(e.target.value)}
                    className="h-6 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanetHorizon;
