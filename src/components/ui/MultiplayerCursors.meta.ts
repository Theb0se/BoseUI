import type { PulseComponentMeta } from "../../types/component";

export const MultiplayerCursorsMeta: PulseComponentMeta = {
  title: "Multiplayer Cursors",
  description:
    "Figma-style real-time collaboration canvas with animated multiplayer cursor pointers, user name tags, color badges, interactive live cursor chat bubbles, and click ripple wave broadcasts.",
  tagline: "Figma-style real-time multiplayer canvas with animated cursors and live speech bubbles.",
  category: "Motion" as any,
  badges: ["Collaboration", "Multiplayer", "Live Presence"],
  createdAt: "2026-10-09",
  keywords: [
    "multiplayer cursors",
    "figma cursors",
    "live collaboration",
    "real-time presence",
    "cursor chat",
    "webrtc presence",
    "canvas cursors",
  ],
  features: [
    "Authentic Figma-geometry SVG cursor arrows paired with colored user name badges.",
    "Integrated live cursor chat bubble broadcasts with spring scale and fade animations.",
    "Click wave propagation displaying expanding ripple rings from pointer interactions.",
    "Simulated autonomous collaborator wander motion with pause and resume toggles.",
    "Instant collaborator addition and customizable presence status indicators.",
  ],
  accessibility: [
    "Announces presence joined and chat message broadcasts for screen reader users via aria-live.",
    "Supports keyboard shortcut triggers and accessible input forms for sending chat messages.",
    "Respects reduced-motion preferences by turning off wandering trajectories.",
  ],
  props: [
    {
      name: "initialCollaborators",
      type: "Collaborator[]",
      description: "Array of collaborator objects containing id, name, color, coordinates, and messages.",
    },
    {
      name: "showGrid",
      type: "boolean",
      default: "true",
      description: "Whether to render a Figma-style radial dot grid background.",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes to apply to the root container.",
    },
  
    {
      name: "overlayOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Render cursors as an transparent overlay without outer card container",
      required: false,
    },
  ],
  usageCode: `import { MultiplayerCursors } from "@/components/ui/MultiplayerCursors";

export function Example() {
  return (
    <MultiplayerCursors
      showGrid={true}
      initialCollaborators={[
        {
          id: "user-1",
          name: "Amara Okafor",
          color: "#8b5cf6",
          x: 35,
          y: 40,
          message: "Reviewing the payment flows",
          state: "active",
        },
      ]}
    />
  );
}`,
};

export default MultiplayerCursorsMeta;
