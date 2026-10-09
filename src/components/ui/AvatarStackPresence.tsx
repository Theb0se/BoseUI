"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  Send,
  Plus,
  Check,
  Filter,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PresenceStatus = "online" | "idle" | "offline";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  status: PresenceStatus;
  timezone: string;
  recentActivity: string;
}

export interface AvatarStackPresenceProps {
  members?: TeamMember[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "m-1",
    name: "Alexander Vance",
    role: "Staff Design Technologist",
    initials: "AV",
    avatarBg: "from-indigo-500 to-purple-600",
    status: "online",
    timezone: "San Francisco (UTC-7)",
    recentActivity: "Editing design token repository",
  },
  {
    id: "m-2",
    name: "Elena Rostova",
    role: "VP of Product Engineering",
    initials: "ER",
    avatarBg: "from-pink-500 to-rose-600",
    status: "online",
    timezone: "New York (UTC-4)",
    recentActivity: "Reviewed smart contract telemetry",
  },
  {
    id: "m-3",
    name: "Marcus Chen",
    role: "Lead Crypto Architect",
    initials: "MC",
    avatarBg: "from-cyan-500 to-blue-600",
    status: "idle",
    timezone: "Singapore (UTC+8)",
    recentActivity: "Away for 20 minutes",
  },
  {
    id: "m-4",
    name: "Sarah Jenkins",
    role: "Security & Auditing Lead",
    initials: "SJ",
    avatarBg: "from-emerald-500 to-teal-600",
    status: "online",
    timezone: "London (UTC+1)",
    recentActivity: "Deployed v2.4 consensus bridge",
  },
  {
    id: "m-5",
    name: "Liam Vance",
    role: "Mobile Platform Engineer",
    initials: "LV",
    avatarBg: "from-amber-500 to-orange-600",
    status: "offline",
    timezone: "Berlin (UTC+2)",
    recentActivity: "Active 4 hours ago",
  },
  {
    id: "m-6",
    name: "Chloe Dupont",
    role: "Fintech Compliance Strategist",
    initials: "CD",
    avatarBg: "from-violet-500 to-fuchsia-600",
    status: "online",
    timezone: "Paris (UTC+2)",
    recentActivity: "Drafting SOC2 report",
  },
  {
    id: "m-7",
    name: "Daisuke Sato",
    role: "High-Frequency Systems Core",
    initials: "DS",
    avatarBg: "from-red-500 to-rose-700",
    status: "idle",
    timezone: "Tokyo (UTC+9)",
    recentActivity: "Benchmarking RPC endpoints",
  },
];

