import type { PulseComponentMeta } from "../../types/component";

export const CipherScrambleTextMeta: PulseComponentMeta = {
  title: "Cipher Scramble Text",
  description:
    "Cryptographic matrix text decoder that permutes characters through a high-frequency glyph wave on pointer hover, focus, or click.",
  tagline: "Cryptographic glyph permutation wave with screen-reader safety.",
  category: "Text",
  badges: ["New", "Cipher Wave", "A11y Safe"],
  createdAt: "2026-10-07",
  featured: true,
  keywords: [
    "cipher scramble text",
    "matrix text effect",
    "scramble text decode",
    "cryptographic typography",
    "framer motion text",
  ],
  features: [
    "Progressive left-to-right cryptographic character lock-in with customizable glyph pool and frame cadence.",
    "Triggers seamlessly on pointer hover, keyboard focus, or tactile click.",
    "Pairs an sr-only canonical string with an aria-hidden visual stream so screen readers never read scrambled noise.",
  ],
  accessibility: [
    "Exposes the decoded canonical string inside an sr-only node while marking the permuting glyph stream aria-hidden='true'.",
    "Fully keyboard-triggerable via Tab focus or Enter/Space activation.",
    "Bypasses character scrambling immediately when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "text",
      type: "string",
      default: '"ZERO-DEPENDENCY KINETIC PRIMITIVES"',
      description: "Target decoded text string.",
    },
    {
      name: "charset",
      type: "string",
      default: '"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>?"',
      description: "Pool of cipher characters sampled during scramble frames.",
    },
    {
      name: "frameInterval",
      type: "number",
      default: "28",
      description: "Duration of each scramble frame tick in milliseconds.",
    },
    {
      name: "cyclesPerChar",
      type: "number",
      default: "2",
      description: "Number of scramble ticks per character before locking into place.",
    },
  ],
  usageCode: `import { CipherScrambleText } from "@/components/ui/cipher-scramble-text";

export function Example() {
  return (
    <CipherScrambleText
      text="ZERO-DEPENDENCY KINETIC PRIMITIVES"
      frameInterval={28}
      cyclesPerChar={2}
    />
  );
}`,
};

export default CipherScrambleTextMeta;
