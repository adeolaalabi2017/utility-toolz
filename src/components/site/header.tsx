"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";
import { DOMAINS, PROFESSIONS, TOOLS, toolsByDomain } from "@/lib/registry";
import { useSearch } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { CurrencySelect } from "./currency";
import { cn } from "@/lib/utils";

export function Header() {
  const { setOpen } = useSearch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const liveDomains = DOMAINS.filter((d) => d.status === "live");
  const plannedDomains = DOMAINS.filter((d) => d.status === "planned");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="mr-2 flex min-h-11 items-center gap-2" aria-label="Utility Toolz home">
          <span className="font-display text-2xl font-medium tracking-tight">Utility Toolz</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">

          {/* Redesigned Workspaces Mega-Flyout Panel */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md px-3 py-2"
              >
                <span>Domains</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {DOMAINS.length}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[640px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/80 bg-card/98 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between border-b border-border/60 px-2 pb-3">
                <div>
                  <span className="font-display text-sm font-semibold text-foreground">
                    All professional domains
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {TOOLS.length} tools organized across {DOMAINS.length} domains
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {DOMAINS.map((d) => {
                  const Icon = d.icon;
                  const count = toolsByDomain(d.slug).length;
                  return (
                    <DropdownMenuItem key={d.slug} asChild className="p-0 focus:bg-transparent">
                      <Link
                        href={`/${d.slug}`}
                        className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-all hover:bg-muted/70 cursor-pointer"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                            "bg-muted text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary truncate">
                              {d.shortName}
                            </span>
                            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                              {count} tools
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
                            {d.description}
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 px-2 pt-3 text-xs">
                <Link
                  href="/#professions"
                  className="flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Browse tools by profession <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
                <span className="text-[11px] text-muted-foreground">No signup needed</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/#professions"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            Professions
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border-[1.5px] border-input bg-transparent px-3 text-sm text-foreground transition-colors hover:bg-accent sm:h-9 sm:min-w-0"
            aria-label="Search tools"
            aria-keyshortcuts="Meta+K Control+K /"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Search {TOOLS.length} tools</span>
            <kbd className="hidden rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="hidden md:block">
            <CurrencySelect />
          </div>
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-11 md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-12 flex items-center justify-between rounded-lg border border-border px-3 py-1">
                <span className="text-sm text-muted-foreground">Currency</span>
                <CurrencySelect />
              </div>
              <nav className="mt-2 flex flex-col gap-1" aria-label="Mobile">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Home
                </Link>
                <p className="mt-4 px-3 text-sm font-semibold text-muted-foreground">
                  Domains
                </p>
                {liveDomains.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {d.name}
                  </Link>
                ))}
                {plannedDomains.length > 0 && (
                  <>
                    <p className="mt-4 px-3 text-sm font-semibold text-muted-foreground">
                      Coming soon
                    </p>
                    {plannedDomains.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/${d.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                      >
                        <span className="min-w-0">{d.name}</span>
                        <span className="shrink-0 text-xs">Phase {d.phase}</span>
                      </Link>
                    ))}
                  </>
                )}
                <p className="mt-4 px-3 text-sm font-semibold text-muted-foreground">
                  Professions
                </p>
                {PROFESSIONS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/professions/${p.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    For {p.name.toLowerCase()}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
