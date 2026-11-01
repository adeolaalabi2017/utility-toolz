"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { DOMAINS, PROFESSIONS, TOOLS, popularTools, toolBySlug, toolsByDomain } from "@/lib/registry";
import type { Domain } from "@/lib/registry/types";
import { domainAccent } from "@/lib/registry/accents";
import { ToolCard } from "@/components/site/tool-card";
import { useSearch } from "@/components/site/search-dialog";
import { PinnedToolsBar } from "@/components/site/bookmarks";
import { Cur } from "@/components/site/currency";
import { cn } from "@/lib/utils";
import { fmtPct, fmtUSD, num } from "@/lib/format";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

/* ------------------------------------------------------------------ */
/* Hero quick calculator                                               */
/* ------------------------------------------------------------------ */

type QuickTab = "margin" | "tax" | "discount";
const QUICK_TABS: { id: QuickTab; label: string }[] = [
  { id: "margin", label: "Margin" },
  { id: "tax", label: "VAT / Tax" },
  { id: "discount", label: "Discount" },
];

function QuickField({
  id,
  label,
  value,
  onChange,
  max,
}: {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  const n = Number(value);
  const invalid = value.trim() !== "" && (!isFinite(n) || n < 0 || (max !== undefined && n > max));
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        max={max}
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "tnum mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-medium sm:h-9",
          invalid && "border-lf-coral"
        )}
      />
      {invalid && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-deep-coral">
          {max !== undefined ? `Enter 0 to ${max}` : "Enter 0 or more"}
        </p>
      )}
    </div>
  );
}

