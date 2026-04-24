"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, MoreHorizontal, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

const BOTTOM_NAV_LIMIT = 4;

export default function DashboardLayout({
  title,
  navItems,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryItems = navItems.slice(0, BOTTOM_NAV_LIMIT);
  const overflowItems = navItems.slice(BOTTOM_NAV_LIMIT);
  const hasOverflow = overflowItems.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:pb-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Desktop sidebar */}
          <aside className="hidden shrink-0 lg:block lg:w-60">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {title}
              </p>
              <nav className="flex flex-col gap-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 lg:hidden">
        <div className="flex items-stretch">
          {primaryItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-700"
                )}
              >
                <span className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-lg transition-colors",
                  active && "bg-indigo-50"
                )}>
                  <Icon size={18} />
                </span>
                {label}
              </Link>
            );
          })}

          {/* More button — only shown when items exceed limit */}
          {hasOverflow && (
            <button
              onClick={() => setMoreOpen(true)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                overflowItems.some((i) => i.href === pathname)
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-700"
              )}
            >
              <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-lg transition-colors",
                overflowItems.some((i) => i.href === pathname) && "bg-indigo-50"
              )}>
                <MoreHorizontal size={18} />
              </span>
              More
            </button>
          )}
        </div>
      </nav>

      {/* More drawer — slide up sheet for overflow items */}
      {hasOverflow && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMoreOpen(false)}
            className={cn(
              "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden",
              moreOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          />

          {/* Sheet */}
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden",
              moreOpen ? "translate-y-0" : "translate-y-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-sm font-semibold text-slate-700">{title}</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-3 pb-8">
              {overflowItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      active ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                    )}>
                      <Icon size={16} />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
