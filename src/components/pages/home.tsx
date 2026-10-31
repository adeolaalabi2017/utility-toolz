"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Check, Crown, Search, Sparkles } from "lucide-react";
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-lark sm:p-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live quick calculator
        </span>
        <div className="flex rounded-lg bg-muted/60 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("margin")}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors",
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
              "rounded-md px-2.5 py-1 transition-colors",
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
              "rounded-md px-2.5 py-1 transition-colors",
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
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Cost ($)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Selling price ($)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
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
            <span className="text-muted-foreground">Runs client-side instant math</span>
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
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Net amount ($)</label>
              <input
                type="number"
                min="0"
                value={subtotal}
                onChange={(e) => setSubtotal(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tax rate (%)</label>
              <input
                type="number"
                min="0"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
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
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Original price ($)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="mt-1 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
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

export function HomePage() {
  const { setOpen } = useSearch();
  const { toast } = useToast();
  const popular = popularTools().slice(0, 6);
  const recent = recentTools(6);
  const liveCount = TOOLS.length;

  return (
    <div>
      {/* ------------------------------ 1. HERO ------------------------------ */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Badge className="mb-5 border border-border bg-card text-muted-foreground hover:bg-card">
                <Sparkles className="mr-1 h-3 w-3 text-[#308f68]" />
                Catalogue complete · {liveCount} professional tools live
              </Badge>
              <h1 className="font-display text-display-xl tracking-tight text-foreground">
                Professional calculators and tools, organized by domain.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                No random list of widgets. Twelve complete professional domains — finance to
                development, productivity to everyday utilities — each one a full toolkit. Free, no
                signup, and every calculation runs in your browser.
              </p>

              {/* Hero search */}
              <button
                onClick={() => setOpen(true)}
                className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-md border border-input bg-card px-4 py-3.5 text-left text-muted-foreground shadow-lark-sm transition-colors hover:bg-[#fffcf2]"
              >
                <Search className="h-5 w-5 shrink-0 text-[#a4502c]" />
                <span className="flex-1 text-[15px]">
                  Search {liveCount} tools — try “margin”, “pomodoro” or “gpa”…
                </span>
                <kbd className="hidden rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                  ⌘K
                </kbd>
              </button>

              {/* Quick links */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                  Popular:
                </span>
                {["roas-calculator", "loan-mortgage-calculator", "profit-margin-calculator", "cac-calculator", "income-tax-calculator"].map(
                  (slug) => {
                    const t = toolBySlug(slug);
                    if (!t) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/${t.domain}/${slug}`}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-[#6b5faf] hover:text-[#3f346f]"
                      >
                        {t.name.replace(" Calculator", "")}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>

            {/* Live interactive hero calculator workbench */}
            <div>
              <HeroWorkbench />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <PinnedToolsBar />
        </div>
        {/* --------------------- 2. BROWSE BY DOMAIN --------------------- */}
        <section className="py-14 sm:py-16" aria-labelledby="browse-domains">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="browse-domains" className="font-display text-display-md tracking-tight">
                Browse by professional domain
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Each domain is a complete workspace: one hub, every tool the profession needs,
                organized into categories.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              const live = d.status === "live";
              const count = live ? toolsByDomain(d.slug).length : null;
              const planned = PLANNED_TOOLS.filter((p) => p.domain === d.slug).length;
              const acc = domainAccent(d.slug);
              return (
                <Link
                  key={d.slug}
                  href={`/${d.slug}`}
                  className={cn(
                    "group rounded-xl border p-5 transition-all",
                    live
                      ? "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lark"
                      : "border-dashed bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        live ? acc.chip : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {live ? (
                      <Badge variant="secondary" className="font-medium">
                        {count} tools
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Phase {d.phase}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-display-sm tracking-tight">{d.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                  {!live && (
                    <p className="mt-2 text-xs font-medium text-muted-foreground/70">
                      {planned} tools planned
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ------------------------ 3. POPULAR TOOLS ------------------------ */}
        <section className="border-t py-14 sm:py-16" aria-labelledby="popular-tools">
          <h2 id="popular-tools" className="font-display text-display-md tracking-tight">
            Popular tools right now
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The calculators professionals open most — from ad efficiency to the true cost of a mortgage.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* --------------------- 4. TOOLS FOR PROFESSION --------------------- */}
        <section className="border-t py-14 sm:py-16" aria-labelledby="professions">
          <h2 id="professions" className="font-display text-display-md tracking-tight">
            Tools for your profession
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Start from what you do, not from what the tool is called. Each hub collects your whole
            toolkit — live tools first, roadmap items next.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROFESSIONS.map((p) => {
              const Icon = p.icon;
              const liveCount = p.liveSlugs.filter((s) => toolBySlug(s)).length;
              return (
                <Link
                  key={p.slug}
                  href={`/professions/${p.slug}`}
                  className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lark"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fbe6da] text-[#3f346f]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-display-sm tracking-tight">{p.name}</h3>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#a4502c]">
                    {liveCount > 0 ? `${liveCount} tools ready now` : "Toolkit coming soon"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ---------------------- 5. RECENTLY ADDED ---------------------- */}
        <section className="border-t py-14 sm:py-16" aria-labelledby="recent">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="recent" className="font-display text-display-md tracking-tight">
                Recently added
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fresh from the build roadmap — new batches land every sprint.
              </p>
            </div>
            <Link
              href="/everyday"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#a4502c] hover:underline sm:flex"
            >
              All everyday tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((t) => (
              <ToolCard key={t.slug} tool={t} compact />
            ))}
          </div>
        </section>

        {/* ------------------------- 6. GUIDES ------------------------- */}
        <section className="border-t py-14 sm:py-16" aria-labelledby="guides">
          <h2 id="guides" className="font-display text-display-md tracking-tight">
            Featured guides & tutorials
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Short, practical explainers — each paired with the calculator that does the math.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {GUIDES.map((g) => {
              const t = toolBySlug(g.tool);
              return (
                <Link
                  key={g.title}
                  href={`/${t?.domain}/${g.tool}`}
                  className="group flex flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lark"
                >
                  <BookOpen className="h-5 w-5 text-[#6b5faf]" />
                  <h3 className="mt-3 font-display text-display-sm leading-snug tracking-tight">
                    {g.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {g.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#a4502c]">
                    Open the calculator
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* --------------------- 7. PREMIUM PROMO --------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="premium">
        <div className="overflow-hidden rounded-xl bg-ink px-6 py-10 text-[#fef5de] shadow-lark sm:px-10 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f0a469]">
                <Crown className="h-4 w-4" /> Utility Toolz Pro
              </p>
              <h2 id="premium" className="mt-3 font-display text-display-md tracking-tight">
                Ad-free, with your presets saved — $5/month
              </h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[#fef5de]/75">
                The tools stay free forever. Pro removes ads, remembers your saved scenarios
                across devices, and unlocks bulk exports across the full {liveCount}-tool catalogue.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                `Zero ads across all ${liveCount} tools`,
                "Saved presets and calculation history",
                "CSV export on every calculator",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e07a3c]/25">
                    <Check className="h-3 w-3 text-[#f0a469]" />
                  </span>
                  <span className="text-[#fef5de]/85">{b}</span>
                </li>
              ))}
              <li>
                <Button
                  className="mt-2 w-full bg-[#fef5de] text-[#1f4a3f] hover:bg-white sm:w-auto"
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
