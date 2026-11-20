"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Github,
  Twitter,
  Linkedin,
  Disc as Discord,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand product name */
  brandName?: string;
  /** Brand mission or tagline */
  description?: string;
  /** Custom logo node */
  logo?: React.ReactNode;
  /** Categorized navigation columns */
  columns?: FooterColumn[];
  /** Social profile links */
  socials?: FooterSocial[];
  /** Custom copyright text */
  copyright?: string;
  /** Live service operational status text */
  statusText?: string;
  /** Operational status state */
  statusState?: "operational" | "degraded" | "maintenance";
  /** Whether to render the kinetic newsletter signup box */
  showNewsletter?: boolean;
  /** Newsletter submission handler */
  onNewsletterSubmit?: (email: string) => Promise<boolean> | boolean | void;
  /** Optional custom class name */
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Primitives", href: "#primitives", badge: "106+" },
      { label: "Blocks", href: "#blocks" },
      { label: "Design System", href: "#tokens" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Components CLI", href: "#cli" },
      { label: "Interactive Demos", href: "#demos" },
      { label: "GitHub Repo", href: "https://github.com/Theb0se/bose-ui", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Rishabh", href: "https://theb0se.vercel.app/", external: true },
      { label: "Careers", href: "#careers", badge: "We're hiring" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
    ],
  },
];

const DEFAULT_SOCIALS: FooterSocial[] = [
  { name: "GitHub", href: "https://github.com/Theb0se/bose-ui", icon: Github },
  { name: "Twitter", href: "https://x.com", icon: Twitter },
  { name: "Discord", href: "https://discord.com", icon: Discord },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Footer({
  brandName = "BoseUI",
  description = "Kinetic UI components engineered to make modern web interfaces feel alive and tactile.",
  logo,
  columns = DEFAULT_COLUMNS,
  socials = DEFAULT_SOCIALS,
  copyright,
  statusText = "All systems operational",
  statusState = "operational",
  showNewsletter = true,
  onNewsletterSubmit,
  className,
  ...props
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const shouldReduceMotion = useReducedMotion();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setNewsletterStatus("loading");
    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(email);
      } else {
        // Simulated network delay
        await new Promise((res) => setTimeout(res, 600));
      }
      setNewsletterStatus("success");
      setEmail("");
    } catch {
      setNewsletterStatus("error");
    }
  };

  const statusColors = {
    operational: "bg-emerald-500",
    degraded: "bg-amber-500",
    maintenance: "bg-blue-500",
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className={cn(
        "relative w-full border-t border-neutral-200/80 bg-neutral-50/70 pt-16 pb-12 text-neutral-900 dark:border-neutral-800/80 dark:bg-neutral-950/70 dark:text-neutral-100",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              {logo || (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-md dark:bg-white dark:text-neutral-950">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                {brandName}
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {description}
            </p>

            {/* Newsletter Subscription */}
            {showNewsletter && (
              <div className="max-w-md">
                <form
                  onSubmit={handleSubscribe}
                  className="relative flex items-center"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for releases..."
                    disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                    aria-label="Email address for newsletter"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 pr-28 text-xs text-neutral-900 placeholder-neutral-400 shadow-sm transition-all focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:border-white dark:focus:ring-neutral-600"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                    aria-label="Subscribe to newsletter"
                    className={cn(
                      "absolute right-1.5 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95",
                      newsletterStatus === "success"
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                    )}
                  >
                    {newsletterStatus === "loading" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : newsletterStatus === "success" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <span>Join</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </form>
                {newsletterStatus === "success" && (
                  <p className="mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Thank you for subscribing! We only send signal, no spam.
                  </p>
                )}
              </div>
            )}

            {/* Operational System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    statusColors[statusState]
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    statusColors[statusState]
                  )}
                />
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-300">
                {statusText}
              </span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
                  {column.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer noopener" : undefined}
                        className="group inline-flex items-center gap-1.5 text-xs text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                      >
                        <motion.span
                          whileHover={
                            shouldReduceMotion ? undefined : { x: 3 }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="flex items-center gap-1.5"
                        >
                          {link.label}
                        </motion.span>
                        {link.badge && (
                          <span className="rounded-full bg-neutral-200/80 px-1.5 py-0.2 text-[9px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t border-neutral-200/80 pt-8 sm:flex-row dark:border-neutral-800/80">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {copyright ||
              `© ${new Date().getFullYear()} ${brandName}. Open-source MIT License.`}
          </p>

          {/* Social Icons with Spring Hover */}
          <div className="flex items-center gap-2">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.name}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.12, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
