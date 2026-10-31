"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { DOMAINS, PROFESSIONS, TOOLS } from "@/lib/registry";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-[#faf5ea]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="Utility Toolz home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
                <LayoutGrid className="h-4.5 w-4.5 text-[#7fbb92]" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                Utility<span className="text-[#c9603c]">Toolz</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/70">
              Professional tools organized by domain — finance, marketing, advertising, business
              and beyond. Built for people whose work depends on the numbers.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[#308f68]" />
              Catalogue complete · {TOOLS.length} tools live
            </p>
          </div>

          {/* Domains */}
          <nav aria-label="Domains">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Domains</p>
            <ul className="mt-3 space-y-2">
              {DOMAINS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/${d.slug}`}
                    className={cn(
                      "text-sm transition-colors hover:text-[#a4502c]",
                      d.status === "live" ? "text-foreground/80" : "text-foreground/45"
                    )}
                  >
                    {d.shortName}
                    {d.status === "planned" && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-foreground/40">
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
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              For your profession
            </p>
            <ul className="mt-3 space-y-2">
              {PROFESSIONS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/professions/${p.slug}`}
                    className="text-sm text-foreground/80 transition-colors hover:text-[#a4502c]"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              The platform
            </p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>Free to use, no signup</li>
              <li>Runs entirely in your browser</li>
              <li>New tools every sprint</li>
              <li>Premium ad-free plan — $5/mo, waitlist open</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Utility Toolz. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/" className="hover:text-foreground">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
