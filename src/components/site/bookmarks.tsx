"use client";

import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Tool } from "@/lib/registry/types";
import { toolBySlug } from "@/lib/registry";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "utility_toolz_favorites";
const EMPTY: string[] = [];

/* One shared store, so starring a card updates every star and the pinned bar at once. */
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useBookmarks() {
  const bookmarks = React.useSyncExternalStore(subscribe, read, () => EMPTY);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const toggleBookmark = React.useCallback((slug: string) => {
    const current = read();
    write(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);

  const isBookmarked = React.useCallback((slug: string) => bookmarks.includes(slug), [bookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, mounted };
}

export function BookmarkButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name?: string;
  className?: string;
}) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks();
  const active = mounted && isBookmarked(slug);
  const label = name ? `Star ${name}` : "Star this tool";

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(slug)}
      aria-pressed={active}
      aria-label={label}
      title={active ? "Starred — click to remove" : "Star to pin on the home page"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent sm:h-8 sm:w-8",
        active ? "text-lf-orange" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Star className={cn("h-4 w-4", active && "fill-lf-orange")} aria-hidden />
    </button>
  );
}

export function PinnedToolsBar() {
  const { bookmarks, mounted } = useBookmarks();
  if (!mounted || bookmarks.length === 0) return null;

  const validTools = bookmarks.map((slug) => toolBySlug(slug)).filter(Boolean) as Tool[];
  if (validTools.length === 0) return null;

  return (
    <section aria-labelledby="pinned-title" className="mb-6 rounded-xl border border-border bg-card p-4 shadow-lark-sm">
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 fill-lf-orange text-lf-orange" aria-hidden />
        <h2 id="pinned-title" className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Starred tools ({validTools.length})
        </h2>
      </div>
      <ul className="flex flex-wrap gap-2">
        {validTools.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/${t.domain}/${t.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-lf-purple hover:text-deep-purple"
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
