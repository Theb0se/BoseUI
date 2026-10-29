import type { PulseComponentMeta } from "../../types/component";

export const MinimalAuthCardMeta: PulseComponentMeta = {
  title: "Minimal Auth Card",
  description:
    "Clean and minimal authentication card featuring animated Sign In and Sign Up tab switching, Google, Apple, and GitHub OAuth buttons, and password strength validation.",
  tagline:
    "Minimal authentication card with animated mode switching and Google, Apple, and GitHub OAuth.",
  category: "Inputs",
  badges: ["Authentication", "OAuth Ready", "Framer Motion", "Forms"],
  createdAt: "2026-10-30",
  featured: true,
  keywords: [
    "minimal auth card",
    "login signup component",
    "google apple github oauth",
    "authentication form",
    "framer motion auth",
    "password strength indicator",
    "react login card",
    "minimal login form",
  ],
  features: [
    "Seamless animated segmented tab switching between Sign In and Sign Up modes with layoutId spring physics.",
    "Integrated OAuth buttons with official SVG logos for Google, Apple, and GitHub.",
    "Interactive password visibility toggling and real-time 4-stage password strength scoring.",
    "Accessible form validation with remember me and terms agreement controls.",
    "Complete dark and light theme support with subtle ambient lighting and micro-border styling.",
  ],
  accessibility: [
    "Semantic form elements with associated labels and unique generated IDs.",
    "Full keyboard navigation and visible focus rings across inputs and action buttons.",
    "Honors prefers-reduced-motion by bypassing layout spring transitions during mode switches.",
  ],
  props: [
    {
      name: "defaultMode",
      type: '"signin" | "signup"',
      default: '"signin"',
      description: "Initial authentication mode shown when the card renders.",
    },
    {
      name: "brandName",
      type: "string",
      default: '"Pulse"',
      description: "Product or organization name displayed in the card header.",
    },
    {
      name: "tagline",
      type: "string",
      default: '"Welcome back to your workspace"',
      description: "Welcoming descriptive message beneath the brand header.",
    },
    {
      name: "logo",
      type: "ReactNode",
      default: "undefined",
      description: "Custom logo or icon component rendered at the top of the card.",
    },
    {
      name: "onSubmit",
      type: "(data: AuthFormData) => void",
      default: "undefined",
      description: "Callback fired with form values when authentication is submitted.",
    },
    {
      name: "onOAuthClick",
      type: "(provider: OAuthProvider) => void",
      default: "undefined",
      description: "Callback fired when Google, Apple, or GitHub button is clicked.",
    },
    {
      name: "onModeChange",
      type: "(mode: AuthMode) => void",
      default: "undefined",
      description: "Callback triggered whenever the user switches between Sign In and Sign Up.",
    },
    {
      name: "onForgotPassword",
      type: "() => void",
      default: "undefined",
      description: "Callback triggered when the 'Forgot password?' link is clicked.",
    },
    {
      name: "className",
      type: "string",
      default: "undefined",
      description: "Additional Tailwind CSS classes merged onto the card container.",
    },
  ],
  usageCode: `import { MinimalAuthCard, type AuthFormData, type OAuthProvider } from "@/components/ui/minimal-auth-card";

export function AuthDemo() {
  const handleSubmit = (data: AuthFormData) => {
    console.log("Auth submit:", data);
  };

  const handleOAuth = (provider: OAuthProvider) => {
    console.log("OAuth clicked:", provider);
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] p-6 bg-neutral-50 dark:bg-neutral-950">
      <MinimalAuthCard
        brandName="Pulse"
        onSubmit={handleSubmit}
        onOAuthClick={handleOAuth}
      />
    </div>
  );
}`,
};

export default MinimalAuthCardMeta;
