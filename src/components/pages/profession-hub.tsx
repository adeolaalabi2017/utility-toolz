"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import type { Profession } from "@/lib/registry/types";
import { LIVE_DOMAINS, PLANNED_TOOLS, professionBySlug, toolBySlug, toolsByDomain } from "@/lib/registry";
import { ToolCard } from "@/components/site/tool-card";
import { Clock, Sparkles } from "lucide-react";

export function ProfessionHub({
  profession: professionProp,
  professionSlug,
}: {
  profession?: Profession;
  professionSlug?: string;
}) {
  const profession = professionProp || (professionSlug ? professionBySlug(professionSlug) : undefined);
  if (!profession) return null;
  const Icon = profession.icon;
  const live = profession.liveSlugs
    .map((s) => toolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const coming = profession.comingNames
    .map((n) => PLANNED_TOOLS.find((p) => p.name === n))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tools for {profession.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-[#f2f2ec]">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-display-lg tracking-tight">
              Tools for {profession.name.toLowerCase()}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {profession.blurb}
            </p>
          </div>
        </div>

        {live.length > 0 ? (
          <section className="mt-10" aria-labelledby="ready">
            <h2 id="ready" className="flex items-center gap-2 font-display text-display-sm tracking-tight">
              <Sparkles className="h-4.5 w-4.5 text-muted-foreground" /> Ready now — {live.length} tools
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((t) => (
                <ToolCard key={t.slug} tool={t} compact />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 max-w-3xl rounded-xl bg-card p-5 shadow-lark-sm sm:p-6">
            <h2 className="font-display text-display-sm tracking-tight">Toolkit in development</h2>
            <p className="mt-2 leading-relaxed text-foreground/85">
              This profession&apos;s dedicated set lands in a later phase of the roadmap. The
              platform is domain-first, so related tools may already exist under other domains.
            </p>
          </section>
        )}

        {coming.length > 0 && (
          <section className="mt-10" aria-labelledby="coming">
            <h2 id="coming" className="flex items-center gap-2 font-display text-display-sm tracking-tight">
              <Clock className="h-4.5 w-4.5 text-muted-foreground" /> Upcoming tools on the roadmap
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Built in batches, ordered by demand. Here are the tools scheduled for upcoming releases.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {coming.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground/80">{p.name}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px] text-muted-foreground">
                    Phase {p.phase}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cross-links to domains */}
        <section className="mt-12 border-t pt-8">
          <p className="text-sm font-medium text-muted-foreground">Browse by domain instead:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LIVE_DOMAINS.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
              >
                {d.name}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({toolsByDomain(d.slug).length})
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
