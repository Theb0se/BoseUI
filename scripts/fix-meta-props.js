const fs = require("fs");
const path = require("path");

const uiDir = path.join(process.cwd(), "src/components/ui");

const MISSING_PROPS_DICT = {
  "AutoplayStoryCarousel.meta.ts": [
    {
      name: "showHeader",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to render header controls and story metadata chip",
      required: false,
    },
    {
      name: "showControls",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to show navigation arrows and pause/play controls",
      required: false,
    },
  ],
  "ColorFinishPicker.meta.ts": [
    {
      name: "showHeader",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to display the header title and titanium finish spec label",
      required: false,
    },
  ],
  "DockMagnification.meta.ts": [
    {
      name: "embedded",
      type: "boolean",
      defaultValue: "false",
      description: "Whether the dock renders embedded inside container rather than fixed to viewport",
      required: false,
    },
  ],
  "ElasticDock.meta.ts": [
    {
      name: "defaultActiveId",
      type: "string",
      defaultValue: "undefined",
      description: "Identifier of the initially active dock item",
      required: false,
    },
    {
      name: "onSelect",
      type: "(item: ElasticDockItem) => void",
      defaultValue: "undefined",
      description: "Callback fired when a dock icon is selected",
      required: false,
    },
  ],
  "ElasticSnapSortable.meta.ts": [
    {
      name: "onReorder",
      type: "(items: ElasticSortableItem[]) => void",
      defaultValue: "undefined",
      description: "Callback fired when items are reordered via drag-and-drop",
      required: false,
    },
  ],
  "ElasticTagInput.meta.ts": [
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"Add tag..."',
      description: "Placeholder text displayed in the tag input field",
      required: false,
    },
    {
      name: "onChange",
      type: "(tags: string[]) => void",
      defaultValue: "undefined",
      description: "Callback fired whenever the list of tags updates",
      required: false,
    },
  ],
  "ExpandableBentoCard.meta.ts": [
    {
      name: "summary",
      type: "string",
      defaultValue: "undefined",
      description: "Short summary text displayed when the card is collapsed",
      required: false,
    },
  ],
  "ExpandingSearchPill.meta.ts": [
    {
      name: "embedded",
      type: "boolean",
      defaultValue: "false",
      description: "Whether pill renders embedded in container or floating with fixed coordinates",
      required: false,
    },
  ],
  "GlobeArcs.meta.ts": [
    {
      name: "showHeader",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to render the telemetry title and status indicator header",
      required: false,
    },
    {
      name: "showControls",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to show rotation speed and arc interaction sliders",
      required: false,
    },
  ],
  "GradientMeshHero.meta.ts": [
    {
      name: "preset",
      type: '"aurora" | "sunset" | "neon" | "ocean"',
      defaultValue: '"aurora"',
      description: "Active color gradient palette preset for background blobs",
      required: false,
    },
    {
      name: "headline",
      type: "string",
      defaultValue: "undefined",
      description: "Main headline text rendered in the hero section",
      required: false,
    },
    {
      name: "description",
      type: "string",
      defaultValue: "undefined",
      description: "Subtitle or supporting paragraph under the headline",
      required: false,
    },
    {
      name: "primaryCtaText",
      type: "string",
      defaultValue: '"Get Started"',
      description: "Label for the primary call-to-action button",
      required: false,
    },
    {
      name: "secondaryCtaText",
      type: "string",
      defaultValue: '"Documentation"',
      description: "Label for the secondary action button",
      required: false,
    },
  ],
  "KeycapChips.meta.ts": [
    {
      name: "keys",
      type: "string[]",
      defaultValue: "[]",
      description: "Array of individual keycap symbols to render",
      required: false,
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Whether keycaps render inline with prose text",
      required: false,
    },
    {
      name: "onShortcutPress",
      type: "(shortcut: ShortcutCombo) => void",
      defaultValue: "undefined",
      description: "Callback triggered when physical shortcut combination is activated",
      required: false,
    },
  ],
  "KineticSlider.meta.ts": [
    {
      name: "value",
      type: "number",
      defaultValue: "undefined",
      description: "Controlled numeric value for the slider",
      required: false,
    },
    {
      name: "stiffness",
      type: "number",
      defaultValue: "300",
      description: "Spring tension for kinetic dragging physics",
      required: false,
    },
    {
      name: "damping",
      type: "number",
      defaultValue: "28",
      description: "Spring damping coefficient",
      required: false,
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Callback fired when slider value changes",
      required: false,
    },
  ],
  "KineticSwipeButton.meta.ts": [
    {
      name: "onComplete",
      type: "() => void",
      defaultValue: "undefined",
      description: "Callback executed when the swipe handle passes completion threshold",
      required: false,
    },
  ],
  "LiquidPillTabs.meta.ts": [
    {
      name: "activeTab",
      type: "string",
      defaultValue: "undefined",
      description: "Controlled identifier for the active tab",
      required: false,
    },
    {
      name: "onChange",
      type: "(tabId: string) => void",
      defaultValue: "undefined",
      description: "Callback fired when active tab selection changes",
      required: false,
    },
  ],
  "MagneticBreadcrumb.meta.ts": [
    {
      name: "onSelect",
      type: "(item: BreadcrumbItem) => void",
      defaultValue: "undefined",
      description: "Callback fired when a breadcrumb node is clicked",
      required: false,
    },
  ],
  "MagneticPopoverMenu.meta.ts": [
    {
      name: "onSelect",
      type: "(item: MenuItem) => void",
      defaultValue: "undefined",
      description: "Callback fired when an action item is selected",
      required: false,
    },
  ],
  "ModalPopup.meta.ts": [
    {
      name: "trigger",
      type: "React.ReactNode",
      defaultValue: "undefined",
      description: "Custom trigger element used to toggle modal open state",
      required: false,
    },
  ],
  "MorphingActionButton.meta.ts": [
    {
      name: "simulateError",
      type: "boolean",
      defaultValue: "false",
      description: "Whether clicking triggers simulated error state for UI verification",
      required: false,
    },
  ],
  "MorphingDialog.meta.ts": [
    {
      name: "dialogDescription",
      type: "string",
      defaultValue: "undefined",
      description: "Expanded description text within the dialog modal",
      required: false,
    },
    {
      name: "open",
      type: "boolean",
      defaultValue: "undefined",
      description: "Controlled open/closed state of the dialog",
      required: false,
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      defaultValue: "undefined",
      description: "Callback fired when dialog open state toggles",
      required: false,
    },
  ],
  "MorphingMegaMenu.meta.ts": [
    {
      name: "embedded",
      type: "boolean",
      defaultValue: "false",
      description: "Whether menu renders embedded within container rather than fixed top",
      required: false,
    },
  ],
  "MultiplayerCursors.meta.ts": [
    {
      name: "overlayOnly",
      type: "boolean",
      defaultValue: "false",
      description: "Render cursors as an transparent overlay without outer card container",
      required: false,
    },
  ],
  "ProductSequenceScrubber.meta.ts": [
    {
      name: "showHeader",
      type: "boolean",
      defaultValue: "true",
      description: "Whether to render header title, hardware specs badge, and action CTA",
      required: false,
    },
  ],
  "RadialMenuOrb.meta.ts": [
    {
      name: "onSelect",
      type: "(actionId: string) => void",
      defaultValue: "undefined",
      description: "Callback fired when an action radial slice is selected",
      required: false,
    },
  ],
  "ReactionPicker.meta.ts": [
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Whether reaction bar is rendered inline with content or in popover",
      required: false,
    },
  ],
  "RippleBurstButton.meta.ts": [
    {
      name: "onClick",
      type: "(e: React.MouseEvent<HTMLButtonElement>) => void",
      defaultValue: "undefined",
      description: "Standard button click handler callback",
      required: false,
    },
  ],
  "RollingNumberTicker.meta.ts": [
    {
      name: "fontSize",
      type: "number",
      defaultValue: "48",
      description: "Numeric font size in pixels for the rolling odometer digits",
      required: false,
    },
  ],
  "RotarySpringDial.meta.ts": [
    {
      name: "stiffness",
      type: "number",
      defaultValue: "240",
      description: "Spring stiffness for dial rotation snapping",
      required: false,
    },
    {
      name: "damping",
      type: "number",
      defaultValue: "24",
      description: "Spring damping coefficient",
      required: false,
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Callback fired when dial angle value changes",
      required: false,
    },
  ],
  "ScrubbableNumberInput.meta.ts": [
    {
      name: "value",
      type: "number",
      defaultValue: "undefined",
      description: "Controlled numeric value",
      required: false,
    },
    {
      name: "pixelsPerStep",
      type: "number",
      defaultValue: "8",
      description: "Mouse scrub sensitivity in pixels moved per step increment",
      required: false,
    },
    {
      name: "onChange",
      type: "(val: number) => void",
      defaultValue: "undefined",
      description: "Callback fired when numeric value updates",
      required: false,
    },
  ],
  "ScrubbableSparkline.meta.ts": [
    {
      name: "minimal",
      type: "boolean",
      defaultValue: "false",
      description: "Compact sparkline display mode hiding telemetry header and stats",
      required: false,
    },
  ],
  "SpringPinInput.meta.ts": [
    {
      name: "onComplete",
      type: "(pin: string) => void",
      defaultValue: "undefined",
      description: "Callback executed once all PIN code digits are filled",
      required: false,
    },
  ],
};

