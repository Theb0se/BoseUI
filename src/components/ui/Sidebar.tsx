"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Layers,
  BarChart3,
  Settings,
  Users,
  FolderGit2,
  Bell,
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarSubItem {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
}

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "brand" | "success" | "warning";
  children?: SidebarSubItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  name: string;
  role?: string;
  avatarUrl?: string;
  email?: string;
}

export interface SidebarProps
  extends Omit<HTMLMotionProps<"aside">, "children" | "header" | "footer"> {
  children?: React.ReactNode;
  /** Grouped sections of navigation items */
  sections?: SidebarSection[];
  /** Controlled active item id */
  activeId?: string;
  /** Initial active item id for uncontrolled usage */
  defaultActiveId?: string;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback fired when collapsed state toggles */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Callback fired when an item is clicked */
  onItemSelect?: (item: SidebarItem) => void;
  /** User profile card details for the sidebar footer */
  user?: SidebarUser;
  /** Custom header slot */
  header?: React.ReactNode;
  /** Custom footer slot */
  footer?: React.ReactNode;
  /** Whether the sidebar collapse toggle is enabled */
  collapsible?: boolean;
  /** Optional custom class name */
  className?: string;
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    title: "Platform",
    items: [
      {
        id: "dashboard",
        label: "Overview",
        href: "#overview",
        icon: LayoutDashboard,
      },
      {
        id: "components",
        label: "Primitives",
        href: "#primitives",
        icon: Layers,
        badge: "106+",
        badgeVariant: "brand",
        children: [
          { id: "comp-nav", label: "Navigation", href: "#navigation" },
          { id: "comp-motion", label: "Motion", href: "#motion" },
          { id: "comp-cards", label: "Cards", href: "#cards" },
        ],
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "#analytics",
        icon: BarChart3,
      },
      {
        id: "projects",
        label: "Workspaces",
        href: "#workspaces",
        icon: FolderGit2,
        badge: "3",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        id: "team",
        label: "Collaborators",
        href: "#team",
        icon: Users,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "#notifications",
        icon: Bell,
        badge: "4",
        badgeVariant: "warning",
      },
      {
        id: "settings",
        label: "Preferences",
        href: "#preferences",
        icon: Settings,
      },
    ],
  },
];

const DEFAULT_USER: SidebarUser = {
  name: "Alex Vance",
  role: "Design Engineer",
  email: "alex@boseui.site",
};

export function Sidebar({
  sections = DEFAULT_SECTIONS,
  activeId: controlledActiveId,
  defaultActiveId = "dashboard",
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  onItemSelect,
  user = DEFAULT_USER,
  header,
  footer,
  collapsible = true,
  className,
  ...props
}: SidebarProps) {
  const [internalActiveId, setInternalActiveId] = useState(defaultActiveId);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({
    components: true,
  });
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const instanceId = useId();

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const currentActiveId =
    controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const toggleCollapse = () => {
    const next = !isCollapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && !isCollapsed) {
      setExpandedSubmenus((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    }
    if (controlledActiveId === undefined) {
      setInternalActiveId(item.id);
    }
    onItemSelect?.(item);
  };

  return (
    <motion.aside
      aria-label="Application Sidebar"
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 350, damping: 32 }
      }
      className={cn(
        "relative flex h-full min-h-[560px] flex-col justify-between border-r border-neutral-200/80 bg-white/95 p-3 text-neutral-900 shadow-sm backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/95 dark:text-neutral-100",
        className
      )}
      {...props}
    >
      {/* Top Header Slot */}
      <div>
        <div className="flex h-12 items-center justify-between px-2">
          {header || (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-sm dark:bg-white dark:text-neutral-950">
                <Sparkles className="h-4 w-4" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-sm font-bold tracking-tight text-neutral-950 dark:text-white">
                      BoseUI Studio
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      v2.0 Pro System
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {collapsible && (
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
                isCollapsed && "absolute -right-3 h-5 w-5"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="mt-4 flex flex-col gap-5 overflow-y-auto overflow-x-hidden">
          {sections.map((section, sIdx) => (
            <div key={section.title || `sec-${sIdx}`} className="flex flex-col gap-1">
              {section.title && !isCollapsed && (
                <span className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {section.title}
                </span>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveId === item.href || currentActiveId === item.id;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isSubmenuOpen = Boolean(expandedSubmenus[item.id]);

                return (
                  <div key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => {
                        if (isCollapsed) setHoveredTooltip(item.id);
                      }}
                      onMouseLeave={() => setHoveredTooltip(null)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
                        isActive
                          ? "text-neutral-950 dark:text-white font-semibold"
                          : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white",
                        isCollapsed ? "justify-center px-0" : ""
                      )}
                    >
                      {/* Active Spring Capsule Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId={`sidebar-active-${instanceId}`}
                          className="absolute inset-0 rounded-lg bg-neutral-100/90 dark:bg-neutral-800/80 -z-10 shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                          isActive
                            ? "text-neutral-950 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        )}
                      />

                      {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                          <span className="truncate">{item.label}</span>

                          <div className="flex items-center gap-1.5 ml-2">
                            {item.badge && (
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.2 text-[9px] font-semibold",
                                  item.badgeVariant === "brand"
                                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                                    : item.badgeVariant === "warning"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                      : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}

                            {hasChildren && (
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 text-neutral-400 transition-transform duration-200",
                                  isSubmenuOpen ? "rotate-180" : ""
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Popout Tooltip in Collapsed Mode */}
                    {isCollapsed && hoveredTooltip === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 8, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg dark:border-neutral-800 dark:bg-neutral-800"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="rounded bg-neutral-800 px-1 py-0.2 text-[9px] font-semibold text-neutral-300 dark:bg-neutral-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Expandable Sub-items */}
                    {!isCollapsed && hasChildren && isSubmenuOpen && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          className="ml-6 flex flex-col gap-0.5 border-l border-neutral-200 pl-3 my-1 dark:border-neutral-800"
                        >
                          {item.children!.map((sub) => {
                            const isSubActive =
                              currentActiveId === sub.href || currentActiveId === sub.id;
                            return (
                              <a
                                key={sub.id}
                                href={sub.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setInternalActiveId(sub.id);
                                }}
                                className={cn(
                                  "flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] transition-colors",
                                  isSubActive
                                    ? "bg-neutral-100 font-semibold text-neutral-950 dark:bg-neutral-800/70 dark:text-white"
                                    : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                                )}
                              >
                                <span>{sub.label}</span>
                                {sub.badge && (
                                  <span className="text-[9px] text-neutral-400">
                                    {sub.badge}
                                  </span>
                                )}
                              </a>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Card Slot */}
      <div className="border-t border-neutral-200/70 pt-3 dark:border-neutral-800/70">
        {footer || (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-neutral-100/80 dark:hover:bg-neutral-900/80",
              isCollapsed ? "justify-center p-0" : ""
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>

            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-semibold text-neutral-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                    {user.role || user.email}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Log out"
                  className="rounded-md p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
