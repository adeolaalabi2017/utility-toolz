"use client";

import Link from "next/link";
import type { Tool } from "@/lib/registry/types";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./bookmarks";

/**
 * The whole card is one link (a stretched ::after on the title link); the star
 * sits above it as a sibling button, so no interactive element is nested
 * inside the link.
 */
export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-1 rounded-xl border-[1.5px] border-input bg-card p-4 transition-colors focus-within:bg-accent hover:bg-accent",
        compact && "p-3.5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 font-sans text-lg font-semibold leading-snug tracking-normal">
          <Link
            href={`/${tool.domain}/${tool.slug}`}
            className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {tool.name}
          </Link>
        </h3>
        <div className="relative z-10 -mr-2 -mt-2">
          <BookmarkButton slug={tool.slug} name={tool.name} />
        </div>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
    </div>
  );
}
