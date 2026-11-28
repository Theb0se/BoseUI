"use client";

import { useEffect, useState } from "react";

interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export interface NetworkStatusState {
  online: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean | null;
}

/**
 * Tracks online status along with connection speed and type metadata from the
 * Network Information API (`navigator.connection`) when supported.
 *
 * @returns `{ online, effectiveType, downlink, rtt, saveData }`.
 */
export function useNetworkStatus(): NetworkStatusState {
  const [status, setStatus] = useState<NetworkStatusState>({
    online: true,
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const nav = navigator as NavigatorWithConnection;
    const conn = nav.connection;

    const update = () => {
      setStatus({
        online: navigator.onLine,
        effectiveType: conn?.effectiveType ?? null,
        downlink: conn?.downlink ?? null,
        rtt: conn?.rtt ?? null,
        saveData: conn?.saveData ?? null,
      });
    };

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    conn?.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      conn?.removeEventListener("change", update);
    };
  }, []);

  return status;
}
