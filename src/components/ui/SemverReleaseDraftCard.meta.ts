import type { PulseComponentMeta } from "../../types/component";

export const SemverReleaseDraftCardMeta: PulseComponentMeta = {
  title: "Semver Release Draft Card",
  description:
    "GitHub Releases and Changesets inspired release notes generator with Semver bump selector (patch, minor, major), conventional commit categorization, Markdown changelog export, and release publishing.",
  tagline: "Conventional commit release drafter with automated Semver bump calculations.",
  category: "Cards",
  badges: ["New", "DevTools", "Git", "Releases"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "semver release",
    "github release drafter",
    "conventional commits",
    "changelog generator",
    "version bump",
    "changesets",
  ],
  features: [
    "Automatic semver bump calculation for Patch, Minor, and Major version updates.",
    "Categorized conventional commit list with breaking change warnings.",
    "Interactive commit selection checkboxes.",
    "Real-time Markdown release notes preview and clipboard copy.",
  ],
  accessibility: [
    "Accessible toggle controls with native checkboxes.",
    "Clear visual badges for commit classification.",
  ],
  props: [
    {
      name: "currentVersion",
      type: "string",
      default: '"v1.2.4"',
      description: "Previous release version tag.",
    },
    {
      name: "repoName",
      type: "string",
      default: '"boseui/core"',
      description: "Repository name identifier.",
    },
  ],
  usageCode: `import { SemverReleaseDraftCard } from "@/components/ui/SemverReleaseDraftCard";

export function Example() {
  return (
    <SemverReleaseDraftCard
      currentVersion="v1.2.4"
      repoName="acme/web"
      onPublish={(v, md) => console.log("Published", v, md)}
    />
  );
}`,
};

export default SemverReleaseDraftCardMeta;
