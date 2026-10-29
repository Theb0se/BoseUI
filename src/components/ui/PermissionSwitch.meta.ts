import type { PulseComponentMeta } from "../../types/component";

export const PermissionSwitchMeta: PulseComponentMeta = {
  title: "Permission Switch",
  description:
    "Tactile segmented control where the selected option expands to reveal its label while others collapse to icon-only, with a sliding pill and blur transitions.",
  tagline: "Adaptive segmented control with active label expansion and sliding pill indicator.",
  category: "Inputs",
  badges: ["Segmented Control", "Adaptive Width", "A11y Radiogroup", "Active Motion"],
  createdAt: "2026-10-29",
  featured: true,
  keywords: [
    "permission switch",
    "segmented control react",
    "adaptive pill switch",
    "expanding segmented tabs",
    "framer motion toggle",
    "radiogroup switch",
  ],
  features: [
    "Dynamically measures label dimensions on render to smoothly animate container width and pill translation.",
    "Active tab expands gracefully with blur and opacity crossfades while inactive tabs collapse to icons.",
    "Optional activeMotion prop enables a luxurious, slow-motion elastic expansion on selection change.",
    "Strictly prop-driven: pass custom labels, values, and Lucide icons directly through props.",
  ],
  accessibility: [
    "Full WAI-ARIA radiogroup pattern with arrow key (ArrowLeft, ArrowRight, ArrowUp, ArrowDown), Home, and End navigation.",
    "Automatic tabIndex management focusing active option and maintaining clean keyboard focus outline rings.",
    "Respects prefers-reduced-motion by bypassing transition durations and updating layout instantly.",
  ],
  props: [
    {
      name: "options",
      type: "PermissionOption[]",
      default: "DEFAULT_PERMISSION_OPTIONS",
      description: "Array of selectable option items with value, label, and optional icon component.",
    },
    {
      name: "value",
      type: "string",
      default: "undefined",
      description: "Controlled active option value.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '"allow"',
      description: "Initial uncontrolled active option value.",
    },
    {
      name: "onChange",
      type: "(value: string) => void",
      default: "undefined",
      description: "Callback triggered when the user selects a different option.",
    },
    {
      name: "activeMotion",
      type: "boolean",
      default: "false",
      description: "If true, expands the active tab with a slower, cinematic expansion curve on selection.",
    },
    {
      name: "slowDuration",
      type: "number",
      default: "780",
      description: "Transition duration in milliseconds when activeMotion is enabled.",
    },
    {
      name: "duration",
      type: "number",
      default: "460",
      description: "Standard transition duration in milliseconds when activeMotion is false.",
    },
    {
      name: "aria-label",
      type: "string",
      default: '"Permission"',
      description: "Accessible ARIA label describing the radiogroup purpose.",
    },
  ],
  usageCode: `import { useState } from "react";
import { PermissionSwitch, type PermissionOption } from "@/components/ui/permission-switch";
import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";

const customOptions: PermissionOption[] = [
  { value: "grant", label: "Full Access", icon: ShieldCheck },
  { value: "review", label: "Ask Approval", icon: ShieldAlert },
  { value: "block", label: "Restricted", icon: ShieldOff },
];

export function Example() {
  const [permission, setPermission] = useState("grant");

  return (
    <PermissionSwitch
      options={customOptions}
      value={permission}
      onChange={setPermission}
      activeMotion={true}
    />
  );
}`,
};

export default PermissionSwitchMeta;
