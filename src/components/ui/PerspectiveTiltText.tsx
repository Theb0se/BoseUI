"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PerspectiveTiltTextProps {
  /** The text string to render */
  text?: string;
  /** Maximum tilt angle in degrees. Default: 18 */
  maxTilt?: number;
  /** Extrusion depth layer offset in pixels. Default: 8 */
  depth?: number;
  /** Optional custom class name */
  className?: string;
}

export function PerspectiveTiltText({
  text = "PERSPECTIVE 3D",
  maxTilt = 18,
  depth = 8,
  className,
}: PerspectiveTiltTextProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const mouseX = useSpring(0, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [depth, -depth]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [depth, -depth]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative inline-block select-none cursor-pointer [perspective:1000px] p-6",
        className
      )}
    >
      <motion.div
        style={
          reduceMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative inline-block font-black tracking-tighter"
      >
        {/* Parallax Extrusion Underlayer */}
        <motion.span
          aria-hidden="true"
          style={
            reduceMotion
              ? {}
              : {
                  x: shadowX,
                  y: shadowY,
                  transform: "translateZ(-20px)",
                }
          }
          className="pointer-events-none absolute inset-0 select-none text-neutral-300 dark:text-neutral-800 opacity-60"
        >
          {text}
        </motion.span>

        {/* Foreground Face */}
        <span
          style={{ transform: "translateZ(30px)" }}
          className="relative z-10 inline-block text-black dark:text-white"
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}
