"use client";

import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Tool } from "@/lib/registry/types";
import { toolBySlug } from "@/lib/registry";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "utility_toolz_favorites";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
    setMounted(true);
  }, []);

  const toggleBookmark = React.useCallback((slug: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(slug);
      const updated = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const isBookmarked = React.useCallback(
    (slug: string) => bookmarks.includes(slug),
    [bookmarks]
  );

  return { bookmarks, isBookmarked, toggleBookmark, mounted };
}

export function BookmarkButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks();
  if (!mounted) return null;

  const active = isBookmarked(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug);
      }}
      aria-label={active ? "Remove from starred tools" : "Star this tool"}
      className={cn(
        "rounded-full p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-primary",
        active
          ? "text-[#e07a3c] hover:text-[#c9603c]"
          : "text-muted-foreground/40 hover:text-foreground/80",
        className
      )}
    >
      <Star className={cn("h-4 w-4", active && "fill-[#e07a3c]")} />
    </button>
  );
}

export function PinnedToolsBar() {
  const { bookmarks, mounted } = useBookmarks();
  if (!mounted || bookmarks.length === 0) return null;

  const validTools = bookmarks.map((slug) => toolBySlug(slug)).filter(Boolean) as Tool[];
  if (validTools.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-lark-sm">
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-4 w-4 fill-[#e07a3c] text-[#e07a3c]" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Pinned Tools ({validTools.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {validTools.map((t) => (
          <Link
            key={t.slug}
            href={`/${t.domain}/${t.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#6b5faf] hover:text-[#3f346f]"
          >
            <span>{t.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
