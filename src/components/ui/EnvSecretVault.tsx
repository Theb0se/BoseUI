"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Shield,
  Trash2,
  FileCode,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  environments: ("production" | "preview" | "development")[];
}

export interface EnvSecretVaultProps {
  /** Project name */
  projectName?: string;
  /** Initial environment variables */
  initialVariables?: EnvVariable[];
  /** Callback when variables are modified */
  onChange?: (vars: EnvVariable[]) => void;
  className?: string;
}

const DEFAULT_VARS: EnvVariable[] = [
  {
    id: "1",
    key: "DATABASE_URL",
    value: "postgres://db_admin:s3cr3t_p@ss_941@neon-cluster.aws.neon.tech/main",
    environments: ["production", "preview", "development"],
  },
  {
    id: "2",
    key: "NEXTAUTH_SECRET",
    value: "d302a8bf3998827fa10c0e81c194b1e772f9a910",
    environments: ["production", "preview"],
  },
  {
    id: "3",
    key: "OPENAI_API_KEY",
    value: "sk-proj-918472918374928174928174928174928174",
    environments: ["production", "preview", "development"],
  },
  {
    id: "4",
    key: "STRIPE_WEBHOOK_SECRET",
    value: "whsec_4892c90a1829e018a994b2819",
    environments: ["production"],
  },
];

export function EnvSecretVault({
  projectName = "boseui-production",
  initialVariables = DEFAULT_VARS,
  onChange,
  className,
}: EnvSecretVaultProps) {
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);
  const [copiedDotenv, setCopiedDotenv] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleRevealAll = () => {
    setRevealAll(!revealAll);
  };

  const handleCopyDotenv = () => {
    const text = variables.map((v) => `${v.key}=${v.value}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopiedDotenv(true);
    setTimeout(() => setCopiedDotenv(false), 2000);
  };

  const handleAdd = () => {
    if (!newKey.trim()) return;
    const newVar: EnvVariable = {
      id: String(Date.now()),
      key: newKey.trim().toUpperCase(),
      value: newValue.trim(),
      environments: ["production", "preview", "development"],
    };
    const next = [...variables, newVar];
    setVariables(next);
    onChange?.(next);
    setNewKey("");
    setNewValue("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const next = variables.filter((v) => v.id !== id);
    setVariables(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-neutral-900 dark:text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
              Environment Variables Vault
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Encrypted secret manager for <code className="font-mono text-neutral-900 dark:text-white font-semibold">{projectName}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleRevealAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-all shadow-xs"
          >
            {revealAll ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{revealAll ? "Mask All" : "Reveal All"}</span>
          </button>
          <button
            onClick={handleCopyDotenv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 transition-all shadow-xs"
          >
            {copiedDotenv ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy .env</span>
          </button>
        </div>
      </div>

      {/* Secret Rows List */}
      <div className="flex flex-col gap-2">
        {variables.map((v) => {
          const isRevealed = revealAll || revealedIds[v.id];

          return (
            <div
              key={v.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
            >
              {/* Key + Scopes */}
              <div className="flex flex-col gap-1 min-w-0 sm:w-1/3">
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {v.key}
                </span>
                <div className="flex items-center gap-1">
                  {v.environments.map((env) => (
                    <span
                      key={env}
                      className={cn(
                        "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border",
                        env === "production" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                        env === "preview" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                        env === "development" && "bg-neutral-200/60 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                      )}
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* Value Masked/Revealed */}
              <div className="flex-1 min-w-0 flex items-center gap-2 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono text-xs shadow-2xs">
                <span className="flex-1 truncate text-neutral-800 dark:text-neutral-200 select-all">
                  {isRevealed ? v.value : "••••••••••••••••••••••••••••••••"}
                </span>
                <button
                  onClick={() => toggleReveal(v.id)}
                  title={isRevealed ? "Hide secret" : "Reveal secret"}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
                >
                  {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 justify-end">
                <button
                  onClick={() => handleDelete(v.id)}
                  title="Delete variable"
                  className="p-1.5 text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Variable Inline */}
      {isAdding ? (
        <div className="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col gap-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="VARIABLE_NAME"
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 uppercase"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="secret_value_..."
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold shadow-xs"
            >
              Save Secret
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Environment Variable</span>
        </button>
      )}
    </div>
  );
}