let updatedCount = 0;

for (const [metaFileName, missingProps] of Object.entries(MISSING_PROPS_DICT)) {
  const metaFilePath = path.join(uiDir, metaFileName);
  if (!fs.existsSync(metaFilePath)) {
    console.error(`File not found: ${metaFilePath}`);
    continue;
  }

  let content = fs.readFileSync(metaFilePath, "utf8");

  // Locate the props: [ ... ] section
  const propsMatch = content.match(/props:\s*\[([\s\S]*?)\]\s*,/);
  if (!propsMatch) {
    console.error(`Could not match props array in: ${metaFileName}`);
    continue;
  }

  const existingPropsStr = propsMatch[1];
  
  // Format missing props into clean TypeScript object literals
  const propEntries = missingProps.map((p) => {
    return `    {
      name: "${p.name}",
      type: "${p.type}",
      defaultValue: ${p.defaultValue.startsWith('"') ? p.defaultValue : `"${p.defaultValue}"`},
      description: "${p.description}",
      required: ${p.required},
    },`;
  });

  const insertion = "\n" + propEntries.join("\n");
  
  // Replace the closing bracket of the props array
  const fullMatched = propsMatch[0];
  const newFullMatched = fullMatched.replace(/\]\s*,/, insertion + "\n  ],");

  content = content.replace(fullMatched, newFullMatched);
  fs.writeFileSync(metaFilePath, content, "utf8");
  console.log(`Updated ${metaFileName} with ${missingProps.length} props.`);
  updatedCount++;
}

console.log(`\nSuccessfully updated ${updatedCount} meta files!`);
