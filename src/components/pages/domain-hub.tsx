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
import type { Domain } from "@/lib/registry/types";
import { LIVE_DOMAINS, PLANNED_TOOLS, categoriesByDomain, domainBySlug, toolsByDomain } from "@/lib/registry";
import { ToolCard } from "@/components/site/tool-card";
import { Clock } from "lucide-react";

export function DomainHub({
  domain: domainProp,
  domainSlug,
}: {
  domain?: Domain;
  domainSlug?: string;
}) {
  const domain = domainProp || (domainSlug ? domainBySlug(domainSlug) : undefined);
  if (!domain) return null;
  const Icon = domain.icon;
  const live = domain.status === "live";
  const tools = toolsByDomain(domain.slug);
  const categories = categoriesByDomain(domain.slug);
  const planned = PLANNED_TOOLS.filter((p) => p.domain === domain.slug);

  return (
    <article>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{domain.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Domain header */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-start gap-4">
          <span
            className={
              live
                ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-[#7fbb92]"
                : "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
            }
          >
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-display-lg tracking-tight">{domain.name}</h1>
              {live ? (
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
                  {tools.length} tools live
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> Phase {domain.phase} of the roadmap
                </Badge>
              )}
            </div>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {domain.description}
            </p>
          </div>
        </div>

        {live ? (
          <>
            {/* Category sections */}
            {categories.map((cat) => (
              <section key={cat} className="mt-10" aria-labelledby={`cat-${cat}`}>
                <h2 id={`cat-${cat}`} className="font-display text-display-sm tracking-tight">
                  {cat}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools
                    .filter((t) => t.category === cat)
                    .map((t) => (
                      <ToolCard key={t.slug} tool={t} />
                    ))}
                </div>
              </section>
            ))}

            {/* Next up */}
            {planned.length > 0 && (
              <section className="mt-12 rounded-xl border border-dashed bg-muted/30 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-display-sm tracking-tight">
                  <Clock className="h-4.5 w-4.5 text-[#c9603c]" /> Next up in {domain.shortName}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  From the build roadmap — each batch ships as a sprint, ordered by search demand.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {planned.map((p) => (
                    <Badge key={p.name} variant="outline" className="py-1 text-foreground/80">
                      {p.name}
                      <span className="ml-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
                        Phase {p.phase}
                      </span>
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            {/* Planned domain hub */}
            <section className="mt-10 max-w-3xl rounded-xl border bg-card p-5 shadow-lark-sm sm:p-6">
              <h2 className="font-display text-display-sm tracking-tight">
                On the roadmap — {planned.length} tools planned
              </h2>
              <p className="mt-2 leading-relaxed text-foreground/85">
                This domain enters the build queue in Phase {domain.phase} of the six-month plan,
                once the launch domains have banked their rankings. The full catalogue below ships
                in batches of four to eight tools.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {planned.map((p) => (
                  <Badge key={p.name} variant="outline" className="py-1 text-foreground/80">
                    {p.name}
                    <span className="ml-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
                      Phase {p.phase}
                    </span>
                  </Badge>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <p className="text-sm font-medium text-muted-foreground">
                Meanwhile, these domains are live today:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LIVE_DOMAINS.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
