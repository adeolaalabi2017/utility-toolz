"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { DOMAINS, PROFESSIONS, TOOLS } from "@/lib/registry";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="Utility Toolz home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink border border-transparent dark:border-border/60">
                <LayoutGrid className="h-4.5 w-4.5 text-[#7fbb92]" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                Utility<span className="text-deep-rust">Toolz</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/80 dark:text-foreground/85">
              Professional tools organized by domain — finance, marketing, advertising, business
              and beyond. Built for people whose work depends on the numbers.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 dark:text-foreground/85">
              <span className="h-1.5 w-1.5 rounded-full bg-lf-green" aria-hidden />
              {TOOLS.length} tools across {DOMAINS.length} domains
            </p>
          </div>

          {/* Domains */}
          <nav aria-label="Domains">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/75 dark:text-foreground/85">Domains</p>
            <ul className="mt-3 space-y-2">
              {DOMAINS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/${d.slug}`}
                    className={cn(
                      "text-sm transition-colors hover:text-deep-orange",
                      d.status === "live" ? "text-foreground/90 font-medium" : "text-foreground/60"
                    )}
                  >
                    {d.shortName}
                    {d.status === "planned" && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-foreground/50">
                        Phase {d.phase}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Professions */}
          <nav aria-label="Professions">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/75 dark:text-foreground/85">
              For your profession
            </p>
            <ul className="mt-3 space-y-2">
              {PROFESSIONS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/professions/${p.slug}`}
                    className="text-sm text-foreground/90 font-medium transition-colors hover:text-deep-orange"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/75 dark:text-foreground/85">
              The platform
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80 dark:text-foreground/85">
              <li>Free to use, no signup</li>
              <li>Your inputs stay in your browser</li>
              <li>New tools added regularly</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs text-foreground/75 dark:text-foreground/80 sm:flex-row">
          <p>© {new Date().getFullYear()} Utility Toolz. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="inline-flex min-h-10 items-center hover:text-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-10 items-center hover:text-foreground hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
