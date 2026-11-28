"use client";

import { useEffect, useState } from "react";

export interface OrientationState {
  angle: number;
  type: "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary";
}

/**
 * Tracks screen orientation angle and type (`portrait-*` / `landscape-*`)
 * via `window.screen.orientation` with a viewport-dimension fallback.
 *
 * @returns `{ angle, type }`.
 */
export function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>({
    angle: 0,
    type: "portrait-primary",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const screenOrientation = window.screen?.orientation;
      if (screenOrientation) {
        setOrientation({
          angle: screenOrientation.angle,
          type: screenOrientation.type as OrientationState["type"],
        });
      } else {
        const isLandscape = window.innerWidth > window.innerHeight;
        setOrientation({
          angle: isLandscape ? 90 : 0,
          type: isLandscape ? "landscape-primary" : "portrait-primary",
        });
      }
    };

    update();
    window.screen?.orientation?.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.screen?.orientation?.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return orientation;
}
