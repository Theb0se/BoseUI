"use client";

import React, { useState, useId, useMemo, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  Sun,
  Moon,
  Wind as WindIcon,
  Droplets,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                 */
/* ------------------------------------------------------------------ */

export type TemperatureUnit = "F" | "C";
export type WeatherMetricTab = "temperature" | "precipitation" | "wind";

export type WeatherCondition =
  | "clear-night"
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "sun-rain"
  | "thunderstorm"
  | "windy";

export interface HourlyDataPoint {
  time: string; // e.g. "2 AM"
  temperature: number; // in Fahrenheit
  precipitation: number; // in %
  wind: number; // in mph
}

export interface DailyForecast {
  day: string; // e.g. "Wed"
  dateLabel: string; // e.g. "Wednesday 1:00 AM"
  condition: WeatherCondition;
  conditionLabel: string; // e.g. "Clear night"
  highTemp: number; // in °F
  lowTemp: number; // in °F
  currentTemp: number; // in °F
  precipitation: number; // %
  humidity: number; // %
  windSpeed: number; // mph
  hourly: HourlyDataPoint[];
}

export interface WeatherCardProps {
  location?: string;
  initialUnit?: TemperatureUnit;
  daily?: DailyForecast[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Unit Conversion Helpers                                            */
/* ------------------------------------------------------------------ */

export function toCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function formatTemp(fahrenheit: number, unit: TemperatureUnit): number {
  return unit === "C" ? toCelsius(fahrenheit) : Math.round(fahrenheit);
}

export function formatWind(mph: number, unit: TemperatureUnit): string {
  if (unit === "C") {
    const kmh = Math.round(mph * 1.60934);
    return `${kmh} km/h`;
  }
  return `${mph} mph`;
}

/* ------------------------------------------------------------------ */
/* Catmull-Rom / Monotone Smooth SVG Spline Path Generator            */
/* ------------------------------------------------------------------ */

export function buildSmoothPath(
  points: { x: number; y: number }[],
  height: number,
  closeArea = false
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Curvature tension coefficient
    const tension = 0.2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(
      2
    )} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  if (closeArea) {
    const last = points[points.length - 1];
    const first = points[0];
    d += ` L ${last.x.toFixed(2)} ${height.toFixed(2)}`;
    d += ` L ${first.x.toFixed(2)} ${height.toFixed(2)} Z`;
  }

  return d;
}

/* ------------------------------------------------------------------ */
/* Default Mock Data (8-Day Weather Model)                            */
/* ------------------------------------------------------------------ */

export const DEFAULT_HOURLY_BASE: HourlyDataPoint[] = [
  { time: "2 AM", temperature: 67, precipitation: 0, wind: 8 },
  { time: "5 AM", temperature: 64, precipitation: 0, wind: 7 },
  { time: "8 AM", temperature: 70, precipitation: 10, wind: 9 },
  { time: "11 AM", temperature: 78, precipitation: 0, wind: 11 },
  { time: "2 PM", temperature: 82, precipitation: 0, wind: 14 },
  { time: "5 PM", temperature: 79, precipitation: 5, wind: 12 },
  { time: "8 PM", temperature: 72, precipitation: 25, wind: 10 },
  { time: "11 PM", temperature: 68, precipitation: 5, wind: 8 },
];

export const DEFAULT_DAILY_FORECAST: DailyForecast[] = [
  {
    day: "Wed",
    dateLabel: "Wednesday 1:00 AM",
    condition: "clear-night",
    conditionLabel: "Clear night",
    highTemp: 82,
    lowTemp: 61,
    currentTemp: 67,
    precipitation: 0,
    humidity: 67,
    windSpeed: 8,
    hourly: [
      { time: "2 AM", temperature: 67, precipitation: 0, wind: 8 },
      { time: "5 AM", temperature: 64, precipitation: 0, wind: 7 },
      { time: "8 AM", temperature: 70, precipitation: 10, wind: 9 },
      { time: "11 AM", temperature: 78, precipitation: 0, wind: 11 },
      { time: "2 PM", temperature: 82, precipitation: 0, wind: 14 },
      { time: "5 PM", temperature: 79, precipitation: 5, wind: 12 },
      { time: "8 PM", temperature: 72, precipitation: 25, wind: 10 },
      { time: "11 PM", temperature: 68, precipitation: 5, wind: 8 },
    ],
  },
  {
    day: "Thu",
    dateLabel: "Thursday 1:00 AM",
    condition: "partly-cloudy",
    conditionLabel: "Partly cloudy",
    highTemp: 79,
    lowTemp: 59,
    currentTemp: 65,
    precipitation: 15,
    humidity: 62,
    windSpeed: 10,
    hourly: [
      { time: "2 AM", temperature: 65, precipitation: 10, wind: 8 },
      { time: "5 AM", temperature: 62, precipitation: 10, wind: 9 },
      { time: "8 AM", temperature: 68, precipitation: 20, wind: 11 },
      { time: "11 AM", temperature: 75, precipitation: 15, wind: 12 },
      { time: "2 PM", temperature: 79, precipitation: 10, wind: 13 },
      { time: "5 PM", temperature: 76, precipitation: 15, wind: 11 },
      { time: "8 PM", temperature: 70, precipitation: 20, wind: 9 },
      { time: "11 PM", temperature: 66, precipitation: 10, wind: 8 },
    ],
  },
  {
    day: "Fri",
    dateLabel: "Friday 1:00 AM",
    condition: "cloudy",
    conditionLabel: "Mostly cloudy",
    highTemp: 74,
    lowTemp: 58,
    currentTemp: 63,
    precipitation: 40,
    humidity: 78,
    windSpeed: 12,
    hourly: [
      { time: "2 AM", temperature: 63, precipitation: 30, wind: 10 },
      { time: "5 AM", temperature: 60, precipitation: 45, wind: 12 },
      { time: "8 AM", temperature: 65, precipitation: 60, wind: 14 },
      { time: "11 AM", temperature: 71, precipitation: 50, wind: 15 },
      { time: "2 PM", temperature: 74, precipitation: 35, wind: 14 },
      { time: "5 PM", temperature: 71, precipitation: 40, wind: 12 },
      { time: "8 PM", temperature: 66, precipitation: 30, wind: 11 },
      { time: "11 PM", temperature: 64, precipitation: 25, wind: 10 },
    ],
  },
  {
    day: "Sat",
    dateLabel: "Saturday 1:00 AM",
    condition: "thunderstorm",
    conditionLabel: "Scattered thunderstorms",
    highTemp: 71,
    lowTemp: 54,
    currentTemp: 60,
    precipitation: 80,
    humidity: 89,
    windSpeed: 16,
    hourly: [
      { time: "2 AM", temperature: 60, precipitation: 65, wind: 14 },
      { time: "5 AM", temperature: 57, precipitation: 85, wind: 16 },
      { time: "8 AM", temperature: 62, precipitation: 90, wind: 18 },
      { time: "11 AM", temperature: 68, precipitation: 75, wind: 19 },
      { time: "2 PM", temperature: 71, precipitation: 80, wind: 20 },
      { time: "5 PM", temperature: 67, precipitation: 70, wind: 17 },
      { time: "8 PM", temperature: 63, precipitation: 50, wind: 15 },
      { time: "11 PM", temperature: 59, precipitation: 35, wind: 12 },
    ],
  },
  {
    day: "Sun",
    dateLabel: "Sunday 1:00 AM",
    condition: "rain",
    conditionLabel: "Showers & light rain",
    highTemp: 69,
    lowTemp: 52,
    currentTemp: 58,
    precipitation: 65,
    humidity: 82,
    windSpeed: 11,
    hourly: [
      { time: "2 AM", temperature: 58, precipitation: 50, wind: 9 },
      { time: "5 AM", temperature: 55, precipitation: 65, wind: 11 },
      { time: "8 AM", temperature: 61, precipitation: 75, wind: 13 },
      { time: "11 AM", temperature: 66, precipitation: 60, wind: 14 },
      { time: "2 PM", temperature: 69, precipitation: 45, wind: 12 },
      { time: "5 PM", temperature: 65, precipitation: 40, wind: 11 },
      { time: "8 PM", temperature: 61, precipitation: 30, wind: 9 },
      { time: "11 PM", temperature: 57, precipitation: 20, wind: 8 },
    ],
  },
  {
    day: "Mon",
    dateLabel: "Monday 1:00 AM",
    condition: "cloudy",
    conditionLabel: "Overcast",
    highTemp: 76,
    lowTemp: 57,
    currentTemp: 64,
    precipitation: 20,
    humidity: 71,
    windSpeed: 9,
    hourly: [
      { time: "2 AM", temperature: 64, precipitation: 20, wind: 8 },
      { time: "5 AM", temperature: 61, precipitation: 25, wind: 8 },
      { time: "8 AM", temperature: 67, precipitation: 20, wind: 9 },
      { time: "11 AM", temperature: 73, precipitation: 15, wind: 11 },
      { time: "2 PM", temperature: 76, precipitation: 10, wind: 12 },
      { time: "5 PM", temperature: 72, precipitation: 15, wind: 10 },
      { time: "8 PM", temperature: 68, precipitation: 20, wind: 8 },
      { time: "11 PM", temperature: 65, precipitation: 15, wind: 7 },
    ],
  },
  {
    day: "Tue",
    dateLabel: "Tuesday 1:00 AM",
    condition: "sun-rain",
    conditionLabel: "Passing sun showers",
    highTemp: 80,
    lowTemp: 60,
    currentTemp: 66,
    precipitation: 30,
    humidity: 68,
    windSpeed: 10,
    hourly: [
      { time: "2 AM", temperature: 66, precipitation: 15, wind: 8 },
      { time: "5 AM", temperature: 63, precipitation: 20, wind: 8 },
      { time: "8 AM", temperature: 70, precipitation: 35, wind: 10 },
      { time: "11 AM", temperature: 77, precipitation: 40, wind: 12 },
      { time: "2 PM", temperature: 80, precipitation: 25, wind: 13 },
      { time: "5 PM", temperature: 76, precipitation: 20, wind: 11 },
      { time: "8 PM", temperature: 71, precipitation: 15, wind: 9 },
      { time: "11 PM", temperature: 67, precipitation: 10, wind: 8 },
    ],
  },
  {
    day: "Wed",
    dateLabel: "Next Wednesday 1:00 AM",
    condition: "sunny",
    conditionLabel: "Sunny & clear",
    highTemp: 84,
    lowTemp: 63,
    currentTemp: 70,
    precipitation: 0,
    humidity: 55,
    windSpeed: 8,
    hourly: [
      { time: "2 AM", temperature: 70, precipitation: 0, wind: 7 },
      { time: "5 AM", temperature: 66, precipitation: 0, wind: 6 },
      { time: "8 AM", temperature: 73, precipitation: 0, wind: 8 },
      { time: "11 AM", temperature: 80, precipitation: 0, wind: 10 },
      { time: "2 PM", temperature: 84, precipitation: 0, wind: 11 },
      { time: "5 PM", temperature: 81, precipitation: 0, wind: 9 },
      { time: "8 PM", temperature: 75, precipitation: 0, wind: 8 },
      { time: "11 PM", temperature: 71, precipitation: 0, wind: 7 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Subcomponent: High-Fidelity Weather Icon Representation             */
/* ------------------------------------------------------------------ */

export function WeatherIcon({
  condition,
  className,
  size = 28,
}: {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}) {
  switch (condition) {
    case "clear-night":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-amber-300",
            className
          )}
          style={{ width: size, height: size }}
        >
          <Moon
            style={{ width: size * 0.85, height: size * 0.85 }}
            className="fill-amber-300/20 stroke-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.4)]"
            strokeWidth={1.8}
          />
          <Sparkles
            style={{ width: size * 0.42, height: size * 0.42 }}
            className="absolute -top-1 -right-1 text-amber-200 fill-amber-200 animate-pulse"
          />
        </div>
      );

    case "sunny":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-amber-400",
            className
          )}
          style={{ width: size, height: size }}
        >
          <Sun
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="fill-amber-400/20 stroke-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]"
            strokeWidth={1.8}
          />
        </div>
      );

    case "partly-cloudy":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-sky-200",
            className
          )}
          style={{ width: size, height: size }}
        >
          <CloudSun
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="stroke-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
            strokeWidth={1.8}
          />
        </div>
      );

    case "cloudy":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-neutral-300",
            className
          )}
          style={{ width: size, height: size }}
        >
          <Cloud
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="fill-neutral-300/15 stroke-neutral-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            strokeWidth={1.8}
          />
        </div>
      );

    case "rain":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-sky-400",
            className
          )}
          style={{ width: size, height: size }}
        >
          <CloudRain
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="fill-sky-400/10 stroke-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"
            strokeWidth={1.8}
          />
        </div>
      );

    case "sun-rain":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-amber-300",
            className
          )}
          style={{ width: size, height: size }}
        >
          <CloudSun
            style={{ width: size * 0.88, height: size * 0.88 }}
            className="stroke-amber-300"
            strokeWidth={1.8}
          />
          <Droplets
            style={{ width: size * 0.38, height: size * 0.38 }}
            className="absolute -bottom-0.5 right-0 text-sky-400 fill-sky-400"
          />
        </div>
      );

    case "thunderstorm":
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-purple-300",
            className
          )}
          style={{ width: size, height: size }}
        >
          <CloudLightning
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="stroke-purple-300 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]"
            strokeWidth={1.8}
          />
        </div>
      );

    case "windy":
    default:
      return (
        <div
          className={cn(
            "relative flex items-center justify-center select-none text-teal-300",
            className
          )}
          style={{ width: size, height: size }}
        >
          <WindIcon
            style={{ width: size * 0.9, height: size * 0.9 }}
            className="stroke-teal-300"
            strokeWidth={1.8}
          />
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Subcomponent: Animated Rolling Temperature Number                  */
/* ------------------------------------------------------------------ */

export function AnimatedTemperature({ value }: { value: number }) {
  const shouldReduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 120, damping: 18 });
  const display = useTransform(spring, (latest) => Math.round(latest));
  const [currentVal, setCurrentVal] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setCurrentVal(latest);
    });
    return () => unsubscribe();
  }, [display]);

  if (shouldReduceMotion) {
    return <span>{value}</span>;
  }

  return <span>{currentVal}</span>;
}

