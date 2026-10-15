import type { PulseComponentMeta } from "../../types/component";

export const CronScheduleBuilderMeta: PulseComponentMeta = {
  title: "Cron Schedule Builder",
  description:
    "Visual 5-segment Quartz/cron schedule builder with natural English translation, quick presets (hourly, daily, weekdays), input validation hints, and upcoming execution timeline preview.",
  tagline: "Visual 5-segment cron schedule builder with natural English translation.",
  category: "Inputs",
  badges: ["New", "DevTools", "Cron", "Utility"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "cron builder",
    "quartz cron",
    "schedule selector",
    "job scheduler",
    "cron expression",
    "github actions cron",
  ],
  features: [
    "5 segmented fields for Minute, Hour, Day of Month, Month, and Day of Week.",
    "Real-time human-readable natural language translation.",
    "Quick presets for common schedules like weekdays, hourly, and midnight.",
    "Preview of the next 3 scheduled execution timestamps.",
    "One-click copy of the active cron string.",
  ],
  accessibility: [
    "Semantic text input elements with descriptive hint labels.",
    "Keyboard accessible preset pills.",
  ],
  props: [
    {
      name: "initialCron",
      type: "string",
      default: '"0 9 * * 1-5"',
      description: "Default 5-part cron expression string.",
    },
    {
      name: "onChange",
      type: "(cron: string, humanDescription: string) => void",
      description: "Callback invoked whenever cron string changes.",
    },
  ],
  usageCode: `import { CronScheduleBuilder } from "@/components/ui/CronScheduleBuilder";

export function Example() {
  return (
    <CronScheduleBuilder
      initialCron="0 9 * * 1-5"
      onChange={(cron, desc) => console.log(cron, desc)}
    />
  );
}`,
};

export default CronScheduleBuilderMeta;
