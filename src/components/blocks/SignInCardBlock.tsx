"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Lock,
  Github,
  Mail,
  RefreshCw,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { SpringPinInput } from "@/components/ui/SpringPinInput";

export type AuthState = "idle" | "thinking" | "responding";

export interface SignInCardBlockProps {
  /** Organization or product title */
  title?: string;
  /** Subtitle context */
  subtitle?: string;
  /** Default email address */
  defaultEmail?: string;
  /** Callback fired when sign-in succeeds */
  onSignIn?: (email: string, pin: string) => void;
  /** Additional container classes */
  className?: string;
}

export function SignInCardBlock({
  title = "Authenticate Session",
  subtitle = "Zero-trust biometric & hardware-backed verification",
  defaultEmail = "alex.mercer@enterprise.io",
  onSignIn,
  className,
}: SignInCardBlockProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [pin, setPin] = useState("482910");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [isSuccess, setIsSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPinComplete = pin.length === 6;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isEmailValid || !isPinComplete) return;

    setAuthState("thinking");
    setTimeout(() => {
      setAuthState("responding");
      setIsSuccess(true);
      onSignIn?.(email, pin);
    }, 1200);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 800);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 p-6 sm:p-10 dark:border-neutral-800",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* Center authentication showcase container */}
      <div className="relative z-10 flex min-h-[460px] flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-2xl">
            <div className="rounded-3xl bg-neutral-900/95 p-6 sm:p-8 backdrop-blur-xl border border-white/5 space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-cyan-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">
                      {title}
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400">{subtitle}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SOC-2 Type II
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Work Email field */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">
                    Enterprise Work Email
                  </label>
                  <FloatingLabelInput
                    type="email"
                    label="name@company.com"
                    value={email}
                    onChange={(val) => setEmail(val)}
                    helperText="We will send an encrypted instant verification challenge."
                    className="w-full"
                  />
                </div>

                {/* 2FA Pin field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-300">
                      6-Digit Authenticator Token
                    </label>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || resending}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-neutral-500 flex items-center gap-1"
                    >
                      <RefreshCw className={cn("h-3 w-3", resending && "animate-spin")} />
                      <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}</span>
                    </button>
                  </div>
                  <div className="flex justify-center py-2">
                    <SpringPinInput
                      length={6}
                      defaultValue={pin}
                      onComplete={(code: string) => {
                        setPin(code);
                        handleSubmit();
                      }}
                      className="gap-2"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isEmailValid || !isPinComplete || authState === "thinking"}
                  className={cn(
                    "w-full h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg",
                    isSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Session Verified & Authenticated</span>
                    </>
                  ) : authState === "thinking" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Biometric Passkey...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Alternative Biometrics Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Fingerprint className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Hardware FIDO2 Security Key enabled</span>
                </span>
                <a href="#help" className="hover:text-white transition-colors">
                  Need help?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInCardBlock;
