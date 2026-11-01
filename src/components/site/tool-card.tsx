"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/registry/types";
import { domainBySlug } from "@/lib/registry";
import { domainAccent } from "@/lib/registry/accents";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "./bookmarks";

/**
 * The whole card is one link (a stretched ::after on the title link); the star
 * sits above it as a sibling button, so no interactive element is nested
 * inside the link.
 */
export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const domain = domainBySlug(tool.domain);
  const Icon = domain?.icon;
  const acc = domainAccent(tool.domain);
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-4 transition-all duration-500 ease-out focus-within:border-primary/50 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark motion-reduce:hover:translate-y-0 sm:p-5",
        compact && "p-3.5 sm:p-4"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {Icon && (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100",
              acc.soft
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden />
          </span>
        )}
        <div className="relative z-10 flex items-center gap-1">
          <BookmarkButton slug={tool.slug} name={tool.name} />
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-deep-rust"
          />
        </div>
      </div>
      <h3
        className={cn(
          "mt-3 font-display leading-snug tracking-tight transition-colors duration-300 group-hover:text-primary",
          compact ? "text-base" : "text-display-sm"
        )}
      >
        <Link
          href={`/${tool.domain}/${tool.slug}`}
          className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {tool.name}
        </Link>
      </h3>
      {!compact && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
      )}
      <div className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5">{domain?.shortName}</span>
        <span className="rounded-full bg-muted px-2 py-0.5">{tool.category}</span>
      </div>
    </div>
  );
}