function HeroWorkbench() {
  const [tab, setTab] = useState<QuickTab>("margin");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [cost, setCost] = useState("60");
  const [price, setPrice] = useState("100");
  const [subtotal, setSubtotal] = useState("120");
  const [taxRate, setTaxRate] = useState("20");
  const [originalPrice, setOriginalPrice] = useState("80");
  const [discountPct, setDiscountPct] = useState("25");

  const c = Math.max(0, num(cost));
  const p = Math.max(0, num(price));
  const profit = p - c;
  const marginPct = p > 0 ? (profit / p) * 100 : NaN;
  const markupPct = c > 0 ? (profit / c) * 100 : NaN;

  const sub = Math.max(0, num(subtotal));
  const rate = Math.max(0, num(taxRate));
  const taxAmount = (sub * rate) / 100;

  const orig = Math.max(0, num(originalPrice));
  const disc = Math.min(100, Math.max(0, num(discountPct)));
  const savings = (orig * disc) / 100;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const last = QUICK_TABS.length - 1;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : i === 0 ? last : i - 1;
    setTab(QUICK_TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const result = (
    label: string,
    value: string,
    left: ReactNode,
    right: ReactNode,
    tone: string
  ) => (
    <div className="rounded-xl bg-muted/40 p-4" role="status" aria-live="polite" aria-atomic="true">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("tnum font-display text-display-sm", tone)}>{value}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );

  const footer = (note: string, href: string, cta: string) => (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
      <span className="text-muted-foreground">{note}</span>
      <Link
        href={href}
        className="inline-flex min-h-11 items-center gap-1 font-semibold text-deep-orange hover:underline sm:min-h-0"
      >
        {cta} <ArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-lark sm:p-7">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
        <span id="quick-calc-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick calculator
        </span>
        <div
          role="tablist"
          aria-labelledby="quick-calc-title"
          className="grid grid-cols-3 rounded-lg bg-muted/60 p-0.5 text-xs font-medium sm:flex"
        >
          {QUICK_TABS.map((t, i) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`quick-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`quick-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "min-h-10 whitespace-nowrap rounded-md px-3 py-1 transition-colors sm:min-h-0",
                  selected
                    ? "bg-card font-semibold text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`quick-panel-${tab}`}
        aria-labelledby={`quick-tab-${tab}`}
        className="mt-5 space-y-4"
      >
        {tab === "margin" && (
          <>
            <div className="grid grid-cols-2 gap-3.5">
              <QuickField id="qc-cost" label={<>Cost (<Cur />)</>} value={cost} onChange={setCost} />
              <QuickField id="qc-price" label={<>Selling price (<Cur />)</>} value={price} onChange={setPrice} />
            </div>
            {result(
              "Gross margin",
              fmtPct(marginPct, 1),
              <>
                Gross profit: <strong className="text-foreground">{fmtUSD(profit, 2)}</strong>
              </>,
              <>
                Markup: <strong className="text-foreground">{fmtPct(markupPct, 1)}</strong>
              </>,
              profit < 0 ? "text-deep-coral" : "text-deep-green"
            )}
            {footer("Runs in your browser", "/finance/profit-margin-calculator", "Open profit margin tool")}
          </>
        )}

        {tab === "tax" && (
          <>
            <div className="grid grid-cols-2 gap-3.5">
              <QuickField id="qc-net" label={<>Net amount (<Cur />)</>} value={subtotal} onChange={setSubtotal} />
              <QuickField id="qc-rate" label="Tax rate (%)" value={taxRate} onChange={setTaxRate} />
            </div>
            {result(
              "Total with tax",
              fmtUSD(sub + taxAmount, 2),
              <>
                Tax owed: <strong className="text-foreground">{fmtUSD(taxAmount, 2)}</strong>
              </>,
              <>
                Rate applied: <strong className="text-foreground">{fmtPct(rate, 1)}</strong>
              </>,
              "text-deep-purple"
            )}
            {footer("Standard VAT / sales tax formula", "/finance/vat-calculator", "Open VAT calculator")}
          </>
        )}

        {tab === "discount" && (
          <>
            <div className="grid grid-cols-2 gap-3.5">
              <QuickField
                id="qc-orig"
                label={<>Original price (<Cur />)</>}
                value={originalPrice}
                onChange={setOriginalPrice}
              />
              <QuickField id="qc-disc" label="Discount (%)" value={discountPct} onChange={setDiscountPct} max={100} />
            </div>
            {result(
              "Final price to pay",
              fmtUSD(orig - savings, 2),
              <>
                You save: <strong className="text-foreground">{fmtUSD(savings, 2)}</strong>
              </>,
              <>
                Discount: <strong className="text-foreground">{fmtPct(disc, 0)} off</strong>
              </>,
              "text-deep-orange"
            )}
            {footer("Instant markdown calculation", "/finance/discount-calculator", "Open discount calculator")}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Domain ticker — pauses on hover and keyboard focus, and stays still  */
/* for visitors who ask for reduced motion.                             */
/* ------------------------------------------------------------------ */

function DomainTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const items = DOMAINS.map((d) => {
    const tools = toolsByDomain(d.slug);
    return {
      slug: d.slug,
      shortName: d.shortName,
      count: tools.length,
      icon: d.icon,
      desc: tools
        .slice(0, 3)
        .map((t) => t.name.replace(/ Calculator| Generator| Converter| Analyzer| Estimator/g, ""))
        .join(" • "),
    };
  });

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        tweenRef.current = gsap.to(trackRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 100,
          repeat: -1,
        });
        return () => {
          tweenRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: trackRef }
  );

  const pause = () => tweenRef.current?.pause();
  const play = () => tweenRef.current?.play();

  return (
    <nav
      aria-label="All domains"
      className="w-full overflow-x-auto border-y border-border/80 bg-card/40 py-3.5 motion-safe:overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={play}
      onFocus={pause}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) play();
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-6 whitespace-nowrap px-4 will-change-transform">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          const acc = domainAccent(item.slug);
          const duplicate = idx >= items.length;
          return (
            <Link
              key={`${item.slug}-${idx}`}
              href={`/${item.slug}`}
              aria-hidden={duplicate || undefined}
              tabIndex={duplicate ? -1 : undefined}
              className="group flex min-h-11 items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 transition-colors sm:min-h-0 hover:border-primary/50 hover:bg-card"
            >
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", acc.soft)}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="font-display text-xs font-semibold tracking-tight text-foreground group-hover:text-primary sm:text-sm">
                {item.shortName}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {item.count} tools
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">{item.desc}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Domain grid — counts and sample tools come from the registry        */
/* ------------------------------------------------------------------ */

const FEATURED: { slug: Domain["slug"]; span: string; cta: string }[] = [
  { slug: "finance", span: "md:col-span-4 lg:col-span-4 lg:row-span-2", cta: "Explore finance tools" },
  { slug: "marketing", span: "md:col-span-2 lg:col-span-2", cta: "Open marketing tools" },
  { slug: "advertising", span: "md:col-span-2 lg:col-span-2", cta: "Open advertising tools" },
  { slug: "developer", span: "md:col-span-2 lg:col-span-3", cta: "Explore developer tools" },
  { slug: "business", span: "md:col-span-2 lg:col-span-3", cta: "Explore business tools" },
];

function DomainCard({ domain, span, cta, flagship }: { domain: Domain; span: string; cta: string; flagship?: boolean }) {
  const tools = toolsByDomain(domain.slug);
  const acc = domainAccent(domain.slug);
  const Icon = domain.icon;
  return (
    <Link
      href={`/${domain.slug}`}
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark motion-reduce:hover:translate-y-0",
        flagship ? "p-6 sm:p-8" : "p-6",
        span
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex items-center justify-center rounded-xl",
            flagship ? "h-14 w-14 bg-ink text-[#7fbb92]" : cn("h-11 w-11", acc.soft)
          )}
        >
          <Icon className={flagship ? "h-7 w-7" : "h-5 w-5"} aria-hidden />
        </span>
        <Badge variant="secondary" className="text-xs font-semibold">
          {tools.length} tools
        </Badge>
      </div>
      <div className={flagship ? "my-6" : "my-4"}>
        <h3
          className={cn(
            "font-display font-semibold tracking-tight text-foreground",
            flagship ? "text-2xl sm:text-3xl" : "text-xl"
          )}
        >
          {domain.name}
        </h3>
        <p className={cn("mt-2 text-muted-foreground leading-relaxed", flagship ? "max-w-xl text-base" : "line-clamp-2 text-sm")}>
          {domain.description}
        </p>
        {flagship && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Sample ${domain.shortName} tools`}>
            {tools.slice(0, 5).map((t) => (
              <li
                key={t.slug}
                className="rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/85"
              >
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className={cn("flex items-center gap-1.5 font-semibold text-deep-orange", flagship ? "text-sm" : "text-xs")}>
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

function DomainGrid() {
  const [showAll, setShowAll] = useState(false);
  const featured = FEATURED.map((f) => ({ ...f, domain: DOMAINS.find((d) => d.slug === f.slug)! })).filter(
    (f) => f.domain
  );
  const others = DOMAINS.filter((d) => !FEATURED.some((f) => f.slug === d.slug));

  return (
    <div className="mt-10 space-y-8">
      <div className="grid grid-flow-dense grid-cols-1 gap-5 md:grid-cols-4 lg:grid-cols-6">
        {featured.map((f, i) => (
          <DomainCard key={f.slug} domain={f.domain} span={f.span} cta={f.cta} flagship={i === 0} />
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          aria-expanded={showAll}
          aria-controls="more-domains"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-full px-6 text-sm font-semibold hover:bg-card"
        >
          {showAll ? "Show fewer domains" : `Show all ${DOMAINS.length} domains`}
        </Button>
      </div>

      {showAll && (
        <div id="more-domains" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((d) => {
            const Icon = d.icon;
            const acc = domainAccent(d.slug);
            return (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lark motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-start justify-between">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", acc.soft)}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <Badge variant="secondary" className="font-medium">
                    {toolsByDomain(d.slug).length} tools
                  </Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{d.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function HomePage() {
  const { setOpen } = useSearch();
  const popular = popularTools().slice(0, 6);
  const liveCount = TOOLS.length;

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b pb-14 pt-12 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 ambient-radial-glow" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Professional calculators and tools, organized by domain.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {liveCount} free tools across {DOMAINS.length} professional domains — finance, marketing,
            development and everyday work. No signup, and what you type stays in your browser.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-input bg-card px-5 py-3 text-left text-muted-foreground shadow-lark-sm transition-colors hover:border-primary/50 hover:bg-accent sm:w-auto sm:min-w-[280px]"
            >
              <span className="flex items-center gap-2.5">
                <Search className="h-4 w-4 shrink-0 text-deep-orange" aria-hidden />
                <span className="text-sm font-medium">Search {liveCount} tools…</span>
              </span>
              <kbd className="hidden rounded-sm border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground [@media(pointer:fine)]:inline">
                ⌘K
              </kbd>
            </button>
            <Button
              size="lg"
              asChild
              className="min-h-12 w-full rounded-full px-6 font-semibold shadow-lark-sm sm:w-auto"
            >
              <a href="#browse-domains">Browse domains</a>
            </Button>
          </div>

          <div className="mx-auto mt-10 max-w-2xl text-left">
            <HeroWorkbench />
          </div>
        </div>
      </section>

      <DomainTicker />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <PinnedToolsBar />
        </div>

        {/* 2. Domains */}
        <section className="scroll-mt-20 py-14 sm:py-20" aria-labelledby="browse-domains" id="browse-domains-section">
          <h2
            id="browse-domains"
            className="scroll-mt-24 font-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            Browse by professional domain
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Each domain groups the formulas one kind of work relies on, with worked examples and FAQs on
            every tool.
          </p>
          <DomainGrid />
        </section>

        {/* 3. Popular tools */}
        <section className="border-t border-border/80 py-14 sm:py-20" aria-labelledby="popular-tools">
          <h2 id="popular-tools" className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Popular tools
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            The calculators people open most — from ad efficiency to the true cost of a mortgage.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* 4. Professions */}
        <section
          id="professions"
          className="scroll-mt-20 border-t border-border/80 py-14 sm:py-20"
          aria-labelledby="professions-title"
        >
          <h2 id="professions-title" className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Tools for your profession
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Start from what you do, not from what the tool is called. Each page collects the tools that
            job uses most.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROFESSIONS.map((p) => {
              const Icon = p.icon;
              const count = p.liveSlugs.filter((s) => toolBySlug(s)).length;
              return (
                <Link
                  key={p.slug}
                  href={`/professions/${p.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark motion-reduce:hover:translate-y-0"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lf-purple/15 text-deep-purple">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{p.name}</h3>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-deep-orange">
                    {count} tools
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
}
