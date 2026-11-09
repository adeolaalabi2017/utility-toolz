"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  LengthPill,
  MiniTable,
  NumberField,
  OutputPanel,
  SelectField,
  StatRow,
  TextAreaField,
  Verdict,
} from "./ui";

/* ================================================================== */
/* 33. Meta title generator                                            */
/* ================================================================== */

const TITLE_PATTERNS: ((kw: string, brand: string, year: string) => string)[] = [
  (kw) => `${kw}: The Complete Guide for ${new Date().getFullYear()}`,
  (kw, brand) => `${kw} — ${brand}`,
  (kw) => `How to Master ${kw} (Step-by-Step)`,
  (kw, brand, year) => `${kw} in ${year}: Best Practices & Examples`,
  (kw) => `${kw} Explained Simply | Free Resource`,
  (kw, brand) => `10 ${kw} Tips the Pros Use — ${brand}`,
];

export function MetaTitleGenerator() {
  const [keyword, setKeyword] = React.useState("Email marketing");
  const [brand, setBrand] = React.useState("Brightlist");
  const [year] = React.useState(() => String(new Date().getFullYear()));

  const kw = keyword.trim() || "Your topic";
  const br = brand.trim() || "Your brand";
  const titles = TITLE_PATTERNS.map((fn) => fn(kw, br, year));

  return (
    <CalcLayout inputFirst
      inputs={
        <FieldGrid>
          <div className="space-y-1.5">
            <Label htmlFor="seo-1" className="text-sm font-medium">Primary keyword</Label>
            <Input id="seo-1"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Email marketing"
            />
            <p className="text-xs text-muted-foreground">The head term this page should rank for.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seo-2" className="text-sm font-medium">Brand / site name</Label>
            <Input id="seo-2"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Brightlist"
            />
            <p className="text-xs text-muted-foreground">Appended where the pattern benefits from it.</p>
          </div>
        </FieldGrid>
      }
      results={
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Six title options
          </p>
          {titles.map((t) => (
            <div key={t} className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-snug">{t}</p>
                <LengthPill value={t.length} min={30} max={60} />
              </div>
              <div className="mt-2">
                <CopyButton text={t} size="xs" label="Copy title" />
              </div>
            </div>
          ))}
          <Verdict tone="neutral">
            Google rewrites roughly 60% of titles, but a clear keyword-first title under 60 characters
            is still the strongest signal you control. Front-load the keyword — mobile SERPs cut
            around 45 characters.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 34. Meta description generator                                      */
/* ================================================================== */

export function MetaDescriptionGenerator() {
  const [keyword, setKeyword] = React.useState("project management");
  const [benefit, setBenefit] = React.useState("ship projects 2 weeks faster");
  const [cta, setCta] = React.useState("See how it works");

  const kw = keyword.trim() || "your topic";
  const ben = benefit.trim() || "your key benefit";
  const call = cta.trim() || "Learn more";
  const y = new Date().getFullYear();

  const variants = [
    `Learn ${kw} the practical way. No fluff, no theory dumps — just the steps that ${ben}. ${call}.`,
    `Everything you need to get ${kw} right in ${y}: a clear framework, real examples and the mistakes to avoid. ${call} →`,
    `Struggling with ${kw}? This guide breaks it into simple steps any team can follow — and shows how to ${ben}.`,
    `${kw}, minus the jargon. A free, step-by-step resource that helps you ${ben}. ${call} — it takes 5 minutes.`,
  ];

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seo-3" className="text-sm font-medium">Primary keyword</Label>
            <Input id="seo-3" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seo-4" className="text-sm font-medium">Key benefit (finish the phrase)</Label>
            <Input id="seo-4"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              placeholder="e.g. ship projects 2 weeks faster"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seo-5" className="text-sm font-medium">Call to action</Label>
            <Input id="seo-5" value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>
        </div>
      }
      results={
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Four description variants
          </p>
          {variants.map((v) => (
            <div key={v} className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm leading-relaxed">{v}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <LengthPill value={v.length} min={120} max={158} />
                <CopyButton text={v} size="xs" label="Copy" />
              </div>
            </div>
          ))}
          <Verdict tone="neutral">
            Google truncates near 155–160 characters on desktop. Descriptions don&apos;t rank pages —
            they win the click: one benefit, one proof point, one action.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 35. SERP snippet preview                                            */
/* ================================================================== */

function estimatePixels(text: string): number {
  // Rough model of Google's 20px Arial/500-weight title rendering.
  return Math.round(text.length * 8.6);
}

export function SerpSnippetPreview() {
  const [title, setTitle] = React.useState("ROAS Calculator — Measure Every Ad Dollar | ToolDeck");
  const [description, setDescription] = React.useState(
    "Enter spend and revenue to see your exact return on ad spend, break-even ROAS and what each click can afford to cost. Free, no signup."
  );
  const [url, setUrl] = React.useState("https://tooldeck.example/advertising/roas-calculator");

  const titlePx = estimatePixels(title);
  const titleTrunc = titlePx > 580;
  const descTrunc = description.length > 160;

  let host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const pathParts = host.split("/");
  const domain = pathParts.shift() ?? "";
  const crumbs = pathParts.filter(Boolean).map((p) =>
    p.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="seo-6" className="text-sm font-medium">Title tag</Label>
              <LengthPill value={title.length} min={30} max={60} />
            </div>
            <Input id="seo-6" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <TextAreaField
            label="Meta description"
            value={description}
            onChange={setDescription}
            rows={4}
          />
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="seo-7" className="text-sm font-medium">Page URL</Label>
              <Input id="seo-7" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <p className="text-sm font-semibold text-muted-foreground">
            Desktop result preview
          </p>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {domain.charAt(0).toUpperCase() || "A"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] leading-tight text-[#202124]">{domain}</p>
                <p className="truncate text-[12px] leading-tight text-[#4d5156]">
                  {crumbs.length ? `https://${domain} › ${crumbs.join(" › ")}` : url}
                </p>
              </div>
            </div>
            <p className="mt-1.5 text-[19px] leading-snug text-[#1a0dab]">
              {titleTrunc ? `${title.slice(0, Math.max(0, Math.floor(580 / 8.6)))}…` : title}
            </p>
            <p className="mt-1 text-[13.5px] leading-snug text-[#4d5156]">
              {descTrunc ? `${description.slice(0, 157)}…` : description}
            </p>
          </div>
          <div>
            <StatRow label="Title pixel estimate" value={`${titlePx}px / 580px`} />
            <StatRow label="Description length" value={`${description.length} / 160 chars`} />
            <StatRow
              label="Title renders in full"
              value={titleTrunc ? "No — will be cut" : "Yes"}
              emphasis
            />
          </div>
          <Verdict tone={titleTrunc || descTrunc ? "warn" : "good"}>
            {titleTrunc || descTrunc
              ? "Truncation detected: your snippet will be cut with an ellipsis in live results. Shorten until the estimate sits inside the pixel budget."
              : "Snippet fits Google's pixel budget — the full title and description will render as written."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 36. Keyword density checker                                         */
/* ================================================================== */

const STOPWORDS = new Set(
  "a an and are as at be but by for from has have how i in is it its of on or that the this to was were what when where which who will with you your our we they their".split(
    " "
  )
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function ngramCounts(tokens: string[], n: number, dropStop: boolean): Map<string, number> {
  const counts = new Map<string, number>();
  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n);
    if (dropStop && gram.some((w) => STOPWORDS.has(w.replace(/['-]/g, "")))) continue;
    const key = gram.join(" ");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

export function KeywordDensityChecker() {
  const [text, setText] = React.useState(
    "Email marketing works when every send has one job. Segmented email marketing beats batch-and-blast because each message speaks to one reader. Track email marketing metrics weekly, test one variable at a time, and let the audience tell you what email marketing should do next."
  );
  const [dropStop, setDropStop] = React.useState(true);

  const tokens = tokenize(text);
  const words = tokens.length;
  const top = (n: number) =>
    [...ngramCounts(tokens, n, dropStop).entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([phrase, count]) => [
        phrase,
        count,
        `${((count / Math.max(1, words - n + 1)) * 100).toFixed(1)}%`,
      ]);

  const topWord = top(1)[0];
  const topDensity = topWord ? parseFloat(String(topWord[2])) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Paste your content
          </p>
          <TextAreaField
            ariaLabel="Text to analyse"
            value={text}
            onChange={setText}
            rows={12}
            mono
            placeholder="Paste the full text of your page…"
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dropStop}
              onChange={(e) => setDropStop(e.target.checked)}
              className="h-4 w-4 accent-[var(--foreground)]"
            />
            Exclude phrases containing stop words (the, and, of…)
          </label>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Density report
          </p>
          <p className="tnum text-2xl font-bold">{words.toLocaleString()} words</p>
          <p className="mt-4 space-y-0 text-sm font-semibold text-muted-foreground">
            Top phrases
          </p>
          {words === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Start typing to see the analysis.</p>
          ) : (
            <div className="mt-2 space-y-4">
              {[1, 2, 3].map((n) => (
                <MiniTable
                  key={n}
                  head={[`${n}-word phrase`, "Uses", "Density"]}
                  rows={top(n)}
                />
              ))}
              <Verdict tone={topDensity > 3 ? "bad" : topDensity > 2 ? "warn" : "good"}>
                {topDensity > 3
                  ? `Your top phrase sits at ${topWord?.[2]} density — above the ~3% zone where over-optimization becomes a spam signal. Broaden the wording.`
                  : topDensity > 2
                    ? `Top phrase is at ${topWord?.[2]} — usable, but swap a few mentions for synonyms to stay natural.`
                    : "Density is in the natural range. Focus on covering the topic well rather than repeating any single phrase."}
              </Verdict>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 37. Robots.txt generator                                            */
/* ================================================================== */

export function RobotsTxtGenerator() {
  const [preset, setPreset] = React.useState("standard");
  const [agent, setAgent] = React.useState("*");
  const [disallow, setDisallow] = React.useState("/admin/\n/cart\n/checkout\n/thank-you");
  const [crawlDelay, setCrawlDelay] = React.useState("");
  const [sitemap, setSitemap] = React.useState("https://yoursite.com/sitemap.xml");

  const paths = disallow
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let out = "";
  if (preset === "allow-all") {
    out += `User-agent: *\nAllow: /\n`;
  } else if (preset === "block-all") {
    out += `User-agent: *\nDisallow: /\n`;
  } else {
    out += `User-agent: ${agent || "*"}\n`;
    if (paths.length === 0) {
      out += `Allow: /\n`;
    } else {
      for (const p of paths) out += `Disallow: ${p.startsWith("/") ? p : `/${p}`}\n`;
    }
    if (crawlDelay.trim()) out += `Crawl-delay: ${crawlDelay.trim()}\n`;
  }
  if (sitemap.trim()) out += `\nSitemap: ${sitemap.trim()}\n`;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Crawl policy"
            value={preset}
            onChange={setPreset}
            options={[
              { value: "standard", label: "Standard — block private areas" },
              { value: "allow-all", label: "Allow everything" },
              { value: "block-all", label: "Block everything (staging)" },
            ]}
          />
          {preset === "standard" && (
            <>
              <SelectField
                label="Target bot"
                value={agent}
                onChange={setAgent}
                options={[
                  { value: "*", label: "All bots (*)" },
                  { value: "Googlebot", label: "Googlebot only" },
                  { value: "Bingbot", label: "Bingbot only" },
                  { value: "GPTBot", label: "GPTBot (AI crawlers)" },
                ]}
              />
              <TextAreaField
                label="Paths to disallow (one per line)"
                value={disallow}
                onChange={setDisallow}
                rows={5}
                mono
              />
              <NumberField
                label="Crawl-delay (seconds, optional)"
                value={crawlDelay}
                onChange={setCrawlDelay}
                placeholder="e.g. 10"
              />
            </>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="seo-8" className="text-sm font-medium">Sitemap URL</Label>
            <Input id="seo-8" value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <OutputPanel
            value={out.trimEnd()}
            filename="robots.txt"
            mime="text/plain"
            ariaLabel="Generated robots.txt"
          />
          <Verdict tone={preset === "block-all" ? "bad" : "neutral"}>
            {preset === "block-all"
              ? "This configuration deindexes your whole site. Only use it on staging — remove it before launch."
              : "Upload as robots.txt at your domain root. Disallow hides pages from crawling but not from indexing — use a noindex meta tag to keep pages out of results."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 38. XML sitemap generator                                           */
/* ================================================================== */

export function XmlSitemapGenerator() {
  const [urls, setUrls] = React.useState(
    "https://yoursite.com/\nhttps://yoursite.com/pricing\nhttps://yoursite.com/blog/email-marketing-guide\nhttps://yoursite.com/tools/roas-calculator"
  );
  const [freq, setFreq] = React.useState("weekly");
  const [priority, setPriority] = React.useState("0.8");

  const today = new Date().toISOString().slice(0, 10);
  const list = urls
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const valid = list.filter((u) => /^https?:\/\/.+/i.test(u));
  const invalid = list.length - valid.length;

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    valid
      .map(
        (u) =>
          `  <url>\n    <loc>${u.replace(/&/g, "&amp;")}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>`;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="Page URLs (one per line)"
            value={urls}
            onChange={setUrls}
            rows={8}
            mono
            hint="Absolute URLs including https:// — up to 50,000 per sitemap."
          />
          <FieldGrid>
            <SelectField
              label="Default changefreq"
              value={freq}
              onChange={setFreq}
              options={["always", "hourly", "daily", "weekly", "monthly", "yearly"].map((f) => ({
                value: f,
                label: f,
              }))}
            />
            <SelectField
              label="Default priority"
              value={priority}
              onChange={setPriority}
              options={["1.0", "0.9", "0.8", "0.7", "0.5", "0.3"].map((p) => ({
                value: p,
                label: p,
              }))}
            />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <OutputPanel
            value={xml}
            filename="sitemap.xml"
            mime="application/xml"
            ariaLabel="Generated sitemap XML"
            downloadLabel="Download sitemap.xml"
          />
          <div>
            <StatRow label="URLs included" value={String(valid.length)} emphasis />
            <StatRow label="Lines skipped (invalid)" value={invalid > 0 ? String(invalid) : "0"} />
            <StatRow label="Lastmod date" value={today} />
          </div>
          <Verdict tone={invalid > 0 ? "warn" : "good"}>
            {invalid > 0
              ? invalid === 1
                ? "1 line skipped: sitemap URLs must start with http:// or https://."
                : `${invalid} lines skipped: sitemap URLs must start with http:// or https://.`
              : "Valid sitemap. Submit it in Google Search Console under Sitemaps — submission is how discovery starts."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 39. URL slug generator                                              */
/* ================================================================== */

export function UrlSlugGenerator() {
  const [titles, setTitles] = React.useState(
    "10 Proven Ways to Boost Your Email Open Rates in 2026\nCafé Racer: The Ultimate Buyer's Guide\nQ3 Earnings — What They Mean for Growth"
  );
  const [sep, setSep] = React.useState("-");
  const [stripStop, setStripStop] = React.useState(false);
  const [maxLen, setMaxLen] = React.useState("60");

  const sepRe = sep === "_" ? /[\s\-–—]+/g : /[\s_–—]+/g;

  const slugs = titles
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      let s = line
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/g, "")
        .split(sepRe)
        .filter(Boolean);
      if (stripStop) s = s.filter((w) => !STOPWORDS.has(w));
      let slug = s.join(sep);
      const limit = Math.max(10, Number(maxLen) || 60);
      if (slug.length > limit) {
        slug = slug.slice(0, limit);
        const cut = slug.lastIndexOf(sep);
        if (cut > limit * 0.5) slug = slug.slice(0, cut);
      }
      return slug;
    });

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="Titles (one per line)"
            value={titles}
            onChange={setTitles}
            rows={6}
            hint="Batch-friendly: paste a whole content calendar."
          />
          <FieldGrid>
            <SelectField
              label="Separator"
              value={sep}
              onChange={setSep}
              options={[
                { value: "-", label: "Hyphen - (recommended)" },
                { value: "_", label: "Underscore _" },
              ]}
            />
            <NumberField
              label="Max length (chars)"
              value={maxLen}
              onChange={setMaxLen}
              hint="Whole words are kept — no mid-word cuts."
            />
          </FieldGrid>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stripStop}
              onChange={(e) => setStripStop(e.target.checked)}
              className="h-4 w-4 accent-[var(--foreground)]"
            />
            Remove stop words (the, of, in…) — shorter, more keyword-dense slugs
          </label>
        </div>
      }
      results={
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Slugs
          </p>
          {slugs.map((s, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-3">
              <p className="break-all font-mono text-sm">{s || "—"}</p>
              <div className="mt-2 flex items-center gap-2">
                <CopyButton text={s} size="xs" label="Copy slug" />
                <span className="tnum text-xs text-muted-foreground">{s.length} chars</span>
              </div>
            </div>
          ))}
          <Verdict tone="neutral">
            Hyphens are Google&apos;s recommended word separator. Keep slugs short, lowercase and
            stable — changing a slug after indexing costs you the URL&apos;s history unless you add a
            redirect.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 40. Schema markup generator                                         */
/* ================================================================== */

type FaqRow = { q: string; a: string };

export function SchemaMarkupGenerator() {
  const [type, setType] = React.useState("Article");
  const [headline, setHeadline] = React.useState("Email Marketing: The Complete Guide");
  const [author, setAuthor] = React.useState("Jordan Ellis");
  const [datePublished, setDatePublished] = React.useState(new Date().toISOString().slice(0, 10));
  const [product, setProduct] = React.useState("Brightlist Studio Planner");
  const [price, setPrice] = React.useState("5.00");
  const [currency, setCurrency] = React.useState("USD");
  const [bizName, setBizName] = React.useState("Brightlist Studio");
  const [phone, setPhone] = React.useState("+1-555-0100");
  const [address, setAddress] = React.useState("220 Market St, San Francisco, CA 94103");
  const [faqs, setFaqs] = React.useState<FaqRow[]>([
    { q: "Is Utility Toolz free to use?", a: "Yes — every tool is free to use." },
    { q: "Do I need an account?", a: "No. Every tool runs instantly in your browser without signup." },
  ]);

  const setFaq = (i: number, patch: Partial<FaqRow>) =>
    setFaqs((rows) => rows.map((r, ri) => (ri === i ? { ...r, ...patch } : r)));

  let json = "";
  if (type === "Article") {
    json = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        author: { "@type": "Person", name: author },
        datePublished,
        dateModified: datePublished,
      },
      null,
      2
    );
  } else if (type === "Product") {
    json = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        },
      },
      null,
      2
    );
  } else if (type === "LocalBusiness") {
    json = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: bizName,
        telephone: phone,
        address: { "@type": "PostalAddress", streetAddress: address },
      },
      null,
      2
    );
  } else {
    json = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      null,
      2
    );
  }

  const snippet = `<script type="application/ld+json">\n${json}\n</script>`;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <SelectField
            label="Schema type"
            value={type}
            onChange={setType}
            options={[
              { value: "Article", label: "Article / Blog post" },
              { value: "Product", label: "Product" },
              { value: "FAQPage", label: "FAQ page" },
              { value: "LocalBusiness", label: "Local business" },
            ]}
          />
          {type === "Article" && (
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="seo-9" className="text-sm font-medium">Headline</Label>
                <Input id="seo-9" value={headline} onChange={(e) => setHeadline(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-10" className="text-sm font-medium">Author</Label>
                <Input id="seo-10" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-11" className="text-sm font-medium">Published date</Label>
                <Input id="seo-11" type="date" value={datePublished} onChange={(e) => setDatePublished(e.target.value)} />
              </div>
            </FieldGrid>
          )}
          {type === "Product" && (
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="seo-12" className="text-sm font-medium">Product name</Label>
                <Input id="seo-12" value={product} onChange={(e) => setProduct(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="seo-13" className="text-sm font-medium">Price</Label>
                  <Input id="seo-13" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seo-14" className="text-sm font-medium">Currency</Label>
                  <Input id="seo-14" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
              </div>
            </FieldGrid>
          )}
          {type === "LocalBusiness" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="seo-15" className="text-sm font-medium">Business name</Label>
                <Input id="seo-15" value={bizName} onChange={(e) => setBizName(e.target.value)} />
              </div>
              <FieldGrid>
                <div className="space-y-1.5">
                  <Label htmlFor="seo-16" className="text-sm font-medium">Phone</Label>
                  <Input id="seo-16" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seo-17" className="text-sm font-medium">Street address</Label>
                  <Input id="seo-17" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </FieldGrid>
            </div>
          )}
          {type === "FAQPage" && (
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Question {i + 1}
                    </p>
                    {faqs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 sm:h-7 px-2 text-muted-foreground"
                        onClick={() => setFaqs((rows) => rows.filter((_, ri) => ri !== i))}
                        aria-label={`Remove question ${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <Input
                    className="mb-2"
                    value={f.q}
                    onChange={(e) => setFaq(i, { q: e.target.value })}
                    placeholder="Question"
                  />
                  <Input
                    value={f.a}
                    onChange={(e) => setFaq(i, { a: e.target.value })}
                    placeholder="Answer"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setFaqs((rows) => [...rows, { q: "", a: "" }])}
              >
                <Plus className="h-4 w-4" /> Add question
              </Button>
            </div>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <OutputPanel
            value={snippet}
            filename={`schema-${type.toLowerCase()}.html`}
            mime="text/html"
            ariaLabel="Generated JSON-LD schema"
            downloadLabel="Download snippet"
          />
          <Verdict tone="neutral">
            Paste this inside the &lt;head&gt; or &lt;body&gt; of the page, then validate it with
            Google&apos;s Rich Results Test. Eligible types can win rich snippets — stars, FAQ
            dropdowns, prices — directly in search results.
          </Verdict>
        </div>
      }
    />
  );
}
