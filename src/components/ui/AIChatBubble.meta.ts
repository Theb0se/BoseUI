import type { PulseComponentMeta } from "../../types/component";

export const AIChatBubbleMeta: PulseComponentMeta = {
  title: "AI Chat Bubble",
  description:
    "Spring-entrance chat message bubble for AI interfaces. Supports user (right, filled) and assistant (left, outlined) roles, animated typing dots state, optional avatar initials, and timestamp.",
  tagline: "Physics spring-entrance chat bubble for AI conversation UIs.",
  category: "Cards",
  badges: ["New", "AI", "Chat"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "chat bubble",
    "ai chat",
    "message bubble",
    "chat ui",
    "ai conversation",
    "typing indicator",
  ],
  features: [
    "Spring entrance animation: y:16→0 + opacity fade.",
    "Role-aware layout: user right-aligned filled, assistant left outlined.",
    "Typing dots variant with staggered bounce animation.",
    "Optional avatar initials and timestamp.",
    "prefers-reduced-motion: static render without animation.",
  ],
  accessibility: [
    "Text content fully accessible to screen readers.",
    "No motion when prefers-reduced-motion is set.",
  ],
  props: [
    {
      name: "role",
      type: '"user" | "assistant"',
      description: "Controls bubble alignment and color scheme.",
    },
    {
      name: "content",
      type: "string",
      description: "Message text content.",
    },
    {
      name: "typing",
      type: "boolean",
      default: "false",
      description: "Show animated typing dots instead of content.",
    },
    {
      name: "avatar",
      type: "string",
      description: "Optional avatar initials or emoji.",
    },
    {
      name: "timestamp",
      type: "string",
      description: "Optional timestamp string shown below content.",
    },
  ],
  usageCode: `import { AIChatBubble } from "@/components/ui/ai-chat-bubble";

export function Example() {
  return (
    <div className="flex flex-col gap-3 p-4 max-w-md">
      <AIChatBubble role="user" content="How do I center a div?" avatar="U" />
      <AIChatBubble role="assistant" typing />
      <AIChatBubble
        role="assistant"
        content="Use flexbox: display: flex; align-items: center; justify-content: center;"
        avatar="AI"
        timestamp="Just now"
      />
    </div>
  );
}`,
};

export default AIChatBubbleMeta;
