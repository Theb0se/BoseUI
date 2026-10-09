import type { PulseComponentMeta } from "../../types/component";

export const NowPlayingWaveformMeta: PulseComponentMeta = {
  title: "Now Playing Waveform",
  description:
    "Spotify-style music player featuring dancing multi-octave equalizer frequency bars, spinning vinyl cover artwork, scrubbable progress bar with hover time tooltip, and playback controls.",
  tagline: "Spotify-inspired media player with real-time reactive dancing waveform bars.",
  category: "Motion" as any,
  badges: ["Spotify", "Waveform", "Audio Player", "Equalizer"],
  createdAt: "2026-10-09",
  featured: true,
  keywords: [
    "now playing waveform",
    "spotify player",
    "audio frequency visualizer",
    "equalizer bars",
    "scrubbable timeline",
    "music player ui",
    "framer motion music",
  ],
  features: [
    "32 reactive audio equalizer bars oscillating dynamically to simulate real-time audio playback.",
    "Rotating vinyl sleeve simulation with dynamic track-specific background glow halos.",
    "Scrubbable timeline with precision cursor hover tooltip and simulated playback progression.",
    "Comprehensive media controls: Play/Pause, Next/Prev, Shuffle, and 3-state Repeat.",
    "Quick track switcher allowing seamless preview of different music genres and color themes.",
  ],
  accessibility: [
    "Full semantic button labeling with dynamic play/pause state communication.",
    "Scrubber input accessible via click, drag, and standard volume sliders.",
    "Equalizer animation gracefully responds to paused states without layout shifts.",
  ],
  props: [
    {
      name: "tracks",
      type: "TrackItem[]",
      description: "Array of music track objects with metadata, colors, and duration.",
    },
    {
      name: "initialPlaying",
      type: "boolean",
      default: "true",
      description: "Whether the audio playback visualizer starts in active playing state.",
    },
    {
      name: "className",
      type: "string",
      description: "Optional custom CSS classes for the container wrapper.",
    },
  ],
  usageCode: `import { NowPlayingWaveform } from "@/components/ui/now-playing-waveform";

export function Example() {
  return (
    <NowPlayingWaveform
      initialPlaying={true}
    />
  );
}`,
};

export default NowPlayingWaveformMeta;
