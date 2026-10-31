"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, LayoutGrid, Menu, Search } from "lucide-react";
import { DOMAINS, PROFESSIONS } from "@/lib/registry";
import { useSearch } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { setOpen } = useSearch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const liveDomains = DOMAINS.filter((d) => d.status === "live");
  const inlineDomains = liveDomains.slice(0, 5);
  const overflowLive = liveDomains.slice(5);
  const plannedDomains = DOMAINS.filter((d) => d.status === "planned");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="mr-2 flex items-center gap-2" aria-label="Utility Toolz home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <LayoutGrid className="h-4.5 w-4.5 text-[#7fbb92]" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Utility<span className="text-[#c9603c]">Toolz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            Home
          </Link>
          {inlineDomains.map((d) => (
            <Link
              key={d.slug}
              href={`/${d.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              {d.shortName}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium text-foreground/80">
                More <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {overflowLive.length > 0 && (
                <>
                  <DropdownMenuLabel>More live domains</DropdownMenuLabel>
                  {overflowLive.map((d) => (
                    <DropdownMenuItem key={d.slug} asChild>
                      <Link href={`/${d.slug}`} className="flex cursor-pointer items-center justify-between">
                        <span>{d.name}</span>
                        <span className="text-xs font-medium text-primary">Live</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuLabel>All domains</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DOMAINS.map((d) => (
                <DropdownMenuItem key={d.slug} asChild>
                  <Link href={`/${d.slug}`} className="flex cursor-pointer items-center justify-between">
                    <span>{d.name}</span>
                    <span
                      className={cn(
                        "text-xs",
                        d.status === "live" ? "font-medium text-primary" : "text-muted-foreground"
                      )}
                    >
                      {d.status === "live" ? "Live" : `Phase ${d.phase}`}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
            aria-label="Search tools"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search tools…</span>
            <kbd className="hidden rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-2 flex flex-col gap-1" aria-label="Mobile">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Home
                </Link>
                <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live domains
                </p>
                {liveDomains.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {d.name}
                  </Link>
                ))}
                {plannedDomains.length > 0 && (
                  <>
                    <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Professions
                </p>
                {PROFESSIONS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/professions/${p.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
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
