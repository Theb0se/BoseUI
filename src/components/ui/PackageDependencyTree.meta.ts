import type { PulseComponentMeta } from "../../types/component";

export const PackageDependencyTreeMeta: PulseComponentMeta = {
  title: "Package Dependency Tree",
  description:
    "Bundlephobia and Socket.dev inspired package dependency inspector with direct and transitive node nesting, license badges, vulnerability advisories, bundle size calculations, and install script copying.",
  tagline: "Interactive package dependency tree with bundle size and license inspection.",
  category: "Cards",
  badges: ["New", "DevTools", "Packages", "NPM"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "package dependency tree",
    "bundlephobia card",
    "npm dependency viewer",
    "bundle size inspector",
    "transitive dependencies",
    "license badge",
  ],
  features: [
    "Collapsible hierarchical tree view of direct and transitive packages.",
    "Calculated bundle size metrics and open-source license tags.",
    "Real-time text filter across package names.",
    "Security vulnerability advisory alerts.",
  ],
  accessibility: [
    "Keyboard accessible tree nodes with aria-expanded states.",
    "Clear visual contrasts for warning and security indicators.",
  ],
  props: [
    {
      name: "packageName",
      type: "string",
      default: '"boseui"',
      description: "Root package name.",
    },
    {
      name: "version",
      type: "string",
      default: '"1.0.0"',
      description: "Root package semver string.",
    },
    {
      name: "bundleSizeKb",
      type: "number",
      default: "60.8",
      description: "Total minified and gzipped bundle size in kilobytes.",
    },
  ],
  usageCode: `import { PackageDependencyTree } from "@/components/ui/PackageDependencyTree";

export function Example() {
  return (
    <PackageDependencyTree
      packageName="boseui"
      version="1.0.0"
      bundleSizeKb={60.8}
    />
  );
}`,
};

export default PackageDependencyTreeMeta;
