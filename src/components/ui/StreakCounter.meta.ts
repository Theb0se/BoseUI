import type { PulseComponentMeta } from "../../types/component";

export const StreakCounterMeta: PulseComponentMeta = {
  title: "Streak Counter",
  description:
    "Duolingo-style gamified streak counter featuring a pulsing animated flame avatar with floating sparks, 7-day calendar circle row with completion checks, freeze shield, and celebratory confetti explosion.",
  tagline: "Duolingo-inspired gamified streak counter with pulsing flame and confetti explosion.",
  category: "Motion" as any,
  badges: ["Duolingo", "Gamification", "Habit Loop", "Confetti"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "streak counter",
    "duolingo streak",
    "habit tracker",
    "pulsing flame",
    "streak freeze",
    "confetti burst",
    "milestone progress",
    "gamification ui",
  ],
  features: [
    "Pulsing heat wave and floating ember sparks surrounding a rich gradient flame badge.",
    "Dynamic 7-day calendar circle row reflecting past completion, today's active state, and locked days.",
    "Radial multi-color confetti explosion upon claiming the day's streak.",
    "Milestone progress indicator tracking user progression to subsequent tier badges (e.g. 21-Day Club).",
    "Interactive streak freeze shield badge communicating protection against broken streaks.",
    "Live controls to inspect different streak counts and reset demonstration states.",
  ],
  accessibility: [
    "Semantic buttons with full state descriptions (claimed vs pending).",
    "High contrast status badges communicating completed and locked days.",
    "Animations respect prefers-reduced-motion for reduced motion users.",
  ],
  props: [
    {
      name: "initialStreak",
      type: "number",
      default: "14",
      description: "Initial number of consecutive active days.",
    },
    {
      name: "initialClaimed",
      type: "boolean",
      default: "false",
      description: "Whether the streak has already been locked in for today.",
    },
    {
      name: "hasStreakFreeze",
      type: "boolean",
      default: "true",
      description: "Whether the user has a streak freeze equipped to protect missed days.",
    },
    {
      name: "onClaim",
      type: "(newStreak: number) => void",
      description: "Callback invoked when today's streak is claimed.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS classes for the container wrapper.",
    },
  ],
  usageCode: `import { StreakCounter } from "@/components/ui/streak-counter";

export function Example() {
  return (
    <StreakCounter
      initialStreak={14}
      initialClaimed={false}
      hasStreakFreeze={true}
      onClaim={(newStreak) => console.log("Claimed streak:", newStreak)}
    />
  );
}`,
};

export default StreakCounterMeta;
