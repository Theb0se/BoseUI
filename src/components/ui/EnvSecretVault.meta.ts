import type { PulseComponentMeta } from "../../types/component";

export const EnvSecretVaultMeta: PulseComponentMeta = {
  title: "Environment Secret Vault",
  description:
    "Vercel and Doppler inspired encrypted environment variable manager with environment scope tags (Production, Preview, Development), masked values, individual and global reveal toggles, and .env export.",
  tagline: "Encrypted environment secret manager with masked values and .env export.",
  category: "Cards",
  badges: ["New", "DevTools", "Security", "Secrets"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "env vault",
    "secret manager",
    "vercel env",
    "masked secrets",
    "dotenv export",
    "environment variables",
  ],
  features: [
    "Environment scope pills for Production, Preview, and Local development.",
    "Individual eye toggles and global Reveal All / Mask All controls.",
    "One-click Copy as .env file format.",
    "Inline interactive Add Secret form with uppercase key enforcement.",
  ],
  accessibility: [
    "Accessible toggle buttons with clear screen-reader state cues.",
    "High-contrast environment badges.",
  ],
  props: [
    {
      name: "projectName",
      type: "string",
      default: '"boseui-production"',
      description: "Project identifier shown in vault header.",
    },
    {
      name: "initialVariables",
      type: "EnvVariable[]",
      description: "List of starting environment key-value pairs.",
    },
  ],
  usageCode: `import { EnvSecretVault } from "@/components/ui/EnvSecretVault";

export function Example() {
  return (
    <EnvSecretVault
      projectName="acme-production"
    />
  );
}`,
};

export default EnvSecretVaultMeta;
