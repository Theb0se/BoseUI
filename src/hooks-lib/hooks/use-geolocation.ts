"use client";

import { useCallback, useEffect, useState } from "react";

export interface GeolocationState {
  loading: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  isSupported: boolean;
  refresh: () => void;
}

/**
 * Reads the user's geographic coordinates via `navigator.geolocation` with
 * loading, error, and manual refresh support. SSR-safe.
 *
 * @param options - Standard `PositionOptions` (`enableHighAccuracy`, `timeout`, `maximumAge`).
 * @param watch - Continuously watch position changes when `true` (default: `false`).
 * @returns Geolocation state and `refresh()` function.
 */
export function useGeolocation(
  options: PositionOptions = {},
  watch = false
): GeolocationState {
  const [state, setState] = useState<Omit<GeolocationState, "refresh">>({
    loading: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    isSupported: false,
  });

  const optionsKey = JSON.stringify(options);

  const requestPosition = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        loading: false,
        isSupported: false,
        error: "Geolocation is not supported in this environment.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, isSupported: true }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          error: null,
          isSupported: true,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to retrieve location.",
          isSupported: true,
        }));
      },
      options
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    setState((prev) => ({ ...prev, isSupported: true }));
    if (!watch) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          loading: false,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          error: null,
          isSupported: true,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
          isSupported: true,
        }));
      },
      options
    );

    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, optionsKey]);

  return { ...state, refresh: requestPosition };
}
