"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Domain, Tool } from "@/lib/registry/types";
import { LIVE_DOMAINS, PLANNED_TOOLS, categoriesByDomain, domainBySlug, toolsByDomain } from "@/lib/registry";
import { ToolCard } from "@/components/site/tool-card";

const matches = (t: Tool, q: string) =>
  !q || [t.name, t.tagline, t.category, ...t.tags].join(" ").toLowerCase().includes(q);

export function DomainHub({
  domain: domainProp,
  domainSlug,
}: {
  domain?: Domain;
  domainSlug?: string;
}) {
  const filterId = React.useId();
  const [query, setQuery] = React.useState("");
  const domain = domainProp || (domainSlug ? domainBySlug(domainSlug) : undefined);
  if (!domain) return null;

  const live = domain.status === "live";
  const q = query.trim().toLowerCase();
  const tools = toolsByDomain(domain.slug).filter((t) => matches(t, q));
  const popular = tools.filter((t) => t.popular);
  const groups = categoriesByDomain(domain.slug)
    .map((name) => ({ name, tools: tools.filter((t) => t.category === name && !t.popular) }))
    .filter((g) => g.tools.length > 0);
  const planned = PLANNED_TOOLS.filter((p) => p.domain === domain.slug);

  return (
    <article className="mx-auto max-w-7xl px-4 pb-14 pt-3 sm:px-6">
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

      <header className="mt-6 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <div className="min-w-0 flex-[1_1_560px]">
          <h1 className="text-display-lg">{domain.name}</h1>
          <p className="mt-4 max-w-2xl text-xl leading-snug text-muted-foreground">{domain.description}</p>
        </div>
        {live && (
          <div className="min-w-0 flex-[0_1_420px]">
            <Label htmlFor={filterId} className="text-sm text-muted-foreground">
              Filter this domain
            </Label>
            <Input
              id={filterId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1.5 h-12 bg-card text-lg"
            />
            <p aria-live="polite" className="mt-2.5">
              <span className="tnum rounded-md bg-highlight px-2.5 py-0.5 font-semibold text-on-highlight">
                {tools.length === 1 ? "1 tool" : `${tools.length} tools`}
              </span>
            </p>
          </div>
        )}
      </header>

      {live ? (
        <>
          {popular.length > 0 && (
            <section className="mt-10" aria-labelledby="popular">
              <h2 id="popular" className="text-display-sm">
                Popular
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}

          {groups.length > 0 && (
            <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-2">
              {groups.map((g) => (
                <section key={g.name} aria-label={g.name}>
                  <h2 className="text-display-sm">{g.name}</h2>
                  <div className="mt-3 grid gap-2">
                    {g.tools.map((t) => (
                      <ToolCard key={t.slug} tool={t} compact />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {tools.length === 0 && (
            <p className="mt-10 text-xl">Nothing in {domain.shortName} matches that. Try a broader word, or press ⌘K to search every tool.</p>
          )}
        </>
      ) : (
        <>
          <section className="mt-10 max-w-3xl rounded-xl bg-card p-5 sm:p-6">
            <h2 className="text-display-sm">{planned.length} tools planned</h2>
            <ul className="mt-3 list-disc pl-5 text-muted-foreground">
              {planned.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </section>
          <section className="mt-8">
            <p className="text-sm text-muted-foreground">These domains are live today:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LIVE_DOMAINS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${d.slug}`}
                  className="inline-flex min-h-11 items-center rounded-md border-[1.5px] border-input px-4 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </article>
  );
}
