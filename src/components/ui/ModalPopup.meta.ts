import type { PulseComponentMeta } from "../../types/component";

export const ModalPopupMeta: PulseComponentMeta = {
  title: "Modal Popup",
  description:
    "Animated popup modal dialog with spring scale transitions, top-level portal rendering, danger/confirm variants, and Escape dismissal.",
  tagline: "Spring-animated dialog popup with backdrop blur and keyboard support.",
  category: "Overlays",
  badges: ["Dialog", "Portal", "Accessible"],
  createdAt: "2026-10-08",
  featured: true,
  keywords: [
    "modal",
    "popup",
    "dialog",
    "confirmation modal",
    "framer motion modal",
    "tailwind dialog",
  ],
  features: [
    "Renders into document.body via React portal at z-[9999] with background scroll locking.",
    "Supports sm, md, and lg width presets plus default and danger confirmation variants.",
    "Works both controlled and uncontrolled with custom trigger and optional hideFooter.",
  ],
  accessibility: [
    "Uses semantic role='dialog' and aria-modal='true'.",
    "Dismisses immediately when pressing Escape or clicking outside the dialog.",
    "Disables scale/translate motion when prefers-reduced-motion is enabled.",
  ],
  props: [
    {
      name: "open",
      type: "boolean",
      description: "Controlled open state.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial open state when used uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Callback fired when the modal open state changes.",
    },
    {
      name: "title",
      type: "string",
      default: '"Confirm Deployment"',
      description: "Primary heading text inside the modal dialog.",
    },
    {
      name: "description",
      type: "string",
      description: "Supporting description text below the title.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Maximum width preset of the modal card.",
    },
    {
      name: "variant",
      type: '"default" | "danger"',
      default: '"default"',
      description: "Visual style for the primary confirmation button.",
    },
    {
      name: "triggerLabel",
      type: "string",
      default: '"Open Popup"',
      description: "Label for the default trigger button.",
    },
    {
      name: "confirmLabel",
      type: "string",
      default: '"Confirm"',
      description: "Text label for the primary action button.",
    },
    {
      name: "cancelLabel",
      type: "string",
      default: '"Cancel"',
      description: "Text label for the cancel button.",
    },
    {
      name: "hideFooter",
      type: "boolean",
      default: "false",
      description: "Hides default Cancel/Confirm footer buttons when rendering a custom form.",
    },
    {
      name: "onConfirm",
      type: "() => void",
      description: "Callback executed when the user clicks the confirm button.",
    },
  
    {
      name: "trigger",
      type: "React.ReactNode",
      defaultValue: "undefined",
      description: "Custom trigger element used to toggle modal open state",
      required: false,
    },
  ],
  usageCode: `import { ModalPopup } from "@/components/ui/modal-popup";

export function Example() {
  return (
    <ModalPopup
      title="Publish Release v1.2"
      description="Are you sure you want to publish this release to the public registry?"
      triggerLabel="Publish Release"
      confirmLabel="Publish Now"
    />
  );
}`,
};

export default ModalPopupMeta;
