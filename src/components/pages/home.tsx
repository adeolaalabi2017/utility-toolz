"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Check, Crown, Search } from "lucide-react";
import {
  DOMAINS,
  PLANNED_TOOLS,
  PROFESSIONS,
  TOOLS,
  popularTools,
  recentTools,
  toolBySlug,
  toolsByDomain,
} from "@/lib/registry";
import { domainAccent } from "@/lib/registry/accents";
import { ToolCard } from "@/components/site/tool-card";
import { useSearch } from "@/components/site/search-dialog";
import { PinnedToolsBar } from "@/components/site/bookmarks";
import { cn } from "@/lib/utils";
import { fmtPct, fmtUSD } from "@/lib/format";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const GUIDES = [
  {
    title: "ROAS vs margin: where break-even really sits",
    excerpt:
      "A 4x ROAS can be losing money and a 2x can be printing it — the difference is gross margin. Learn the one formula that separates profitable buyers from busy ones.",
    tool: "roas-calculator",
  },
  {
    title: "The 50/30/20 budget, made practical",
    excerpt:
      "Half for needs, a third for wants, a fifth for the future. Where the rule helps, where it breaks, and how to rebalance without spreadsheet gymnastics.",
    tool: "budget-expense-calculator",
  },
  {
    title: "CAC payback: the metric that keeps you honest",
    excerpt:
      "Acquisition costs hide in salaries and tools, not just ad platforms. Payback period turns CAC from a vanity number into a cash-flow decision.",
    tool: "cac-calculator",
  },
];

