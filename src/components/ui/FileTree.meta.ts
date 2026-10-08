import type { PulseComponentMeta } from "../../types/component";

export const FileTreeMeta: PulseComponentMeta = {
  title: "File Tree",
  description:
    "Hierarchical file and folder explorer with animated expand/collapse transitions, instant file search filtering, and active path tracking.",
  tagline: "Animated nested folder tree with instant file filtering.",
  category: "Navigation",
  badges: ["Tree View", "Searchable", "Animated"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "file tree",
    "folder explorer",
    "tree view react",
    "directory tree",
    "collapsible tree",
  ],
  features: [
    "Recursive nested folders with smooth Framer Motion height transitions.",
    "Built-in instant search bar that auto-expands matching file paths.",
    "Supports custom badges, file type icons, and selection callbacks.",
  ],
  accessibility: [
    "Uses semantic role='tree', role='treeitem', and role='group' attributes.",
    "Announces folder open/close state via aria-expanded and selection via aria-selected.",
    "Respects prefers-reduced-motion when expanding or collapsing directories.",
  ],
  props: [
    {
      name: "data",
      type: "FileTreeNode[]",
      description: "Hierarchical array of folder and file nodes.",
    },
    {
      name: "defaultExpandedIds",
      type: "string[]",
      default: '["src", "src/components"]',
      description: "Array of folder IDs expanded on initial render.",
    },
    {
      name: "defaultSelectedId",
      type: "string",
      description: "ID of the initially highlighted file or folder.",
    },
    {
      name: "onSelect",
      type: "(node: FileTreeNode) => void",
      description: "Callback fired when a file or folder item is clicked.",
    },
    {
      name: "searchable",
      type: "boolean",
      default: "true",
      description: "Renders an instant filter input at the top of the tree.",
    },
  ],
  usageCode: `import { FileTree } from "@/components/ui/file-tree";

export function Example() {
  return (
    <FileTree
      searchable
      onSelect={(node) => console.log("Selected:", node.id)}
    />
  );
}`,
};

export default FileTreeMeta;
