import type React from "react";

export type ComponentCategory =
  | "Motion"
  | "Buttons"
  | "Cards"
  | "Navigation"
  | "Text"
  | "Backgrounds"
  | "Overlays"
  | "Inputs"
  | "Mockups";

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  "Motion",
  "Buttons",
  "Cards",
  "Navigation",
  "Text",
  "Backgrounds",
  "Overlays",
  "Inputs",
  "Mockups",
];

export interface ComponentPropMeta {
  name: string;
  type: string;
  default?: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

export interface PulseComponentMeta {
  title: string;
  description: string;
  tagline: string;
  category?: ComponentCategory;
  badges: string[];
  createdAt: string;
  featured?: boolean;
  keywords?: string[];
  features: string[];
  accessibility: string[];
  props: ComponentPropMeta[];
  usageCode: string;
  Demo?: React.ComponentType;
}

export type BoseUIComponentMeta = PulseComponentMeta;

export interface PulseComponentCatalogEntry
  extends Omit<PulseComponentMeta, "Demo" | "category"> {
  category: ComponentCategory;
  /** Kebab-case component slug (e.g., "magnetic-button") */
  id: string;
  /** Alias for id */
  slug: string;
  /** PascalCase component identifier (e.g., "MagneticButton") */
  componentName: string;
  /** Relative source path ("src/components/ui/MagneticButton.tsx") */
  filePath: string;
  /** Full shadcn CLI command */
  cliCommand: string;
  /** Auto-detected external npm package dependencies */
  dependencies: string[];
  /** Raw .tsx source code embedded at sync time */
  sourceCode: string;
}

export interface CatalogIndexEntry {
  id: string;
  slug: string;
  componentName: string;
  title: string;
  description: string;
  tagline: string;
  category: ComponentCategory;
  badges: string[];
  createdAt: string;
  featured: boolean;
  keywords: string[];
}
