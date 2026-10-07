import type { PulseComponentMeta } from "../../types/component";

export const SpringPendulumMeta: PulseComponentMeta = {
  title: "Spring Pendulum",
  description:
    "Under-damped harmonic pendulum stage that visualizes angular velocity, restoring spring torque, and directional impulse kicks.",
  tagline: "Under-damped harmonic pendulum with angular velocity telemetry.",
  category: "Motion",
  badges: ["New", "Harmonic Physics", "Angular Velocity"],
  createdAt: "2026-10-07",
  featured: false,
  keywords: [
    "spring pendulum",
    "harmonic oscillator",
    "physics animation react",
    "framer motion pendulum",
    "kinetic telemetry",
  ],
  features: [
    "Under-damped Hooke's Law angular spring that oscillates across equilibrium before settling.",
    "Real-time angular velocity tracking via useVelocity that dynamically scales the pendulum bob at peak swing speed.",
    "Directional left and right torque impulse triggers.",
  ],
  accessibility: [
    "Provides keyboard-focusable Left Kick, Right Kick, and Bob trigger buttons.",
    "Marks decorative protractor arcs and pivot hardware with aria-hidden='true'.",
    "Locks the pendulum arm at 0 degrees when prefers-reduced-motion is active.",
  ],
  props: [
    {
      name: "rodLength",
      type: "number",
      default: "110",
      description: "Length of the pendulum suspension rod in pixels.",
    },
    {
      name: "impulseAngle",
      type: "number",
      default: "42",
      description: "Peak angular displacement in degrees applied on impulse kick.",
    },
    {
      name: "stiffness",
      type: "number",
      default: "140",
      description: "Hooke's Law spring stiffness governing angular restoring force.",
    },
    {
      name: "damping",
      type: "number",
      default: "6",
      description: "Low damping coefficient allowing realistic multi-swing oscillation.",
    },
  ],
  usageCode: `import { SpringPendulum } from "@/components/ui/spring-pendulum";

export function Example() {
  return (
    <SpringPendulum rodLength={110} impulseAngle={42} stiffness={140} damping={6} />
  );
}`,
};

export default SpringPendulumMeta;
