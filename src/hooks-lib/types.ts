export type HookCategory =
  | "Timing"
  | "State"
  | "DOM & Events"
  | "Data & Async"
  | "Utilities";

export const HOOK_CATEGORIES: HookCategory[] = [
  "Timing",
  "State",
  "DOM & Events",
  "Data & Async",
  "Utilities",
];

export interface HookParamMeta {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface HookReturnMeta {
  name: string;
  type: string;
  description: string;
}

export interface HookExampleMeta {
  title: string;
  code: string;
}

export interface HookMeta {
  slug: string;
  name: string;
  description: string;
  category: HookCategory;
  tags: string[];
  isNew: boolean;
  ssrSafe: boolean;
  sizeBytes: number;
  dependencies: string[];
  filePath: string;
  params: HookParamMeta[];
  returns: HookReturnMeta[];
  examples: HookExampleMeta[];
  notes: string[];
}
