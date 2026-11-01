"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalcLayout,
  CopyButton,
  FieldGrid,
  MiniTable,
  NumberField,
  OutputPanel,
  ResultHero,
  SelectField,
  StatRow,
  TextAreaField,
  Verdict,
} from "./ui";
import { fmtNum, num } from "@/lib/format";

/* ================================================================== */
/* 71. GPA calculator                                                  */
/* ================================================================== */

const GRADE_SCALE: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0,
};

const GRADE_OPTIONS = Object.keys(GRADE_SCALE).map((g) => ({ value: g, label: g }));

interface GpaRow {
  id: number;
  grade: string;
  credits: string;
}

export function GpaCalculator() {
  const rowId = React.useRef(6);
  const [rows, setRows] = React.useState<GpaRow[]>([
    { id: 1, grade: "A", credits: "3" },
    { id: 2, grade: "B+", credits: "4" },
    { id: 3, grade: "B", credits: "3" },
    { id: 4, grade: "A-", credits: "2" },
    { id: 5, grade: "C+", credits: "3" },
  ]);

  const update = (id: number, patch: Partial<GpaRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  const addRow = () =>
    setRows((rs) => [...rs, { id: rowId.current++, grade: "B", credits: "3" }]);

  let credits = 0;
  let points = 0;
  for (const r of rows) {
    const c = num(r.credits, 0);
    const g = GRADE_SCALE[r.grade];
    if (c > 0 && g !== undefined) {
      credits += c;
      points += g * c;
    }
  }
  const gpa = credits > 0 ? points / credits : NaN;

  return (
    <CalcLayout
      inputs={
        <div className="space-y-3">
          <div className="hidden grid-cols-[1fr_110px_36px] gap-2 px-1 sm:grid">
            <p className="text-sm font-semibold text-muted-foreground">Course grade</p>
            <p className="text-sm font-semibold text-muted-foreground">Credits</p>
            <span />
          </div>
          {rows.map((r, idx) => (
            <div key={r.id} className="grid grid-cols-[1.4fr_1fr_44px] items-end gap-2 sm:grid-cols-[1.4fr_1fr_36px]">
              <SelectField ariaLabel={`Course ${idx + 1} grade`} value={r.grade} onChange={(v) => update(r.id, { grade: v })} options={GRADE_OPTIONS} />
              <NumberField ariaLabel={`Course ${idx + 1} credits`} value={r.credits} onChange={(v) => update(r.id, { credits: v })} placeholder="3" />
              <Button
                variant="outline"
                size="icon"
                className="mb-0.5 h-9 w-9 shrink-0"
                onClick={() => remove(r.id)}
                aria-label={`Remove course ${idx + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={addRow}>
            <Plus className="h-3.5 w-3.5" /> Add course
          </Button>
          <Verdict tone="neutral">
            Each row is one course: the letter grade you received (or expect) and its credit value. Rows
            with zero or blank credits are ignored.
          </Verdict>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero
            label="Grade point average"
            value={credits > 0 ? gpa.toFixed(2) : "—"}
            sub={`On the standard 4.0 letter scale`}
          />
          <div>
            <StatRow label="Credits counted" value={fmtNum(credits, 1)} />
            <StatRow label="Quality points earned" value={fmtNum(points, 1)} />
            <StatRow label="Letter band" value={gpa >= 3.7 ? "A− range" : gpa >= 3.0 ? "B range" : gpa >= 2.0 ? "C range" : "Below 2.0"} />
          </div>
          <Verdict tone={gpa >= 3.0 ? "good" : gpa >= 2.0 ? "warn" : "bad"}>
            {gpa >= 3.6
              ? "Honors territory — many graduate programs and merit scholarships draw the line here."
              : gpa >= 3.0
                ? "Solid standing above the common 3.0 requirement for internships and programs."
                : gpa >= 2.0
                  ? "Above most academic-probation lines, but below common 3.0 program cutoffs — target your two lowest courses first."
                  : "Under 2.0 is academic-probation territory at most schools. Retaking failed courses lifts GPA fastest."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 72. Grade calculator (final exam needed)                            */
/* ================================================================== */

export function GradeCalculator() {
  const [current, setCurrent] = React.useState("82");
  const [completedWeight, setCompletedWeight] = React.useState("60");
  const [target, setTarget] = React.useState("85");

  const cur = num(current, NaN);
  const cw = num(completedWeight, NaN);
  const fw = 100 - cw;
  const tgt = num(target, NaN);

  const needed =
    isFinite(cur) && isFinite(cw) && isFinite(tgt) && fw > 0
      ? (tgt - (cur * cw) / 100) / (fw / 100)
      : NaN;
  const maxGrade = isFinite(cur) && fw > 0 ? (cur * cw) / 100 + fw : NaN;

  const ladder = [90, 85, 80, 70].map((t) => ({
    target: t,
    score: isFinite(cur) && fw > 0 ? (t - (cur * cw) / 100) / (fw / 100) : NaN,
  }));

  const tone = !isFinite(needed) ? "neutral" : needed <= 100 ? "good" : "bad";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <NumberField
              label="Grade so far"
              value={current}
              onChange={setCurrent}
              suffix="%"
              hint="Your average on completed work"
            />
            <NumberField
              label="Weight of completed work"
              value={completedWeight}
              onChange={setCompletedWeight}
              suffix="%"
              hint={`Final then counts for ${isFinite(fw) ? fw : "?"}%`}
            />
          </FieldGrid>
          <NumberField label="Target course grade" value={target} onChange={setTarget} suffix="%" />
          <Verdict tone="neutral">
            Weights must add to 100: if coursework so far is 60% of the grade, the final is the remaining
            40%.
          </Verdict>
        </div>
      }
      results={
        !isFinite(needed) || fw <= 0 ? (
          <Verdict tone={fw <= 0 ? "bad" : "neutral"}>
            {fw <= 0
              ? "Completed work already weighs 100% — there is no final left to move the grade."
              : "Fill in your grade so far, the completed weight and your target."}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Score needed on the final"
              value={`${fmtNum(needed, 1)}%`}
              sub={`Final counts for ${fmtNum(fw, 0)}% of the course grade`}
            />
            <div>
              <StatRow label="Best possible course grade" value={`${fmtNum(maxGrade, 1)}%`} emphasis />
              <StatRow label="Current standing" value={`${fmtNum(cur, 1)}%`} />
            </div>
            <MiniTable
              head={["Course target", "Needed on final"]}
              rows={ladder.map((l) => [
                `${l.target}%`,
                !isFinite(l.score) ? "—" : `${fmtNum(l.score, 1)}%`,
              ])}
            />
            <Verdict tone={tone}>
              {needed < 0
                ? "Done — your target is already locked in even with a zero on the final."
                : needed <= 100
                  ? `${fmtNum(needed, 1)}% on the final gets you there. ${
                      maxGrade < 100 && needed > maxGrade - 10 ? "Tight but doable — every point of coursework still in play helps." : ""
                    }`
                  : `Out of reach: a perfect final tops out at ${fmtNum(maxGrade, 1)}%. Set the target you can defend and protect it.`}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 73. Percentage calculator                                           */
/* ================================================================== */

const PCT_MODES = [
  { value: "of", label: "X% of Y" },
  { value: "iswhat", label: "X is what % of Y" },
  { value: "change", label: "% change from X to Y" },
];

export function PercentageCalculator() {
  const [mode, setMode] = React.useState("of");
  const [a, setA] = React.useState("15");
  const [b, setB] = React.useState("240");

  const x = num(a, NaN);
  const y = num(b, NaN);

  let heroLabel = "";
  let heroValue = "";
  let formula = "";
  const extras: { label: string; value: string }[] = [];

  if (mode === "of") {
    const r = (x * y) / 100;
    heroLabel = `${fmtNum(x)}% of ${fmtNum(y)}`;
    heroValue = isFinite(r) ? fmtNum(r, Math.abs(r) < 100 && r % 1 !== 0 ? 2 : 0) : "—";
    formula = "percent × value ÷ 100";
    extras.push(
      { label: `${fmtNum(y)} increased by ${fmtNum(x)}%`, value: isFinite(r) ? fmtNum(y * (1 + x / 100), 2) : "—" },
      { label: `${fmtNum(y)} decreased by ${fmtNum(x)}%`, value: isFinite(r) ? fmtNum(y * (1 - x / 100), 2) : "—" }
    );
  } else if (mode === "iswhat") {
    const r = (x / y) * 100;
    heroLabel = `${fmtNum(x)} as a share of ${fmtNum(y)}`;
    heroValue = isFinite(r) ? `${fmtNum(r, 2)}%` : "—";
    formula = "part ÷ whole × 100";
    extras.push(
      { label: "Difference (whole − part)", value: isFinite(r) ? fmtNum(y - x, 2) : "—" },
      { label: "Part as a fraction of whole", value: isFinite(r) && y !== 0 ? fmtNum(x / y, 4) : "—" }
    );
  } else {
    const r = isFinite(x) && x !== 0 ? ((y - x) / Math.abs(x)) * 100 : NaN;
    heroLabel = `Change from ${fmtNum(x)} to ${fmtNum(y)}`;
    heroValue = isFinite(r) ? `${r > 0 ? "+" : ""}${fmtNum(r, 2)}%` : "—";
    formula = "(new − old) ÷ |old| × 100";
    extras.push(
      { label: "Multiplier", value: isFinite(r) && x !== 0 ? `${fmtNum(y / x, 3)}x` : "—" },
      {
        label: "Change to get back",
        value: isFinite(r) && y !== 0 ? `${fmtNum(((x - y) / Math.abs(y)) * 100, 2)}%` : "—",
      }
    );
  }

  const labelA = mode === "of" ? "Percent" : mode === "iswhat" ? "Part" : "Original value";
  const labelB = mode === "of" ? "Of value" : mode === "iswhat" ? "Whole" : "New value";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <SelectField label="What do you need?" value={mode} onChange={setMode} options={PCT_MODES} />
          <FieldGrid>
            <NumberField label={labelA} value={a} onChange={setA} suffix={mode === "of" ? "%" : undefined} />
            <NumberField label={labelB} value={b} onChange={setB} />
          </FieldGrid>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultHero label={heroLabel} value={heroValue} sub={`Formula: ${formula}`} />
          {extras.length > 0 && (
            <div>
              {extras.map((e) => (
                <StatRow key={e.label} label={e.label} value={e.value} />
              ))}
            </div>
          )}
          <Verdict tone="neutral">
            {mode === "change"
              ? "A +25% rise needs only −20% to undo: percentage changes are not symmetric, they divide by different bases."
              : "Percentages always divide by a base — when a stat surprises you, ask what the base was."}
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 74. Citation formatter (APA 7 / MLA 9)                              */
/* ================================================================== */

type CitationStyle = "apa" | "mla";
type SourceType = "website" | "book" | "journal";

interface PersonName {
  last: string;
  first: string;
  middle: string;
}

function parsePerson(raw: string): PersonName | null {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return null;
  if (s.includes(",")) {
    const [last = "", rest = ""] = s.split(",");
    const rParts = rest.trim().split(" ").filter(Boolean);
    return { last: last.trim(), first: rParts[0] ?? "", middle: rParts.slice(1).join(" ") };
  }
  const tokens = s.split(" ");
  if (tokens.length === 1) return { last: tokens[0], first: "", middle: "" };
  return { first: tokens[0], middle: tokens.slice(1, -1).join(" "), last: tokens[tokens.length - 1] };
}

const initials = (p: PersonName): string =>
  [p.first, p.middle]
    .filter(Boolean)
    .map((w) => `${w[0].toUpperCase()}.`)
    .join(" ");

const MLA_MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

function mlaAccessed(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return `Accessed ${+m[3]} ${MLA_MONTHS[+m[2] - 1]} ${m[1]}.`;
}

export function CitationFormatter() {
  const [style, setStyle] = React.useState<CitationStyle>("apa");
  const [sourceType, setSourceType] = React.useState<SourceType>("journal");
  const [authorsRaw, setAuthorsRaw] = React.useState("Ada Lovelace\nAlan M. Turing");
  const [title, setTitle] = React.useState("Designing the Analytical Engine");
  const [container, setContainer] = React.useState("The Babbage Review");
  const [publisher, setPublisher] = React.useState("");
  const [year, setYear] = React.useState("2025");
  const [volume, setVolume] = React.useState("12");
  const [issue, setIssue] = React.useState("3");
  const [pages, setPages] = React.useState("44-61");
  const [url, setUrl] = React.useState("https://example.org/analytical-engine");
  const [accessed, setAccessed] = React.useState("2026-10-31");

  const people = authorsRaw
    .split(/\r?\n/)
    .map((l) => parsePerson(l))
    .filter((p): p is PersonName => p !== null && p.last !== "");

  const hasYear = year.trim() !== "";

  /* Authors block */
  const apaName = (p: PersonName): string => {
    const ini = initials(p);
    return ini ? `${p.last}, ${ini}` : p.last;
  };
  let authorsApa = "";
  if (people.length === 1) authorsApa = apaName(people[0]);
  else if (people.length === 2)
    authorsApa = `${apaName(people[0])}, & ${apaName(people[1])}`;
  else if (people.length > 2) {
    const heads = people.slice(0, -1).map(apaName);
    authorsApa = `${heads.join(", ")}, & ${apaName(people[people.length - 1])}`;
  }

  let authorsMla = "";
  if (people.length === 1) authorsMla = people[0].middle ? `${people[0].last}, ${people[0].first} ${people[0].middle}` : `${people[0].last}, ${people[0].first}`;
  else if (people.length === 2)
    authorsMla = `${authorsMlaOne(people[0])}, and ${mlaPlain(people[1])}`;
  else if (people.length > 2) authorsMla = `${authorsMlaOne(people[0])}, et al.`;

  function authorsMlaOne(p: PersonName): string {
    return p.middle ? `${p.last}, ${p.first} ${p.middle}` : `${p.last}, ${p.first}`;
  }
  function mlaPlain(p: PersonName): string {
    return [p.first, p.middle, p.last].filter(Boolean).join(" ");
  }

  const yApa = hasYear ? `(${year.trim()}).` : "(n.d.).";
  const vol = volume.trim();
  const iss = issue.trim();
  const pg = pages.trim().replace(/-/g, "–");
  const link = url.trim();

  let citation = "";
  let inText = "";

  if (style === "apa") {
    const head = authorsApa || title;
    if (sourceType === "journal") {
      const source = [container, vol ? `${vol}${iss ? `(${iss})` : ""}` : "", pg ? pg : ""].filter(Boolean).join(", ");
      citation = `${head} ${yApa} ${title}${head === title ? "." : ""} ${source}.${link ? ` ${link}` : ""}`;
    } else if (sourceType === "book") {
      citation = `${head} ${yApa} ${title}${head === title ? "." : ""}${publisher.trim() ? ` ${publisher.trim()}.` : ""}`;
    } else {
      citation = `${head} ${yApa} ${title}${head === title ? "." : ""}${container.trim() ? ` ${container.trim()}.` : ""}${link ? ` ${link}` : ""}`;
    }
    const firstLast = people.length ? people[0].last : "";
    inText =
      people.length === 0
        ? `("${title.slice(0, 40)}${title.length > 40 ? "…" : ""}," ${hasYear ? year.trim() : "n.d."})`
        : people.length === 1
          ? `(${firstLast}, ${hasYear ? year.trim() : "n.d."})`
          : people.length === 2
            ? `(${people[0].last} & ${people[1].last}, ${hasYear ? year.trim() : "n.d."})`
            : `(${people[0].last} et al., ${hasYear ? year.trim() : "n.d."})`;
  } else {
    const head = authorsMla || "";
    const quotedTitle = `“${title}.”`;
    if (sourceType === "journal") {
      const mid = [vol ? `vol. ${vol}` : "", iss ? `no. ${iss}` : "", hasYear ? year.trim() : "", pg ? `pp. ${pg}` : ""]
        .filter(Boolean)
        .join(", ");
      citation = `${head ? `${head} ` : ""}${quotedTitle} ${container.trim()}, ${mid}.${link ? ` ${link}.` : ""}`;
    } else if (sourceType === "book") {
      citation = `${head ? `${head} ` : ""}${title}. ${publisher.trim()}${publisher.trim() && hasYear ? "," : ""} ${hasYear ? year.trim() : "n.d."}.`;
    } else {
      const mid = [container.trim(), hasYear ? year.trim() : "", link].filter(Boolean).join(", ");
      citation = `${head ? `${head} ` : ""}${quotedTitle} ${mid}.${accessed.trim() ? ` ${mlaAccessed(accessed.trim())}` : ""}`;
    }
    const firstLast = people.length ? people[0].last : "";
    const pageBit = pg ? ` ${pg}` : "";
    inText =
      people.length === 0
        ? `("${title.slice(0, 40)}${title.length > 40 ? "…" : ""}"${pageBit})`
        : people.length === 1
          ? `(${firstLast}${pageBit})`
          : people.length === 2
            ? `(${people[0].last} and ${people[1].last}${pageBit})`
            : `(${people[0].last} et al.${pageBit})`;
  }

  const containerLabel =
    sourceType === "website" ? "Site / publisher name" : sourceType === "journal" ? "Journal name" : "Publisher";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <SelectField
              label="Style"
              value={style}
              onChange={(v) => setStyle(v as CitationStyle)}
              options={[
                { value: "apa", label: "APA 7th edition" },
                { value: "mla", label: "MLA 9th edition" },
              ]}
            />
            <SelectField
              label="Source type"
              value={sourceType}
              onChange={(v) => setSourceType(v as SourceType)}
              options={[
                { value: "journal", label: "Journal article" },
                { value: "book", label: "Book" },
                { value: "website", label: "Website page" },
              ]}
            />
          </FieldGrid>
          <TextAreaField
            label="Authors"
            value={authorsRaw}
            onChange={setAuthorsRaw}
            rows={2}
            hint="One per line — 'Ada Lovelace' or 'Lovelace, Ada'. Three or more becomes et al. in MLA."
          />
          <FieldGrid>
            <div className="space-y-1.5">
              <Label htmlFor="education-1" className="text-sm font-medium">Title</Label>
              <Input id="education-1" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            {sourceType !== "book" && (
              <div className="space-y-1.5">
                <Label htmlFor="education-2" className="text-sm font-medium">{containerLabel}</Label>
                <Input id="education-2" value={container} onChange={(e) => setContainer(e.target.value)} />
              </div>
            )}
          </FieldGrid>
          <FieldGrid>
            {sourceType === "book" ? (
              <div className="space-y-1.5">
                <Label htmlFor="education-3" className="text-sm font-medium">Publisher</Label>
                <Input id="education-3" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Charles Babbage Press" />
              </div>
            ) : (
              <>
                <NumberField label="Volume" value={volume} onChange={setVolume} placeholder="12" />
                <NumberField label="Issue" value={issue} onChange={setIssue} placeholder="3" />
              </>
            )}
          </FieldGrid>
          <FieldGrid>
            {sourceType !== "book" && (
              // A page range ("44-61") isn't a number, so it gets a plain text field.
              <div className="space-y-1.5">
                <Label htmlFor="education-6" className="text-sm font-medium">Pages</Label>
                <Input id="education-6" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="44-61" className="tnum" />
              </div>
            )}
            <NumberField label="Year" value={year} onChange={setYear} placeholder="2025" />
          </FieldGrid>
          {sourceType !== "book" && (
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="education-4" className="text-sm font-medium">URL</Label>
                <Input id="education-4" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              {style === "mla" && sourceType === "website" && (
                <div className="space-y-1.5">
                  <Label htmlFor="education-5" className="text-sm font-medium">Access date</Label>
                  <Input id="education-5" type="date" value={accessed} onChange={(e) => setAccessed(e.target.value)} className="tnum" />
                </div>
              )}
            </FieldGrid>
          )}
        </div>
      }
      results={
        <div className="space-y-4">
          <OutputPanel value={citation} ariaLabel="Formatted citation" />
          <div>
            <StatRow label="In-text citation" value={inText} emphasis />
            <StatRow label="Style" value={style === "apa" ? "APA 7" : "MLA 9"} />
            <StatRow label="Authors parsed" value={String(people.length)} />
          </div>
          <div className="flex gap-2">
            <CopyButton text={inText} label="Copy in-text" />
          </div>
          <Verdict tone="neutral">
            APA sentence-cases titles and omits authors&apos; first names; MLA keeps titles as written.
            Check the output against your citation guide — italics can&apos;t be marked in plain text here,
            so italicise the container in your document.
          </Verdict>
        </div>
      }
    />
  );
}
