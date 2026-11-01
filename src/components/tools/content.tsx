"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  MiniTable,
  NumberField,
  SelectField,
  StatRow,
  TextAreaField,
  Verdict,
} from "./ui";
import { cn } from "@/lib/utils";
import { clamp, num } from "@/lib/format";

/* ================================================================== */
/* 41. Word counter                                                    */
/* ================================================================== */

function textStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || 1 : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n|\r\n\s*\r\n/).filter((p) => p.trim()).length : 0;
  return { words, chars, charsNoSpaces, sentences, paragraphs };
}

export function WordCounter() {
  const [text, setText] = React.useState("");

  const s = textStats(text);
  const readMin = s.words / 225;

  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z0-9']{3,}/g) ?? []) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const topWords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Input text
          </p>
          <TextAreaField
            ariaLabel="Text to analyse"
            value={text}
            onChange={setText}
            rows={14}
            placeholder="Start typing or paste text — every stat updates live…"
          />
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Live counts
          </p>
          <p className="tnum text-4xl font-bold tracking-tight">{s.words.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">words</p>
          <div className="mt-4">
            <StatRow label="Characters" value={s.chars.toLocaleString()} emphasis />
            <StatRow label="Characters (no spaces)" value={s.charsNoSpaces.toLocaleString()} />
            <StatRow label="Sentences" value={s.sentences.toLocaleString()} />
            <StatRow label="Paragraphs" value={s.paragraphs.toLocaleString()} />
            <StatRow
              label="Reading time"
              value={s.words ? `${Math.max(1, Math.round(readMin))} min` : "0 min"}
            />
            <StatRow label="Avg words / sentence" value={s.sentences ? Math.round(s.words / s.sentences).toLocaleString() : "—"} />
          </div>
          {topWords.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                Most used words
              </p>
              <MiniTable head={["Word", "Uses"]} rows={topWords.map(([w, c]) => [w, c])} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 42. Character counter                                               */
/* ================================================================== */

const PLATFORM_LIMITS: { name: string; limit: number }[] = [
  { name: "X / Twitter post", limit: 280 },
  { name: "Meta title tag", limit: 60 },
  { name: "Meta description", limit: 160 },
  { name: "SMS message", limit: 160 },
  { name: "Instagram caption", limit: 2200 },
  { name: "LinkedIn post", limit: 3000 },
  { name: "YouTube title", limit: 100 },
];

export function CharacterCounter() {
  const [text, setText] = React.useState("");

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Input text
          </p>
          <TextAreaField ariaLabel="Text to analyse" value={text} onChange={setText} rows={10} placeholder="Paste your post, title or caption…" />
          <p className="tnum mt-3 text-3xl font-bold">
            {text.length.toLocaleString()}
            <span className="ml-2 text-sm font-medium text-muted-foreground">characters</span>
          </p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Platform limits
          </p>
          <div className="space-y-3.5">
            {PLATFORM_LIMITS.map((p) => {
              const pct = Math.min(100, (text.length / p.limit) * 100);
              const over = text.length > p.limit;
              return (
                <div key={p.name}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className={cn("tnum text-xs", over ? "font-semibold text-deep-coral" : "text-muted-foreground")}>
                      {text.length}/{p.limit}
                      {over ? ` · ${text.length - p.limit} over` : ""}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all", over ? "bg-lf-coral" : pct > 90 ? "bg-lf-orange" : "bg-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 43. Reading time calculator                                         */
/* ================================================================== */

export function ReadingTimeCalculator() {
  const [text, setText] = React.useState("");
  const [wpm, setWpm] = React.useState("225");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const rate = num(wpm) || 225;
  const minutes = words / rate;

  const fmt = (mins: number) => {
    if (!isFinite(mins) || mins <= 0) return "—";
    const total = Math.round(mins * 60);
    if (total < 60) return `${total} sec`;
    const m = Math.floor(total / 60);
    const s = total % 60;
    return s ? `${m} min ${s} sec` : `${m} min`;
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="Source text"
            hint="Leave empty to use a manual word count below."
            value={text}
            onChange={setText}
            rows={8}
          />
          <p className="text-sm text-muted-foreground">
            Word count: <span className="tnum font-semibold text-foreground">{words.toLocaleString()}</span>{" "}
            — counted live from the text above.
          </p>
          <SelectField
            label="Reading speed"
            value={wpm}
            onChange={setWpm}
            options={[
              { value: "150", label: "150 wpm — slow, careful reader" },
              { value: "225", label: "225 wpm — average adult" },
              { value: "300", label: "300 wpm — fast reader" },
              { value: "160", label: "160 wpm — read aloud (podcast)" },
            ]}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <p className="tnum text-4xl font-bold tracking-tight">{fmt(minutes)}</p>
          <p className="text-sm text-muted-foreground">at {rate} words per minute</p>
          <div>
            <StatRow label="Word count" value={words.toLocaleString()} emphasis />
            <StatRow label="Slow reader (150 wpm)" value={fmt(words / 150)} />
            <StatRow label="Average (225 wpm)" value={fmt(words / 225)} />
            <StatRow label="Fast (300 wpm)" value={fmt(words / 300)} />
            <StatRow label="Read aloud (160 wpm)" value={fmt(words / 160)} />
          </div>
          <Verdict tone="neutral">
            Blog posts under 7 minutes of reading time get the most complete reads. If your draft
            runs past that, consider splitting it into a series — each part then ranks on its own
            keyword too.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 44. Text case converter                                             */
/* ================================================================== */

function toTitleCase(s: string): string {
  const minor = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in"]);
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => {
      if (i > 0 && minor.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

export function TextCaseConverter() {
  const [text, setText] = React.useState("the quick brown fox jumps over the lazy dog");

  const words = () => text.trim().split(/[\s_\-]+/).filter(Boolean);

  const cases: { label: string; value: string; hint: string }[] = [
    { label: "UPPERCASE", value: text.toUpperCase(), hint: "Headlines, acronyms" },
    { label: "lowercase", value: text.toLowerCase(), hint: "URLs, slugs" },
    { label: "Title Case", value: toTitleCase(text), hint: "Titles, headings" },
    {
      label: "Sentence case",
      value: text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
      hint: "Body copy, descriptions",
    },
    {
      label: "camelCase",
      value: words()
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
      hint: "JavaScript variables",
    },
    {
      label: "PascalCase",
      value: words()
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(""),
      hint: "Components, classes",
    },
    { label: "snake_case", value: words().map((w) => w.toLowerCase()).join("_"), hint: "Python, DB columns" },
    { label: "kebab-case", value: words().map((w) => w.toLowerCase()).join("-"), hint: "URLs, CSS classes" },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">
            Input text
          </p>
          <TextAreaField ariaLabel="Text to analyse" value={text} onChange={setText} rows={6} />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-3">
        {cases.map((c) => (
          <div key={c.label} className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-muted-foreground">{c.label}</p>
              <CopyButton text={c.value} size="xs" label="Copy" />
            </div>
            <p className="mt-1 break-words font-mono text-sm">{c.value || "—"}</p>
          </div>
        ))}
        <Verdict tone="neutral">
          Every format above updates live as you type — handy for wiring copy straight into code,
          CMS fields or URL slugs.
        </Verdict>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 45. Lorem Ipsum generator                                           */
/* ================================================================== */

const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

function sentence(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  const parts: string[] = [];
  for (let i = 0; i < len; i++) parts.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  const s = parts.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

export function LoremIpsumGenerator() {
  const [unit, setUnit] = React.useState("paragraphs");
  const [count, setCount] = React.useState("3");
  const [classicStart, setClassicStart] = React.useState(true);
  const [seed, setSeed] = React.useState(0);

  const n = clamp(Math.round(num(count) || 3), 1, 50);

  const output = React.useMemo(() => {
    void seed; // regenerate on demand
    if (unit === "words") {
      const out: string[] = [];
      while (out.length < n) out.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      let s = out.join(" ");
      if (classicStart) s = "Lorem ipsum dolor sit amet, " + s;
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    if (unit === "sentences") {
      const list: string[] = [];
      for (let i = 0; i < n; i++) list.push(sentence());
      if (classicStart && list.length) list[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + list[0];
      return list.join(" ");
    }
    const paras: string[] = [];
    for (let i = 0; i < n; i++) {
      const sc = 3 + Math.floor(Math.random() * 3);
      const list: string[] = [];
      for (let j = 0; j < sc; j++) list.push(sentence());
      if (i === 0 && classicStart)
        list[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + list[0];
      paras.push(list.join(" "));
    }
    return paras.join("\n\n");
  }, [unit, n, classicStart, seed]);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Unit"
              value={unit}
              onChange={setUnit}
              options={[
                { value: "paragraphs", label: "Paragraphs" },
                { value: "sentences", label: "Sentences" },
                { value: "words", label: "Words" },
              ]}
            />
            <NumberField label={`How many ${unit}`} value={String(n)} onChange={setCount} min={1} />
          </FieldGrid>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={classicStart}
              onChange={(e) => setClassicStart(e.target.checked)}
              className="h-4 w-4 accent-[#308f68]"
            />
            Start with the classic &ldquo;Lorem ipsum dolor sit amet…&rdquo;
          </label>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSeed((s) => s + 1)}>
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        </div>
      }
      results={
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              Placeholder text
            </p>
            <CopyButton text={output} />
          </div>
          <div
            role="region"
            aria-label="Generated lorem ipsum"
            className="max-h-80 overflow-auto rounded-lg bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap"
          >
            {output}
          </div>
          <p className="tnum text-xs text-muted-foreground">
            {output.split(/\s+/).filter(Boolean).length} words · {output.length.toLocaleString()} characters
          </p>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 46. Headline analyser                                               */
/* ================================================================== */

const POWER_WORDS = new Set(
  "free proven instantly secret essential complete ultimate best worst new now easy simple fast powerful effective guaranteed step-by-step surprisingly real critical hidden breakthrough effortless".split(
    " "
  )
);
const EMOTION_WORDS = new Set(
  "love hate fear brave win lose amazing terrible shocking surprising brilliant fails mistakes myth stop never always dangerous risk bold".split(
    " "
  )
);

export function HeadlineAnalyser() {
  const [headline, setHeadline] = React.useState("10 Proven Ways to Double Your Email Open Rates");

  const words = headline.trim() ? headline.trim().split(/\s+/) : [];
  const lower = headline.toLowerCase();
  const checks: { label: string; pass: boolean; note: string }[] = [
    {
      label: "Length: 40–70 characters",
      pass: headline.length >= 40 && headline.length <= 70,
      note: `${headline.length} chars — under 40 feels thin, over 70 gets truncated in SERPs and social cards.`,
    },
    {
      label: "6–12 words",
      pass: words.length >= 6 && words.length <= 12,
      note: `${words.length} words — the sweet spot for scanability and specificity.`,
    },
    {
      label: "Contains a number",
      pass: /\d/.test(headline),
      note: "Numbers set expectations and lift CTR — list posts regularly beat prose headlines.",
    },
    {
      label: "Power word present",
      pass: [...POWER_WORDS].some((w) => lower.includes(w)),
      note: "Power words (proven, free, complete…) add urgency and benefit.",
    },
    {
      label: "Emotional trigger present",
      pass: [...EMOTION_WORDS].some((w) => lower.includes(w)),
      note: "Emotion words make readers feel the stakes, not just see the topic.",
    },
    {
      label: "Not ALL CAPS",
      pass: headline !== headline.toUpperCase() || headline.length < 12,
      note: "Full caps reads as shouting and hurts trust.",
    },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="content-1" className="text-sm font-medium">Headline</Label>
            <Input id="content-1" value={headline} onChange={(e) => setHeadline(e.target.value)} className="text-base" />
          </div>
          <p className="text-xs text-muted-foreground">
            Paste one headline — or test variants A/B against each other by swapping them in.
          </p>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <p className={cn("tnum text-5xl font-bold tracking-tight", score >= 70 ? "text-primary" : score >= 40 ? "text-deep-orange" : "text-deep-coral")}>
              {score}
            </p>
            <p className="text-sm text-muted-foreground">/ 100 headline score</p>
          </div>
          <div className="space-y-2.5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    c.pass ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  )}
                  aria-label={c.pass ? "Requirement met" : "Improvement recommended"}
                >
                  {c.pass ? "✓" : "!"}
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">{c.label}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
          <Verdict tone={score >= 70 ? "good" : score >= 40 ? "warn" : "bad"}>
            {score >= 70
              ? "Strong headline. Test it against one variant — even great headlines usually lose to their own improved rewrite."
              : "Fix the flagged checks first: numbers, a power word and the 40–70 character band are the cheapest wins."}
          </Verdict>
        </div>
      }
    />
  );
}
