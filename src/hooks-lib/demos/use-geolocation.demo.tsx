"use client";

import React from "react";
import { useGeolocation } from "../hooks/use-geolocation";

export function UseGeolocationDemo() {
  const { loading, latitude, longitude, error, refresh } = useGeolocation();

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {loading ? (
          <span>Requesting location...</span>
        ) : error ? (
          <span className="text-rose-500">{error}</span>
        ) : latitude !== null && longitude !== null ? (
          <span className="font-semibold text-neutral-950 dark:text-white">
            Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
          </span>
        ) : (
          <span className="text-neutral-500">
            Click below to request browser location permission.
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={refresh}
        className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
      >
        Get Current Location
      </button>
    </div>
  );
}
