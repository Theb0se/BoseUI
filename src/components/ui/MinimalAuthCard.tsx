"use client";

import React, { useState, useId } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                 */
/* ------------------------------------------------------------------ */

export type AuthMode = "signin" | "signup";
export type OAuthProvider = "google" | "apple" | "github";

export interface AuthFormData {
  mode: AuthMode;
  name?: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface MinimalAuthCardProps {
  /** Initial mode of the auth card */
  defaultMode?: AuthMode;
  /** Brand or product title shown in the header */
  brandName?: string;
  /** Brand subtitle or welcome tagline */
  tagline?: string;
  /** Optional custom logo or icon component */
  logo?: React.ReactNode;
  /** Callback fired when form is submitted */
  onSubmit?: (data: AuthFormData) => void;
  /** Callback fired when an OAuth provider button is clicked */
  onOAuthClick?: (provider: OAuthProvider) => void;
  /** Callback fired when the active tab mode changes */
  onModeChange?: (mode: AuthMode) => void;
  /** Callback fired when 'Forgot password' is clicked */
  onForgotPassword?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* SVG OAuth Provider Icons                                            */
/* ------------------------------------------------------------------ */

export function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4 select-none", className)}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4 select-none", className)}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.61 1.34-.55.63-.99 1.66-.86 2.67 1 .08 1.9-.4 2.54-1.16" />
    </svg>
  );
}

export function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-4 w-4 select-none", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component: MinimalAuthCard                                    */
/* ------------------------------------------------------------------ */

export function MinimalAuthCard({
  defaultMode = "signin",
  brandName = "Pulse",
  tagline = "Welcome back to your workspace",
  logo,
  onSubmit,
  onOAuthClick,
  onModeChange,
  onForgotPassword,
  className,
}: MinimalAuthCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const formUid = useId();

  // Mode & Form state
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Switch between Sign in and Sign up modes
  const handleModeSwitch = (nextMode: AuthMode) => {
    setMode(nextMode);
    onModeChange?.(nextMode);
    setIsSuccess(false);
  };

  // Password strength calculation for signup
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 4
  }, [password]);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup" && !name) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit?.({
        mode,
        name: mode === "signup" ? name : undefined,
        email,
        password,
        rememberMe: mode === "signin" ? rememberMe : undefined,
      });

      setTimeout(() => setIsSuccess(false), 2500);
    }, 900);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[420px] mx-auto overflow-hidden rounded-[26px] border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300",
        className
      )}
    >
      {/* Subtle top ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-3xl"
      />

      {/* Header with Logo & Brand */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-200/60 dark:border-neutral-700/60">
          {logo ?? <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        </div>

        <h1 className="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {mode === "signin" ? `Welcome to ${brandName}` : `Create your ${brandName} account`}
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {mode === "signin" ? tagline : "Start your 14-day pro trial with zero commitment"}
        </p>
      </div>

      {/* Animated Segmented Tab Switcher */}
      <div className="relative z-10 mt-6 flex rounded-full bg-neutral-100 dark:bg-neutral-900/90 p-1 border border-neutral-200/60 dark:border-neutral-800/80">
        <button
          type="button"
          onClick={() => handleModeSwitch("signin")}
          className={cn(
            "relative z-10 flex-1 py-1.5 text-xs font-semibold transition-colors duration-200 text-center",
            mode === "signin"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          )}
        >
          {mode === "signin" && (
            <motion.div
              layoutId="auth-tab-pill"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-black/5 dark:border-white/5"
            />
          )}
          <span className="relative z-10">Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch("signup")}
          className={cn(
            "relative z-10 flex-1 py-1.5 text-xs font-semibold transition-colors duration-200 text-center",
            mode === "signup"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          )}
        >
          {mode === "signup" && (
            <motion.div
              layoutId="auth-tab-pill"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-black/5 dark:border-white/5"
            />
          )}
          <span className="relative z-10">Sign Up</span>
        </button>
      </div>

      {/* OAuth Provider Buttons (Google, Apple, GitHub) */}
      <div className="relative z-10 mt-6 grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => onOAuthClick?.("google")}
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] text-neutral-700 dark:text-neutral-300"
          aria-label="Continue with Google"
        >
          <GoogleLogo />
          <span className="text-xs font-medium">Google</span>
        </button>

        <button
          type="button"
          onClick={() => onOAuthClick?.("apple")}
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] text-neutral-800 dark:text-neutral-200"
          aria-label="Continue with Apple"
        >
          <AppleLogo />
          <span className="text-xs font-medium">Apple</span>
        </button>

        <button
          type="button"
          onClick={() => onOAuthClick?.("github")}
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] text-neutral-800 dark:text-neutral-200"
          aria-label="Continue with GitHub"
        >
          <GitHubLogo />
          <span className="text-xs font-medium">GitHub</span>
        </button>
      </div>

      {/* Or Divider */}
      <div className="relative z-10 my-6 flex items-center justify-center">
        <div className="w-full border-t border-neutral-200/80 dark:border-neutral-800" />
        <span className="absolute bg-white dark:bg-[#0c0c0e] px-3 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          or email
        </span>
      </div>

      {/* Main Email & Password Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {/* Full Name field (Signup mode only) */}
        <AnimatePresence initial={false}>
          {mode === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <label
                htmlFor={`${formUid}-name`}
                className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id={`${formUid}-name`}
                  type="text"
                  required
                  placeholder="Alexander Vane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Address */}
        <div>
          <label
            htmlFor={`${formUid}-email`}
            className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              id={`${formUid}-email`}
              type="email"
              required
              placeholder="alexander@pulse.design"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${formUid}-password`}
              className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            {mode === "signin" && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              id={`${formUid}-password`}
              type={showPassword ? "text" : "password"}
              required
              placeholder={mode === "signup" ? "Create a strong password" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 pl-9 pr-10 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password strength bar in signup mode */}
          {mode === "signup" && password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1.5 h-1 w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-full flex-1 rounded-full transition-colors duration-300",
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1]
                        : "bg-neutral-200 dark:bg-neutral-800"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-neutral-400">
                Strength:{" "}
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {strengthLabels[passwordStrength - 1] ?? "Too short"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Remember me (signin) or Agree to terms (signup) */}
        {mode === "signin" ? (
          <div className="flex items-center gap-2 pt-1">
            <input
              id={`${formUid}-remember`}
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <label
              htmlFor={`${formUid}-remember`}
              className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>
        ) : (
          <div className="flex items-start gap-2 pt-1">
            <input
              id={`${formUid}-terms`}
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <label
              htmlFor={`${formUid}-terms`}
              className="text-[11px] text-neutral-500 dark:text-neutral-400 select-none leading-snug cursor-pointer"
            >
              I agree to the{" "}
              <a href="#terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || (mode === "signup" && !agreedTerms)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className={cn(
            "mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40",
            isSuccess
              ? "bg-emerald-600 text-white"
              : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100",
            (isSubmitting || (mode === "signup" && !agreedTerms)) && "opacity-60 cursor-not-allowed"
          )}
        >
          {isSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>{mode === "signin" ? "Signed in successfully" : "Account created"}</span>
            </>
          ) : isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In with Email" : "Create Free Account"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer Switcher & Security Verification */}
      <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col items-center gap-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          {mode === "signin" ? "Don't have an account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => handleModeSwitch(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >
            {mode === "signin" ? "Sign up free" : "Log in"}
          </button>
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>256-bit End-to-End SSL Encryption</span>
        </div>
      </div>
    </div>
  );
}

export default MinimalAuthCard;