function HeroWorkbench() {
  const [tab, setTab] = useState<"margin" | "tax" | "discount">("margin");

  // Margin state
  const [cost, setCost] = useState(60);
  const [price, setPrice] = useState(100);

  // Tax state
  const [subtotal, setSubtotal] = useState(120);
  const [taxRate, setTaxRate] = useState(20);

  // Discount state
  const [originalPrice, setOriginalPrice] = useState(80);
  const [discountPct, setDiscountPct] = useState(25);

  const profit = Math.max(0, price - cost);
  const marginPct = price > 0 ? (profit / price) * 100 : 0;
  const markupPct = cost > 0 ? (profit / cost) * 100 : 0;

  const taxAmount = (subtotal * taxRate) / 100;
  const totalWithTax = subtotal + taxAmount;

  const savings = (originalPrice * discountPct) / 100;
  const finalPrice = Math.max(0, originalPrice - savings);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-lark sm:p-7 backdrop-blur-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live quick calculator
        </span>
        <div className="flex rounded-lg bg-muted/60 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("margin")}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              tab === "margin"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Margin
          </button>
          <button
            type="button"
            onClick={() => setTab("tax")}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              tab === "tax"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            VAT / Tax
          </button>
          <button
            type="button"
            onClick={() => setTab("discount")}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              tab === "discount"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Discount
          </button>
        </div>
      </div>

      {tab === "margin" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Cost ($)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Selling price ($)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Gross margin</span>
              <span className="tnum font-display text-display-sm text-[#1f5f45]">
                {fmtPct(marginPct, 1)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Gross profit: <strong className="text-foreground">{fmtUSD(profit, 2)}</strong>
              </span>
              <span>
                Markup: <strong className="text-foreground">{fmtPct(markupPct, 1)}</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted-foreground">Client-side instant formula</span>
            <Link
              href="/finance/profit-margin-calculator"
              className="inline-flex items-center gap-1 font-semibold text-[#a4502c] hover:underline"
            >
              Open profit margin tool <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {tab === "tax" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Net amount ($)</label>
              <input
                type="number"
                min="0"
                value={subtotal}
                onChange={(e) => setSubtotal(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tax rate (%)</label>
              <input
                type="number"
                min="0"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Total with tax</span>
              <span className="tnum font-display text-display-sm text-[#3f346f]">
                {fmtUSD(totalWithTax, 2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Tax owed: <strong className="text-foreground">{fmtUSD(taxAmount, 2)}</strong>
              </span>
              <span>
                Rate applied: <strong className="text-foreground">{fmtPct(taxRate, 1)}</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted-foreground">Standard VAT / sales tax formula</span>
            <Link
              href="/finance/vat-calculator"
              className="inline-flex items-center gap-1 font-semibold text-[#a4502c] hover:underline"
            >
              Open VAT calculator <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {tab === "discount" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Original price ($)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Discount off (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Final price to pay</span>
              <span className="tnum font-display text-display-sm text-[#a4502c]">
                {fmtUSD(finalPrice, 2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                You save: <strong className="text-foreground">{fmtUSD(savings, 2)}</strong>
              </span>
              <span>
                Discount: <strong className="text-foreground">{fmtPct(discountPct, 0)} off</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted-foreground">Instant markdown calculation</span>
            <Link
              href="/finance/discount-calculator"
              className="inline-flex items-center gap-1 font-semibold text-[#a4502c] hover:underline"
            >
              Open discount calculator <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DomainTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const tickerItems = DOMAINS.map((d) => {
    const tools = toolsByDomain(d.slug);
    const sample = tools
      .slice(0, 3)
      .map((t) => t.name.replace(/ Calculator| Generator| Converter| Analyzer| Estimator/g, ""))
      .join(" • ");
    return {
      slug: d.slug,
      shortName: d.shortName,
      name: d.name,
      count: tools.length,
      icon: d.icon,
      desc: sample,
    };
  });

  useGSAP(
    () => {
      if (!tickerRef.current) return;

      // GSAP hardware-accelerated continuous infinite scroll (calibrated to editorial ~43px/sec)
      tweenRef.current = gsap.to(tickerRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 100,
        repeat: -1,
      });
    },
    { scope: tickerRef }
  );

  return (
    <div
      className="w-full overflow-hidden border-y border-border/80 bg-card/40 py-3.5 backdrop-blur-xs select-none"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div
        ref={tickerRef}
        className="flex items-center gap-6 whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          const acc = domainAccent(item.slug);
          return (
            <Link
              key={`${item.slug}-${idx}`}
              href={`/${item.slug}`}
              className="group flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-xs"
            >
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", acc.soft)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="font-display font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary text-xs sm:text-sm">
                {item.shortName}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {item.count} tools
              </span>
              <span className="text-muted-foreground/70 text-xs hidden sm:inline">
                {item.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ScrubbingTextManifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      const words = textRef.current.querySelectorAll(".scrub-word");
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const manifestoText =
    "Every calculation runs entirely in your browser. Zero tracking. Zero server latency. Deterministic mathematical models built for professionals whose decisions depend on absolute accuracy.";

  return (
    <section
      ref={containerRef}
      className="my-28 md:my-36 rounded-2xl border border-border bg-card/60 p-8 sm:p-14 md:p-20 shadow-lark text-center relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 ambient-radial-glow pointer-events-none" />
      <span className="text-xs font-semibold uppercase tracking-widest text-[#a4502c]">
        Architecture & Principles
      </span>
      <p
        ref={textRef}
        className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-snug max-w-4xl mx-auto text-foreground font-medium"
      >
        {manifestoText.split(" ").map((word, i) => (
          <span key={i} className="scrub-word inline-block mr-2.5 transition-opacity duration-300">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}

function DomainBentoGrid() {
  const [showAll, setShowAll] = useState(false);
  const finance = DOMAINS.find((d) => d.slug === "finance")!;
  const marketing = DOMAINS.find((d) => d.slug === "marketing")!;
  const advertising = DOMAINS.find((d) => d.slug === "advertising")!;
  const developer = DOMAINS.find((d) => d.slug === "developer")!;
  const business = DOMAINS.find((d) => d.slug === "business")!;

  const otherDomains = DOMAINS.filter(
    (d) => !["finance", "marketing", "advertising", "developer", "business"].includes(d.slug)
  );

  return (
    <div className="mt-12 space-y-8">
      {/* 6-Column Mathematically Verified Gapless Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-flow-dense gap-6">
        {/* Card 1: Finance Flagship (Area: 4 cols x 2 rows = 8 units) */}
        <Link
          href={`/${finance.slug}`}
          className="group relative col-span-1 md:col-span-4 lg:col-span-4 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink text-[#7fbb92] transition-transform duration-500 group-hover:scale-110">
              <finance.icon className="h-7 w-7" />
            </span>
            <Badge variant="secondary" className="font-semibold text-xs px-3 py-1">
              16 tools live
            </Badge>
          </div>
          <div className="my-6">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {finance.name} Workspace
            </h3>
            <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
              {finance.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Loan Amortization", "VAT & Sales Tax", "Compound Interest", "Break-Even Revenue", "Profit Margin"].map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/85 transition-colors group-hover:border-primary/30"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#a4502c]">
            Explore complete financial suite
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Marketing (Area: 2 cols x 1 row = 2 units) */}
        <Link
          href={`/${marketing.slug}`}
          className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faecd6] text-[#c9603c] transition-transform duration-500 group-hover:scale-110">
              <marketing.icon className="h-5 w-5" />
            </span>
            <Badge variant="secondary" className="font-medium text-xs">
              14 tools
            </Badge>
          </div>
          <div className="my-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {marketing.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {marketing.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
            Open marketing suite <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 3: Advertising (Area: 2 cols x 1 row = 2 units) */}
        <Link
          href={`/${advertising.slug}`}
          className="group relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbe6da] text-[#c9603c] transition-transform duration-500 group-hover:scale-110">
              <advertising.icon className="h-5 w-5" />
            </span>
            <Badge variant="secondary" className="font-medium text-xs">
              12 tools
            </Badge>
          </div>
          <div className="my-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {advertising.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {advertising.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
            Open advertising suite <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 4: Developer (Area: 3 cols x 1 row = 3 units) */}
        <Link
          href={`/${developer.slug}`}
          className="group relative col-span-1 md:col-span-2 lg:col-span-3 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f2fd] text-[#1f4a3f] transition-transform duration-500 group-hover:scale-110">
              <developer.icon className="h-5 w-5" />
            </span>
            <Badge variant="secondary" className="font-medium text-xs">
              11 tools
            </Badge>
          </div>
          <div className="my-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Developer & Engineering
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {developer.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
            Explore developer utilities <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 5: Business Operations (Area: 3 cols x 1 row = 3 units) */}
        <Link
          href={`/${business.slug}`}
          className="group relative col-span-1 md:col-span-2 lg:col-span-3 row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6f4ea] text-[#1f5f45] transition-transform duration-500 group-hover:scale-110">
              <business.icon className="h-5 w-5" />
            </span>
            <Badge variant="secondary" className="font-medium text-xs">
              13 tools
            </Badge>
          </div>
          <div className="my-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Business Operations
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {business.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
            Explore business models <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Toggle to browse all remaining 7 domains */}
      <div className="pt-4 text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowAll(!showAll)}
          className="rounded-full px-6 text-sm font-semibold transition-all hover:bg-card"
        >
          {showAll ? "Collapse additional domains" : "Browse all 12 professional domains"}
        </Button>
      </div>

      {showAll && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {otherDomains.map((d) => {
            const Icon = d.icon;
            const count = toolsByDomain(d.slug).length;
            const acc = domainAccent(d.slug);
            return (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lark"
              >
                <div className="flex items-start justify-between">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", acc.chip)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <Badge variant="secondary" className="font-medium">
                    {count} tools
                  </Badge>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold tracking-tight">{d.name}</h4>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const { setOpen } = useSearch();
  const { toast } = useToast();
  const popular = popularTools().slice(0, 6);
  const recent = recentTools(6);
  const liveCount = TOOLS.length;

  return (
    <div>
      {/* ------------------------------ 1. HERO (Cinematic Center) ------------------------------ */}
      <section className="relative overflow-hidden border-b pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32">
        <div className="absolute inset-0 ambient-radial-glow pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.12]">
            Professional calculators and tools, organized by domain.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground font-normal">
            No random list of widgets. Twelve complete professional domains covering finance, marketing, development, and everyday operations. Free, private, and calculated entirely inside your browser.
          </p>

          {/* Centered Action Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-full border border-input bg-card px-5 py-3.5 text-left text-muted-foreground shadow-lark-sm transition-all hover:border-primary/50 hover:bg-accent sm:w-auto sm:min-w-[280px]"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#a4502c]" />
                <span className="text-sm font-medium">Search {liveCount} tools...</span>
              </div>
              <kbd className="rounded-sm border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-[#173b32] font-semibold px-6 shadow-lark-sm"
            >
              <a href="#browse-domains">Explore Workspaces</a>
            </Button>
          </div>

          {/* Centered Live Interactive Hero Calculator Workbench */}
          <div className="mt-14 max-w-2xl mx-auto text-left">
            <HeroWorkbench />
          </div>
        </div>
      </section>

      {/* Infinite Marquee Component */}
      <DomainTicker />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-10">
          <PinnedToolsBar />
        </div>

        {/* --------------------- 2. BROWSE BY DOMAIN (Gapless Bento Grid) --------------------- */}
        <section className="py-24 sm:py-32" aria-labelledby="browse-domains">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="browse-domains" className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
                Browse by professional domain
              </h2>
              <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground">
                Each domain is an integrated workstation: comprehensive formulas, verified models, and instant browser execution.
              </p>
            </div>
          </div>
          <DomainBentoGrid />
        </section>

        {/* --------------------- 3. DESIRE SECTION (GSAP Scrubbing Text Reveal) --------------------- */}
        <ScrubbingTextManifesto />

        {/* ------------------------ 4. POPULAR TOOLS ------------------------ */}
        <section className="border-t border-border/80 py-24 sm:py-32" aria-labelledby="popular-tools">
          <h2 id="popular-tools" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
            Popular tools right now
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            The calculators professionals open most — from ad efficiency to the true cost of a mortgage.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* --------------------- 5. TOOLS FOR PROFESSION --------------------- */}
        <section className="border-t border-border/80 py-24 sm:py-32" aria-labelledby="professions">
          <h2 id="professions" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
            Tools for your profession
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Start from what you do, not from what the tool is called. Each hub collects your whole
            toolkit — live tools first, roadmap items next.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROFESSIONS.map((p) => {
              const Icon = p.icon;
              const liveCategoryCount = p.liveSlugs.filter((s) => toolBySlug(s)).length;
              return (
                <Link
                  key={p.slug}
                  href={`/professions/${p.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbe6da] text-[#3f346f] transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {p.name}
                    </h3>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
                    {liveCategoryCount > 0 ? `${liveCategoryCount} tools ready now` : "Toolkit roadmap"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ---------------------- 6. RECENTLY ADDED ---------------------- */}
        <section className="border-t border-border/80 py-24 sm:py-32" aria-labelledby="recent">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="recent" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
                Recently added
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Fresh from the build roadmap — new tools landing continuously.
              </p>
            </div>
            <Link
              href="/everyday"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#a4502c] hover:underline sm:flex"
            >
              All everyday tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((t) => (
              <ToolCard key={t.slug} tool={t} compact />
            ))}
          </div>
        </section>

        {/* ------------------------- 7. GUIDES ------------------------- */}
        <section className="border-t border-border/80 py-24 sm:py-32" aria-labelledby="guides">
          <h2 id="guides" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
            Featured guides & tutorials
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Short, practical explainers — each paired directly with the calculator that does the math.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {GUIDES.map((g) => {
              const t = toolBySlug(g.tool);
              return (
                <Link
                  key={g.title}
                  href={`/${t?.domain}/${g.tool}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lark"
                >
                  <BookOpen className="h-5 w-5 text-[#6b5faf] transition-transform duration-500 group-hover:scale-110" />
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                    {g.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {g.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#a4502c]">
                    Open the calculator
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* --------------------- 8. ACTION / PREMIUM PROMO --------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6" aria-labelledby="premium">
        <div className="overflow-hidden rounded-2xl bg-ink px-7 py-12 text-[#fef5de] shadow-lark sm:px-12 sm:py-16 border border-transparent dark:border-[#24443b]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#f0a469]">
                <Crown className="h-4 w-4" /> Utility Toolz Pro
              </p>
              <h2 id="premium" className="mt-4 font-display text-3xl sm:text-4xl tracking-tight text-[#fef5de]">
                Ad-free, with your presets saved — $5/month
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#fef5de]/80">
                The tools stay free forever. Pro removes ads, remembers your saved scenarios
                across devices, and unlocks bulk exports across the full {liveCount}-tool catalogue.
              </p>
            </div>
            <ul className="space-y-3.5">
              {[
                `Zero ads across all ${liveCount} tools`,
                "Saved presets and calculation history",
                "CSV export on every calculator",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e07a3c]/25">
                    <Check className="h-3 w-3 text-[#f0a469]" />
                  </span>
                  <span className="text-[#fef5de]/90">{b}</span>
                </li>
              ))}
              <li>
                <Button
                  className="mt-3 w-full bg-[#fef5de] text-[#1f4a3f] hover:bg-white sm:w-auto font-semibold px-6 shadow-sm dark:bg-[#fef5de] dark:text-[#11261f]"
                  onClick={() =>
                    toast({
                      title: "You're on the waitlist",
                      description:
                        "Pro invites go out to this list first — ad-free, saved presets and bulk exports.",
                    })
                  }
                >
                  Join the waitlist
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
