"use client";

import * as React from "react";
import {
  CalcLayout,
  CopyButton,
  OutputPanel,
  StatRow,
  TextAreaField,
  Verdict,
} from "./ui";
import { FieldGrid, MiniTable, NumberField, SelectField } from "./ui";
import { downloadText } from "./ui";
import { fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import { clamp, num } from "@/lib/format";

/* ================================================================== */
/* 53. Percentage change calculator                                    */
/* ================================================================== */

export function PercentageChangeCalculator() {
  const [from, setFrom] = React.useState("12,500");
  const [to, setTo] = React.useState("18,400");

  const a = num(from);
  const b = num(to);

  const diff = b - a;
  const change = a !== 0 ? (diff / Math.abs(a)) * 100 : Infinity;
  const multiplier = a !== 0 ? b / a : Infinity;

  return (
    <CalcLayout inputFirst
      inputs={
        <FieldGrid>
          <NumberField label="From (original value)" value={from} onChange={setFrom} />
          <NumberField label="To (new value)" value={to} onChange={setTo} />
        </FieldGrid>
      }
      results={
        <div className="space-y-4">
          <div className="rounded-lg bg-highlight px-4 py-5 text-on-highlight">
            <p className="text-sm font-medium text-on-highlight">
              {diff >= 0 ? "Increase" : diff < 0 ? "Decrease" : "Change"}
            </p>
            <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {isFinite(change) ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` : "—"}
            </p>
            <p className="mt-1.5 text-sm text-on-highlight">
              {fmtNum(a)} → {fmtNum(b)} · {diff >= 0 ? "+" : "−"}
              {fmtNum(Math.abs(diff))} absolute
            </p>
          </div>
          <div>
            <StatRow label="Absolute difference" value={`${diff >= 0 ? "+" : "−"}${fmtNum(Math.abs(diff))}`} emphasis />
            <StatRow label="As a multiplier" value={isFinite(multiplier) ? `${multiplier.toFixed(3)}×` : "—"} />
            <StatRow
              label="Reverse check (drop back)"
              value={b !== 0 ? `${(-((b - a) / b) * 100).toFixed(2)}%` : "—"}
            />
          </div>
          <Verdict tone="neutral">
            The reverse check matters: a +25% gain needs only a −20% loss to undo, because the two
            percentages use different bases. Quote both directions when reporting.
          </Verdict>
        </div>
      }
    />
  );
}

/* ================================================================== */
/* CSV / format helpers shared by the conversion tools                 */
/* ================================================================== */

function splitCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delim) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCsv(text: string, delim: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((l, i, arr) => l.trim() !== "" || i < arr.length - 1)
    .filter((l) => l.trim() !== "")
    .map((l) => splitCsvLine(l, delim));
}

function csvEscape(v: string, delim: string): string {
  if (v.includes('"') || v.includes(delim) || /[\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

function toCsv(rows: (string | number)[][], delim: string): string {
  return rows.map((r) => r.map((c) => csvEscape(String(c), delim)).join(delim)).join("\n");
}

function sniffDelimiter(text: string): string {
  const first = text.split(/\r?\n/).find((l) => l.trim()) ?? "";
  const counts: Record<string, number> = {
    ",": (first.match(/,/g) ?? []).length,
    ";": (first.match(/;/g) ?? []).length,
    "\t": (first.match(/\t/g) ?? []).length,
    "|": (first.match(/\|/g) ?? []).length,
  };
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function flattenCell(v: unknown): string {
  if (v === null) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/* ================================================================== */
/* 54. Data format converter                                           */
/* ================================================================== */

type Row = Record<string, string>;

function csvToRows(text: string, delim: string): Row[] {
  const table = parseCsv(text, delim);
  if (table.length === 0) return [];
  const header = table[0].map((h, i) => h.trim() || `col${i + 1}`);
  return table.slice(1).map((cells) => {
    const row: Row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

function jsonToRows(text: string): Row[] {
  const data = JSON.parse(text);
  const arr: unknown[] = Array.isArray(data) ? data : [data];
  return arr.map((item) => {
    const row: Row = {};
    if (item !== null && typeof item === "object") {
      for (const [k, v] of Object.entries(item as Record<string, unknown>)) row[k] = flattenCell(v);
    } else {
      row.value = String(item);
    }
    return row;
  });
}

function rowsToNdjson(rows: Row[]): string {
  return rows.map((r) => JSON.stringify(r)).join("\n");
}

function rowsToTextTable(rows: Row[], delim: string): string {
  if (rows.length === 0) return "";
  const header = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  return toCsv([header, ...rows.map((r) => header.map((h) => r[h] ?? ""))], delim);
}

export function DataFormatConverter() {
  const [input, setInput] = React.useState(
    '[{"campaign":"Search","spend":4200,"revenue":18900},{"campaign":"Social","spend":1800,"revenue":5100}]'
  );
  const [target, setTarget] = React.useState("csv-comma");

  const delimMap: Record<string, string> = {
    "csv-comma": ",",
    "csv-semicolon": ";",
    tsv: "\t",
  };

  const detect = (() => {
    const t = input.trim();
    if (!t) return "empty";
    if (t.startsWith("{") || t.startsWith("[")) return "json";
    const d = sniffDelimiter(t);
    if (d === "\t") return "tsv";
    if (d === ";" || d === "|") return "csv";
    return "csv";
  })();

  let output = "";
  let error: string | null = null;
  let rowCount = 0;
  try {
    if (input.trim()) {
      let rows: Row[] = [];
      if (detect === "json") rows = jsonToRows(input);
      else rows = csvToRows(input, sniffDelimiter(input));

      rowCount = rows.length;
      if (target.startsWith("json")) {
        output = JSON.stringify(rows, null, 2);
      } else if (target === "ndjson") {
        output = rowsToNdjson(rows);
      } else {
        output = rowsToTextTable(rows, delimMap[target] ?? ",");
      }
    }
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "Unable to parse input. Ensure data is valid JSON or delimiter-separated text.";
  }

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="Input (JSON, CSV, TSV — auto-detected)"
            value={input}
            onChange={setInput}
            rows={9}
            mono
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Detected:{" "}
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium uppercase">{detect}</span>
          </div>
          <SelectField
            label="Convert to"
            value={target}
            onChange={setTarget}
            options={[
              { value: "csv-comma", label: "CSV (comma)" },
              { value: "csv-semicolon", label: "CSV (semicolon)" },
              { value: "tsv", label: "TSV (tab)" },
              { value: "json", label: "JSON array" },
              { value: "ndjson", label: "NDJSON (one JSON per line)" },
            ]}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          {error ? (
            <Verdict tone="bad">Parse error: {error}</Verdict>
          ) : (
            <>
              <OutputPanel
                value={output}
                filename={`converted.${target === "json" || target === "ndjson" ? "json" : target === "tsv" ? "tsv" : "csv"}`}
                mime={target.startsWith("csv") || target === "tsv" ? "text/csv" : "application/json"}
                ariaLabel="Converted output"
              />
              <div>
                <StatRow label="Rows converted" value={String(rowCount)} emphasis />
                <StatRow label="Nested objects" value="Serialised to JSON strings in cells" />
              </div>
              <Verdict tone="neutral">
                Nested objects survive as JSON strings so nothing is lost — flatten them upstream if
                the target system needs plain columns.
              </Verdict>
            </>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 55. CSV viewer                                                      */
/* ================================================================== */

export function CsvViewer() {
  const [text, setText] = React.useState(
    "date,channel,spend,orders\n2026-10-01,Search,1400,122\n2026-10-02,Social,980,84\n2026-10-03,Email,0,215\n2026-10-04,Search,1520,131"
  );
  const [delim, setDelim] = React.useState("auto");
  const [maxRows, setMaxRows] = React.useState("50");

  const d = delim === "auto" ? sniffDelimiter(text) : delim === "tab" ? "\t" : delim;
  const table = parseCsv(text, d);
  const header = table[0] ?? [];
  const rows = table.slice(1);
  const limit = clamp(Math.round(num(maxRows) || 50), 10, 500);
  const shown = rows.slice(0, limit);

  const numericCols = header.map((_, ci) => {
    const vals = rows.map((r) => r[ci]).filter((v) => v !== "" && isFinite(Number(v)));
    return rows.length > 0 && vals.length / rows.length > 0.8;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/40 p-4 sm:p-5">
        <FieldGrid cols={2}>
          <TextAreaField label="Paste CSV data" value={text} onChange={setText} rows={6} mono />
          <div className="space-y-4">
            <SelectField
              label="Delimiter"
              value={delim}
              onChange={setDelim}
              options={[
                { value: "auto", label: "Auto-detect" },
                { value: ",", label: "Comma" },
                { value: ";", label: "Semicolon" },
                { value: "tab", label: "Tab" },
                { value: "|", label: "Pipe |" },
              ]}
            />
            <NumberField
              label="Rows shown"
              value={maxRows}
              onChange={setMaxRows}
              hint={`Displaying ${shown.length} of ${rows.length} data rows.`}
            />
            <div>
              <p className="mb-1.5 text-sm font-medium">Column types</p>
              <div className="flex flex-wrap gap-1.5">
                {header.map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs",
                      numericCols[i]
                        ? "border-secondary bg-secondary/10 text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {h || `col${i + 1}`}: {numericCols[i] ? "numeric" : "text"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FieldGrid>
      </div>
      <div className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-wrap gap-4 text-sm">
          <span>
            <span className="tnum font-bold">{rows.length}</span> rows
          </span>
          <span>
            <span className="tnum font-bold">{header.length}</span> columns
          </span>
          <span className="text-muted-foreground">delimiter: {d === "\t" ? "tab" : `"${d}"`}</span>
        </div>
        <div className="max-h-96 overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                {header.map((h, i) => (
                  <th key={i} className="whitespace-nowrap px-3 py-2 text-left font-semibold">
                    {h || `col${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r, ri) => (
                <tr key={ri} className="border-t">
                  <td className="tnum px-3 py-1.5 text-muted-foreground">{ri + 1}</td>
                  {header.map((_, ci) => (
                    <td key={ci} className={cn("whitespace-nowrap px-3 py-1.5", numericCols[ci] && "tnum")}>
                      {r[ci] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 56. JSON to CSV converter                                           */
/* ================================================================== */

export function JsonToCsvConverter() {
  const [input, setInput] = React.useState(
    `[
  { "product": "Desk lamp", "units": 42, "revenue": 2814.0 },
  { "product": "Monitor arm", "units": 17, "revenue": 3059.0 },
  { "product": "Cable set", "units": 130, "revenue": 1298.7 }
]`
  );
  const [delim, setDelim] = React.useState(",");

  let csv = "";
  let error: string | null = null;
  let cols = 0;
  try {
    if (input.trim()) {
      const rows = jsonToRows(input);
      const header = [...new Set(rows.flatMap((r) => Object.keys(r)))];
      cols = header.length;
      csv = toCsv([header, ...rows.map((r) => header.map((h) => r[h] ?? ""))], delim);
    }
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "Unable to parse JSON. Check for missing brackets, quotes, or trailing commas.";
  }

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="JSON array (one object per row)"
            value={input}
            onChange={setInput}
            rows={9}
            mono
            hint="Nested objects and arrays are serialised into their cell as JSON text."
          />
          <SelectField
            label="Delimiter"
            value={delim}
            onChange={setDelim}
            options={[
              { value: ",", label: "Comma (standard CSV)" },
              { value: ";", label: "Semicolon (Excel EU)" },
              { value: "\t", label: "Tab (TSV)" },
            ]}
          />
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">Invalid JSON: {error}</Verdict>
        ) : (
          <div className="space-y-4">
            <OutputPanel
              value={csv}
              filename="data.csv"
              mime="text/csv"
              downloadLabel="Download CSV"
              ariaLabel="CSV output"
            />
            <div>
              <StatRow label="Rows" value={String(Math.max(0, csv.split("\n").length - 1))} emphasis />
              <StatRow label="Columns" value={String(cols)} />
            </div>
            <Verdict tone="neutral">
              Open the semicolon variant directly in European Excel locales — comma CSVs land
              everything in one column there.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* 57. Average calculator                                              */
/* ================================================================== */

function parseNumbers(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => isFinite(n));
}

export function AverageCalculator() {
  const [text, setText] = React.useState("82 91 78 85 94 88 79 95 84 90");

  const nums = parseNumbers(text);
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = nums.length ? sum / nums.length : 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const median = nums.length
    ? nums.length % 2
      ? sorted[(nums.length - 1) / 2]
      : (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2
    : 0;
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const maxFreq = Math.max(0, ...freq.values());
  const modes = maxFreq > 1 ? [...freq.entries()].filter(([, c]) => c === maxFreq).map(([v]) => v) : [];

  return (
    <CalcLayout inputFirst
      inputs={
        <TextAreaField
          label="Numbers (separated by spaces, commas or new lines)"
          value={text}
          onChange={setText}
          rows={6}
          mono
          placeholder="e.g. 82 91 78 85 94"
        />
      }
      results={
        <div className="space-y-4">
          <div className="rounded-lg bg-highlight px-4 py-5 text-on-highlight">
            <p className="text-sm font-medium text-on-highlight">Average (mean)</p>
            <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{fmtNum(mean, 2)}</p>
            <p className="mt-1.5 text-sm text-on-highlight">{nums.length} values summed to {fmtNum(sum, 2)}</p>
          </div>
          <div>
            <StatRow label="Median (middle value)" value={nums.length ? fmtNum(median, 2) : "—"} emphasis />
            <StatRow
              label="Mode (most frequent)"
              value={modes.length ? modes.map((m) => fmtNum(m)).join(", ") : "none"}
            />
            <StatRow label="Range (min → max)" value={nums.length ? `${fmtNum(sorted[0])} → ${fmtNum(sorted[sorted.length - 1])}` : "—"} />
            <StatRow label="Sum" value={fmtNum(sum, 2)} />
          </div>
          {nums.length > 0 && (
            <Verdict tone={Math.abs(mean - median) / Math.max(1, Math.abs(median)) > 0.2 ? "warn" : "good"}>
              {Math.abs(mean - median) / Math.max(1, Math.abs(median)) > 0.2
                ? `Mean (${fmtNum(mean, 1)}) and median (${fmtNum(median, 1)}) diverge — outliers are pulling the average. Report the median for skewed data.`
                : "Mean and median agree closely — the data is symmetric enough to trust the average."}
            </Verdict>
          )}
        </div>
      }
    />
  );
}

/* ================================================================== */
/* 58. Standard deviation calculator                                   */
/* ================================================================== */

export function StandardDeviationCalculator() {
  const [text, setText] = React.useState("12.8 13.1 12.6 13.4 12.9 13.0 12.7 13.2");
  const [type, setType] = React.useState("sample");

  const nums = parseNumbers(text);
  const n = nums.length;
  const mean = n ? nums.reduce((a, b) => a + b, 0) / n : 0;
  const divisor = type === "sample" ? Math.max(1, n - 1) : Math.max(1, n);
  const variance = n > (type === "sample" ? 1 : 0)
    ? nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / divisor
    : 0;
  const sd = Math.sqrt(variance);
  const cv = mean !== 0 ? (sd / mean) * 100 : 0;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <TextAreaField
            label="Data set (spaces, commas or new lines)"
            value={text}
            onChange={setText}
            rows={5}
            mono
          />
          <SelectField
            label="Data type"
            value={type}
            onChange={setType}
            options={[
              { value: "sample", label: "Sample — a subset (divide by n−1)" },
              { value: "population", label: "Population — everything (divide by n)" },
            ]}
          />
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="rounded-lg bg-highlight px-4 py-5 text-on-highlight">
            <p className="text-sm font-medium text-on-highlight">
              Standard deviation
            </p>
            <p className="tnum mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{fmtNum(sd, 4)}</p>
            <p className="mt-1.5 text-sm text-on-highlight">
              mean {fmtNum(mean, 3)} across {n} values
            </p>
          </div>
          <div>
            <StatRow label="Variance" value={fmtNum(variance, 4)} emphasis />
            <StatRow label="Mean" value={fmtNum(mean, 4)} />
            <StatRow
              label={type === "sample" ? "n − 1 used" : "n used"}
              value={String(divisor)}
            />
            <StatRow label="Coefficient of variation" value={cv !== 0 ? `${cv.toFixed(1)}%` : "—"} />
          </div>
          <Verdict tone={n < (type === "sample" ? 2 : 1) ? "bad" : cv > 30 ? "warn" : "good"}>
            {n < (type === "sample" ? 2 : 1)
              ? "A sample needs at least 2 values for a standard deviation."
              : cv > 30
                ? `Spread is ${cv.toFixed(0)}% of the mean — high variability. Averages alone will mislead here; look at the distribution.`
                : `Spread is ${cv.toFixed(0)}% of the mean — tight enough for the average to be meaningful. Roughly two-thirds of values fall within mean ± ${fmtNum(sd, 2)}.`}
          </Verdict>
        </div>
      }
    />
  );
}