/* ------------------------------------------------------------------ */
/* Subcomponent: Weather Header                                       */
/* ------------------------------------------------------------------ */

export interface WeatherHeaderProps {
  location: string;
  dayData: DailyForecast;
  unit: TemperatureUnit;
  onToggleUnit: (newUnit: TemperatureUnit) => void;
}

export function WeatherHeader({
  location,
  dayData,
  unit,
  onToggleUnit,
}: WeatherHeaderProps) {
  const currentTemp = formatTemp(dayData.currentTemp, unit);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
      {/* Left side: Weather icon, big temperature, unit toggle, 3-line stat block */}
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 sm:gap-5">
        {/* Large 64px weather illustration */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dayData.condition}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0"
          >
            <WeatherIcon condition={dayData.condition} size={64} />
          </motion.div>
        </AnimatePresence>

        {/* Big Temperature & Unit Toggle */}
        <div className="flex items-start">
          <span className="text-5xl sm:text-6xl font-semibold tracking-tight text-white font-sans tabular-nums">
            <AnimatedTemperature value={currentTemp} />
          </span>

          {/* Unit Toggle Buttons: °F | °C */}
          <div
            role="group"
            aria-label="Temperature unit selection"
            className="ml-2 flex items-center text-sm font-medium mt-1 select-none"
          >
            <button
              type="button"
              aria-pressed={unit === "F"}
              onClick={() => onToggleUnit("F")}
              className={cn(
                "transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded",
                unit === "F"
                  ? "text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              °F
            </button>
            <span className="mx-1 text-neutral-600 font-light select-none">|</span>
            <button
              type="button"
              aria-pressed={unit === "C"}
              onClick={() => onToggleUnit("C")}
              className={cn(
                "transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded",
                unit === "C"
                  ? "text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              °C
            </button>
          </div>
        </div>

        {/* 3-Line Stat Block */}
        <div className="text-xs text-neutral-400 space-y-0.5 border-l border-white/10 pl-4 py-0.5 select-none">
          <p>
            Precipitation:{" "}
            <span className="text-neutral-200 font-medium">
              {dayData.precipitation}%
            </span>
          </p>
          <p>
            Humidity:{" "}
            <span className="text-neutral-200 font-medium">
              {dayData.humidity}%
            </span>
          </p>
          <p>
            Wind:{" "}
            <span className="text-neutral-200 font-medium">
              {formatWind(dayData.windSpeed, unit)}
            </span>
          </p>
        </div>
      </div>

      {/* Right side: City and Date info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dayData.day}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="text-left sm:text-right flex-shrink-0"
        >
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
            {location}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">{dayData.dateLabel}</p>
          <p className="text-xs text-neutral-400 capitalize">
            {dayData.conditionLabel}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponent: Weather Metric Tabs                                  */
/* ------------------------------------------------------------------ */

export interface WeatherTabsProps {
  activeTab: WeatherMetricTab;
  onSelectTab: (tab: WeatherMetricTab) => void;
}

export function WeatherTabs({ activeTab, onSelectTab }: WeatherTabsProps) {
  const tabs: { id: WeatherMetricTab; label: string }[] = [
    { id: "temperature", label: "Temperature" },
    { id: "precipitation", label: "Precipitation" },
    { id: "wind", label: "Wind" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Weather metrics"
      className="flex items-center gap-6 sm:gap-8 pt-3 pb-2 border-t border-white/10 select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              "relative pb-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-t",
              isActive ? "text-white" : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="weather-active-tab-underline"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute bottom-0 inset-x-0 h-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponent: Smooth Area Chart with Spring Cursor Guide           */
/* ------------------------------------------------------------------ */

export interface WeatherChartProps {
  hourly: HourlyDataPoint[];
  metric: WeatherMetricTab;
  unit: TemperatureUnit;
}

export function WeatherChart({ hourly, metric, unit }: WeatherChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const rawId = useId();
  const gradientId = `chart-area-grad-${rawId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Compute numerical series values
  const seriesValues = useMemo(() => {
    return hourly.map((p) => {
      if (metric === "temperature") return formatTemp(p.temperature, unit);
      if (metric === "precipitation") return p.precipitation;
      return p.wind;
    });
  }, [hourly, metric, unit]);

  // Label formatting function
  const formatValueLabel = (val: number, isFirst: boolean) => {
    if (metric === "temperature") return `${val}°`;
    if (metric === "precipitation") return `${val}%`;
    return `${val} mph`;
  };

  // Dimensions
  const svgWidth = 600;
  const svgHeight = 150;
  const paddingX = 36;
  const paddingTop = 30;
  const paddingBottom = 26;

  const minVal = Math.min(...seriesValues);
  const maxVal = Math.max(...seriesValues);
  const range = Math.max(1, maxVal - minVal);

  // Coordinate mapping for each data point
  const points = useMemo(() => {
    const count = seriesValues.length;
    const stepX = (svgWidth - paddingX * 2) / (count - 1);

    return seriesValues.map((val, i) => {
      const x = paddingX + i * stepX;
      // Invert Y so highest value is near paddingTop
      const normalized = (val - minVal) / range;
      const y =
        svgHeight -
        paddingBottom -
        normalized * (svgHeight - paddingTop - paddingBottom);
      return { x, y, value: val, time: hourly[i].time };
    });
  }, [seriesValues, hourly, minVal, range]);

  // Line path & Area path
  const linePath = useMemo(() => buildSmoothPath(points, svgHeight, false), [points]);
  const areaPath = useMemo(() => buildSmoothPath(points, svgHeight, true), [points]);

  // Pointer move handler to track nearest data point
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const rawIndex = ratio * (points.length - 1);
    const nearest = Math.round(rawIndex);
    setHoverIndex(nearest);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[160px] select-none my-2 cursor-crosshair overflow-visible"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area Fill */}
        <motion.path
          key={`area-${metric}`}
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.15 }}
        />

        {/* Sky-400 Smooth Curve Line */}
        <motion.path
          key={`line-${metric}`}
          d={linePath}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: "easeOut" }}
        />

        {/* Vertical Guide Line on Hover */}
        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              y1={paddingTop - 12}
              x2={activePoint.x}
              y2={svgHeight - 4}
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            {/* Glowing circle at data point */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="4.5"
              fill="#ffffff"
              stroke="#0ea5e9"
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_rgba(14,165,233,0.9)]"
            />
          </g>
        )}
      </svg>

      {/* Floating Dynamic Tooltip following active point */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${Math.max(6, (activePoint.y / svgHeight) * 100 - 32)}%`,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-30 flex flex-col items-center"
          >
            <div className="rounded-lg border border-sky-400/40 bg-[#121214]/95 px-2.5 py-1 text-center shadow-lg backdrop-blur-md">
              <span className="text-[10px] text-neutral-400 font-mono block">
                {activePoint.time}
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                {formatValueLabel(activePoint.value, false)}
              </span>
            </div>
            {/* Tiny triangle caret */}
            <div className="h-1.5 w-1.5 rotate-45 border-r border-b border-sky-400/40 bg-[#121214] -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Value Labels Above Data Points */}
      <div className="pointer-events-none absolute inset-0">
        {points.map((pt, i) => {
          const isFirst = i === 0;
          const leftPercent = (pt.x / svgWidth) * 100;
          const topPercent = (pt.y / svgHeight) * 100;

          return (
            <motion.div
              key={`${metric}-val-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: i * 0.03,
              }}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-6 text-center select-none"
            >
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  isFirst
                    ? "font-bold text-white drop-shadow-sm"
                    : "text-neutral-400"
                )}
              >
                {formatValueLabel(pt.value, isFirst)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* X-Axis Labels Beneath (2 AM, 5 AM, etc.) */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 flex justify-between px-3 text-[11px] text-neutral-400 font-medium select-none">
        {hourly.map((p, i) => (
          <span
            key={`time-${i}`}
            className={cn(
              "tabular-nums text-center",
              hoverIndex === i ? "text-sky-300 font-semibold" : "text-neutral-400"
            )}
          >
            {p.time}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponent: 8-Day Forecast Row                                   */
/* ------------------------------------------------------------------ */

export interface WeatherForecastRowProps {
  daily: DailyForecast[];
  selectedIndex: number;
  unit: TemperatureUnit;
  onSelectDay: (index: number) => void;
}

export function WeatherForecastRow({
  daily,
  selectedIndex,
  unit,
  onSelectDay,
}: WeatherForecastRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="listbox"
      aria-label="8-day weather forecast"
      className="mt-4 pt-4 border-t border-white/10 grid grid-cols-8 gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none"
    >
      {daily.map((item, idx) => {
        const isSelected = selectedIndex === idx;
        const high = formatTemp(item.highTemp, unit);
        const low = formatTemp(item.lowTemp, unit);

        return (
          <motion.div
            key={`${item.day}-${idx}`}
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={() => onSelectDay(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectDay(idx);
              }
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.35,
              delay: idx * 0.04,
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className={cn(
              "relative flex flex-col items-center justify-between rounded-2xl py-3 px-1 min-w-[56px] sm:min-w-0 cursor-pointer select-none transition-colors",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            )}
          >
            {/* Sliding Shared Selection Pill Background */}
            {isSelected && (
              <motion.div
                layoutId="forecast-day-highlight"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="absolute inset-0 rounded-2xl bg-white/10 border border-white/15 shadow-inner"
              />
            )}

            {/* Day label */}
            <span
              className={cn(
                "relative z-10 text-xs font-medium transition-colors",
                isSelected ? "text-white font-semibold" : "text-neutral-400"
              )}
            >
              {item.day}
            </span>

            {/* Condition Icon */}
            <div className="relative z-10 my-2">
              <WeatherIcon condition={item.condition} size={28} />
            </div>

            {/* High & Low Temperatures */}
            <div className="relative z-10 flex items-center gap-1 text-xs tabular-nums">
              <span className="font-semibold text-white">{high}°</span>
              <span className="text-neutral-500">{low}°</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component: WeatherCard                                        */
/* ------------------------------------------------------------------ */

export function WeatherCard({
  location = "San Francisco, CA",
  initialUnit = "F",
  daily = DEFAULT_DAILY_FORECAST,
  className,
}: WeatherCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Selected Day & Metric Tab & Temperature Unit State
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<WeatherMetricTab>("temperature");
  const [unit, setUnit] = useState<TemperatureUnit>(initialUnit);

  const activeDayData = daily[selectedDayIndex] ?? daily[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-[630px] mx-auto rounded-3xl border border-white/10 bg-[#181818] p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_-15px_rgba(0,0,0,0.7)] text-white font-sans antialiased overflow-hidden",
        className
      )}
    >
      {/* Subtle Dark Ambient Backdrop Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
      />

      {/* 1. Header Row */}
      <WeatherHeader
        location={location}
        dayData={activeDayData}
        unit={unit}
        onToggleUnit={setUnit}
      />

      {/* 2. Tabs Row */}
      <WeatherTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 3. Smooth Area Chart */}
      <WeatherChart
        hourly={activeDayData.hourly}
        metric={activeTab}
        unit={unit}
      />

      {/* 4. 8-Day Forecast Row */}
      <WeatherForecastRow
        daily={daily}
        selectedIndex={selectedDayIndex}
        unit={unit}
        onSelectDay={setSelectedDayIndex}
      />
    </motion.div>
  );
}

export default WeatherCard;