export function AvatarStackPresence({
  members: initialMembers = DEFAULT_MEMBERS,
  maxVisible: initialMax = 5,
  size = "md",
  className,
}: AvatarStackPresenceProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [maxVisible, setMaxVisible] = useState(initialMax);
  const [filterStatus, setFilterStatus] = useState<PresenceStatus | "all">("all");
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pingedUsers, setPingedUsers] = useState<Set<string>>(new Set());

  // Filter members
  const filteredMembers = members.filter((m) => {
    if (filterStatus === "all") return true;
    return m.status === filterStatus;
  });

  const visibleMembers = filteredMembers.slice(0, maxVisible);
  const overflowCount = Math.max(0, filteredMembers.length - maxVisible);

  // Size styling maps
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }[size];

  const dotSizeClasses = {
    sm: "h-2.5 w-2.5 border-[1.5px]",
    md: "h-3 w-3 border-2",
    lg: "h-3.5 w-3.5 border-2",
  }[size];

  const handlePing = (id: string) => {
    setPingedUsers((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPingedUsers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  const getStatusColor = (status: PresenceStatus) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "idle":
        return "bg-amber-400";
      case "offline":
        return "bg-neutral-500";
    }
  };

  const getStatusLabel = (status: PresenceStatus) => {
    switch (status) {
      case "online":
        return "Active Now";
      case "idle":
        return "Away / Idle";
      case "offline":
        return "Offline";
    }
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Top Header & Filter Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-sm text-white">
            Team Presence Stack
          </span>
          <span className="rounded-full bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            {members.filter((m) => m.status === "online").length} Online
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1">
          {(["all", "online", "idle", "offline"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                filterStatus === st
                  ? "bg-neutral-800 text-white font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Center Interactive Avatar Stack Stage */}
      <div className="relative my-10 flex flex-col items-center justify-center">
        <p className="mb-6 text-xs text-neutral-400 font-mono text-center">
          Hover individual avatars for detailed status cards • Click +N for full roster
        </p>

        {/* Overlapping Avatar Stack */}
        <div className="relative flex items-center -space-x-3">
          {visibleMembers.map((member, idx) => (
            <div
              key={member.id}
              className="relative group"
              onMouseEnter={() => setHoveredMember(member)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.12, zIndex: 30 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className={cn(
                  "relative rounded-full ring-2 ring-neutral-950 bg-gradient-to-tr p-0.5 cursor-pointer shadow-lg transition-shadow",
                  member.avatarBg,
                  sizeClasses
                )}
              >
                <div className="h-full w-full rounded-full bg-neutral-950 flex items-center justify-center font-bold font-mono text-white">
                  {member.initials}
                </div>

                {/* Status Dot Indicator */}
                <span
                  className={cn(
                    "absolute bottom-0 right-0 rounded-full border-neutral-950",
                    getStatusColor(member.status),
                    dotSizeClasses,
                    member.status === "online" && "animate-pulse"
                  )}
                />
              </motion.div>

              {/* Hover Popover Card */}
              <AnimatePresence>
                {hoveredMember?.id === member.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-40 w-64 rounded-2xl border border-neutral-700/80 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-full bg-gradient-to-tr flex items-center justify-center text-xs font-bold text-white shadow-inner",
                            member.avatarBg
                          )}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-white">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase",
                          member.status === "online"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : member.status === "idle"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            getStatusColor(member.status)
                          )}
                        />
                        {getStatusLabel(member.status)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-neutral-800 pt-2 text-[11px] text-neutral-300">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="h-3 w-3" />
                        <span>{member.timezone}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 italic">
                        "{member.recentActivity}"
                      </p>
                    </div>

                    {/* Quick ping button */}
                    <div className="mt-3 border-t border-neutral-800 pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handlePing(member.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
                      >
                        {pingedUsers.has(member.id) ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Pinged!</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            <span>Send Ping</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* +N Overflow Pill Chip */}
          {overflowCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.1, zIndex: 25 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className={cn(
                "relative rounded-full ring-2 ring-neutral-950 bg-neutral-800 border border-neutral-700 font-mono font-bold text-neutral-200 flex items-center justify-center hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer shadow-lg",
                sizeClasses
              )}
            >
              +{overflowCount}
            </motion.button>
          )}
        </div>
      </div>

      {/* Expanded Team Drawer Modal */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-sm text-white">
                    Full Team Directory ({filteredMembers.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1">
                {filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "relative h-8 w-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-xs font-bold text-white",
                          m.avatarBg
                        )}
                      >
                        {m.initials}
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-neutral-950",
                            getStatusColor(m.status)
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-neutral-400">{m.role}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePing(m.id)}
                      className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
                    >
                      {pingedUsers.has(m.id) ? "Sent ✓" : "Ping"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Settings Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="text-neutral-500 font-mono">Visible Limit:</span>
          {[3, 5, 7].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setMaxVisible(num)}
              className={cn(
                "rounded px-2 py-0.5 text-xs font-mono transition-colors",
                maxVisible === num
                  ? "bg-neutral-800 text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const newMember: TeamMember = {
              id: `m-${Date.now()}`,
              name: "Jordan Sparks",
              role: "Design Systems Engineer",
              initials: "JS",
              avatarBg: "from-teal-500 to-emerald-600",
              status: "online",
              timezone: "Austin (UTC-5)",
              recentActivity: "Joined the workspace session",
            };
            setMembers((prev) => [...prev, newMember]);
          }}
          className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Teammate</span>
        </button>
      </div>
    </div>
  );
}

export default AvatarStackPresence;
