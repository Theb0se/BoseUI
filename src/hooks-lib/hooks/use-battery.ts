"use client";

import { useEffect, useState } from "react";

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export interface BatteryState {
  isSupported: boolean;
  loading: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

/**
 * Subscribes to the Battery Status API (`navigator.getBattery()`) when supported
 * by the browser, reporting charge level and charging state.
 *
 * @returns `{ isSupported, loading, level, charging, chargingTime, dischargingTime }`.
 */
export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    isSupported: false,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
  });

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const nav = navigator as NavigatorWithBattery;

    if (typeof nav.getBattery !== "function") {
      setState({
        isSupported: false,
        loading: false,
        level: null,
        charging: null,
        chargingTime: null,
        dischargingTime: null,
      });
      return;
    }

    let mounted = true;
    let batteryRef: BatteryManager | null = null;

    const handleChange = () => {
      if (!mounted || !batteryRef) return;
      setState({
        isSupported: true,
        loading: false,
        level: batteryRef.level,
        charging: batteryRef.charging,
        chargingTime: batteryRef.chargingTime,
        dischargingTime: batteryRef.dischargingTime,
      });
    };

    nav
      .getBattery()
      .then((battery) => {
        if (!mounted) return;
        batteryRef = battery;
        handleChange();
        battery.addEventListener("levelchange", handleChange);
        battery.addEventListener("chargingchange", handleChange);
        battery.addEventListener("chargingtimechange", handleChange);
        battery.addEventListener("dischargingtimechange", handleChange);
      })
      .catch(() => {
        if (!mounted) return;
        setState((prev) => ({ ...prev, isSupported: false, loading: false }));
      });

    return () => {
      mounted = false;
      if (batteryRef) {
        batteryRef.removeEventListener("levelchange", handleChange);
        batteryRef.removeEventListener("chargingchange", handleChange);
        batteryRef.removeEventListener("chargingtimechange", handleChange);
        batteryRef.removeEventListener("dischargingtimechange", handleChange);
      }
    };
  }, []);

  return state;
}
