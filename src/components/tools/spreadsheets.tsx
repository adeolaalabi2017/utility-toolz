"use client";

import * as React from "react";
import { Download } from "lucide-react";
import type { WorkBook } from "xlsx";
import { Button } from "@/components/ui/button";
import { CalcLayout, FieldGrid, OutputPanel, ResultHero, SelectField, TextField, Verdict, downloadBlob } from "./ui";
import { FileDropZone, FileList, nextFileKey } from "./file-drop";
import { bytesToBlob, fmtBytes, writeArchive } from "@/lib/archive";
import {
  DELIMITERS,
  fitText,
  inferCell,
  layoutTable,
  parseCsv,
  sheetFileName,
  sniffDelimiter,
  toCsv,
  toWinAnsi,
  withBom,
} from "@/lib/spreadsheet";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

// SheetJS is large, so it loads when the first file is opened.
const loadXlsx = () => import("xlsx");

/** Spreadsheets expand many times over in memory once parsed, so the cap is lower than for archives. */
const MAX_SHEET_BYTES = 50 * 1024 * 1024;
const SHEET_ACCEPT = ".xlsx,.xlsm,.xls,.ods,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const baseName = (name: string) => name.replace(/\.(xlsx|xlsm|xls|ods|csv)$/i, "") || "spreadsheet";
const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

function sheetError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/password|encrypt/i.test(msg)) return "This workbook is password-protected. Save an unprotected copy in Excel first.";
  return "That file couldn't be read as a spreadsheet. It may be damaged or a different kind of file.";
}

/** One opened workbook, shared by the Excel-to-something tools. */
function useWorkbook() {
  const [file, setFile] = React.useState<File | null>(null);
  const [wb, setWb] = React.useState<WorkBook | null>(null);
  const [sheet, setSheet] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const open = async (files: File[]) => {
    const f = files[0];
    setFile(null);
    setWb(null);
    setError("");
    if (f.size > MAX_SHEET_BYTES) {
      setError(`That's ${fmtBytes(f.size)}. Spreadsheets up to ${fmtBytes(MAX_SHEET_BYTES)} can be converted in the browser.`);
      return;
    }
    setBusy(true);
    try {
      const XLSX = await loadXlsx();
      const book = XLSX.read(new Uint8Array(await f.arrayBuffer()), { type: "array", cellDates: true, dense: true });
      setFile(f);
      setWb(book);
      setSheet(book.SheetNames[0] ?? "");
    } catch (e) {
      setError(sheetError(e));
    } finally {
      setBusy(false);
    }
  };
  return { file, wb, sheet, setSheet, error, busy, open };
}

/** A sheet's rows as the text Excel displays, so dates and currency keep their formatting. */
async function shownRows(wb: WorkBook, sheet: string): Promise<string[][]> {
  const XLSX = await loadXlsx();
  return XLSX.utils.sheet_to_json<string[]>(wb.Sheets[sheet], { header: 1, raw: false, defval: "", blankrows: false });
}

function useShownRows(wb: WorkBook | null, sheet: string) {
  const [rows, setRows] = React.useState<string[][] | null>(null);
  React.useEffect(() => {
    let live = true;
    if (wb && sheet) shownRows(wb, sheet).then((r) => live && setRows(r));
    return () => {
      live = false;
      setRows(null);
    };
  }, [wb, sheet]);
  return rows;
}

const PREVIEW_ROWS = 8;
const PREVIEW_COLS = 8;

function SheetPreview({ rows, label = "Preview" }: { rows: string[][]; label?: string }) {
  const cols = Math.max(0, ...rows.map((r) => r.length));
  const shown = rows.slice(0, PREVIEW_ROWS);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">
        {label} <span className="font-normal text-muted-foreground">· {plural(rows.length, "row")} × {plural(cols, "column")}</span>
      </p>
      <div className="max-h-72 overflow-auto rounded-lg border">
        <table className="w-full text-xs">
          <tbody>
            {shown.map((r, i) => (
              <tr key={i} className={i === 0 ? "bg-muted font-medium" : "border-t border-border/60"}>
                {Array.from({ length: Math.min(cols, PREVIEW_COLS) }, (_, c) => (
                  <td key={c} className="max-w-40 truncate px-2 py-1.5 tnum">
                    {r[c] ?? ""}
                  </td>
                ))}
                {cols > PREVIEW_COLS && <td className="px-2 py-1.5 text-muted-foreground">…</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(rows.length > PREVIEW_ROWS || cols > PREVIEW_COLS) && (
        <p className="text-xs text-muted-foreground">The preview shows the top-left corner. The download has everything.</p>
      )}
    </div>
  );
}

function SheetPicker({ wb, sheet, onChange, extra }: { wb: WorkBook; sheet: string; onChange: (s: string) => void; extra?: { value: string; label: string } }) {
  if (wb.SheetNames.length < 2) return null;
  return (
    <SelectField
      label="Sheet"
      value={sheet}
      onChange={onChange}
      options={[...wb.SheetNames.map((n) => ({ value: n, label: n })), ...(extra ? [extra] : [])]}
    />
  );
}

/* ================================================================== */
/* Excel to CSV                                                        */
/* ================================================================== */

const ALL_SHEETS = "\u0000all";

export function ExcelToCsv() {
  const { file, wb, sheet, setSheet, error, busy, open } = useWorkbook();
  const [delimiter, setDelimiter] = React.useState(",");
  const [bom, setBom] = React.useState("yes");
  const all = sheet === ALL_SHEETS;
  const rows = useShownRows(wb, all ? (wb?.SheetNames[0] ?? "") : sheet);

  const encode = (r: string[][]) => {
    const csv = toCsv(r, delimiter);
    return bom === "yes" ? withBom(csv) : csv;
  };
  const ext = delimiter === "\t" ? "tsv" : "csv";

  const download = async () => {
    if (!file || !wb) return;
    if (!all) {
      downloadBlob(`${baseName(file.name)}${wb.SheetNames.length > 1 ? `-${sheetFileName(sheet)}` : ""}.${ext}`, new Blob([encode(rows ?? [])], { type: "text/csv;charset=utf-8" }));
      return;
    }
    const enc = new TextEncoder();
    const entries = await Promise.all(
      wb.SheetNames.map(async (n) => ({ name: `${sheetFileName(n)}.${ext}`, data: enc.encode(encode(await shownRows(wb, n))) }))
    );
    downloadBlob(`${baseName(file.name)}-csv.zip`, bytesToBlob(writeArchive(entries, "zip"), "application/zip"));
  };

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <FileDropZone accept={SHEET_ACCEPT} onFiles={open} title={file ? file.name : "Open an Excel or ODS spreadsheet"} />
          {wb && (
            <SheetPicker wb={wb} sheet={sheet} onChange={setSheet} extra={{ value: ALL_SHEETS, label: `Every sheet (${wb.SheetNames.length} files in a ZIP)` }} />
          )}
          <FieldGrid>
            <SelectField label="Separator" value={delimiter} onChange={setDelimiter} options={DELIMITERS} />
            <SelectField
              label="Encoding"
              value={bom}
              onChange={setBom}
              options={[
                { value: "yes", label: "UTF-8 for Excel (with BOM)" },
                { value: "no", label: "Plain UTF-8 (no BOM)" },
              ]}
            />
          </FieldGrid>
          {rows && <SheetPreview rows={rows} label={all ? `Preview of ${wb!.SheetNames[0]}` : "Preview"} />}
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Opening the spreadsheet…</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !wb || !rows ? (
          <Verdict tone="neutral">Open an .xlsx, .xls or .ods file to save a sheet as CSV.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={all ? "CSV files" : "Rows"}
              value={all ? String(wb.SheetNames.length) : rows.length.toLocaleString("en-US")}
              sub={all ? "One per sheet, in a ZIP" : `From the ${sheet} sheet`}
            />
            <Button type="button" className="w-full gap-2" onClick={download}>
              <Download className="h-4 w-4" aria-hidden /> {all ? "Download ZIP" : `Download .${ext}`}
            </Button>
            <Verdict tone="neutral">
              Values are saved as Excel displays them, so dates and currency keep their format. Formulas become their
              results. {delimiter === "," ? "In countries that write decimals with a comma, choose Semicolon so Excel splits the columns." : ""}
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* CSV to Excel                                                        */
/* ================================================================== */

interface CsvItem {
  key: string;
  name: string;
  size: number;
  rows: string[][];
  delimiter: string;
}

/** Excel sheet names: 31 characters, none of []:*?/\, unique within the workbook. */
function sheetName(raw: string, taken: Set<string>): string {
  const clean = raw.replace(/[[\]:*?/\\]/g, "-").slice(0, 31).trim() || "Sheet";
  let name = clean;
  for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${clean.slice(0, 31 - String(n).length - 1)}-${n}`;
  taken.add(name.toLowerCase());
  return name;
}

export function CsvToExcel() {
  const [items, setItems] = React.useState<CsvItem[]>([]);
  const [separator, setSeparator] = React.useState("auto");
  const [types, setTypes] = React.useState("detect");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [made, setMade] = React.useState("");
  const texts = React.useRef(new Map<string, string>());

  // Re-parse when the separator setting changes.
  const parse = (key: string, sep: string) => {
    const text = texts.current.get(key) ?? "";
    const d = sep === "auto" ? sniffDelimiter(text) : sep;
    return { rows: parseCsv(text, d), delimiter: d };
  };
  const add = async (files: File[]) => {
    setMade("");
    setError("");
    const tooBig = files.find((f) => f.size > MAX_SHEET_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is ${fmtBytes(tooBig.size)}. CSV files up to ${fmtBytes(MAX_SHEET_BYTES)} can be converted in the browser.`);
      return;
    }
    const added = await Promise.all(
      files.map(async (f) => {
        const key = nextFileKey();
        texts.current.set(key, await f.text());
        return { key, name: f.name, size: f.size, ...parse(key, separator) };
      })
    );
    setItems((prev) => [...prev, ...added]);
    if (!name && added[0]) setName(baseName(added[0].name));
  };
  const changeSeparator = (sep: string) => {
    setSeparator(sep);
    setMade("");
    setItems((prev) => prev.map((it) => ({ ...it, ...parse(it.key, sep) })));
  };

  const fileName = `${(name.trim() || "spreadsheet").replace(/[\\/:*?"<>|]+/g, "-")}.xlsx`;
  const totalRows = items.reduce((n, it) => n + it.rows.length, 0);

  const create = async () => {
    try {
      const XLSX = await loadXlsx();
      const book = XLSX.utils.book_new();
      const taken = new Set<string>();
      for (const it of items) {
        const data = it.rows.map((r) => r.map((v) => inferCell(v, types === "text")));
        // Strings stay strings: "=..." is stored as text, never as a live formula.
        const ws = XLSX.utils.aoa_to_sheet(data);
        const cols = Math.max(0, ...it.rows.slice(0, 500).map((r) => r.length));
        ws["!cols"] = Array.from({ length: cols }, (_, c) => ({
          wch: Math.min(50, Math.max(8, ...it.rows.slice(0, 500).map((r) => (r[c] ?? "").length + 1))),
        }));
        XLSX.utils.book_append_sheet(book, ws, sheetName(baseName(it.name), taken));
      }
      const out: ArrayBuffer = XLSX.write(book, { type: "array", bookType: "xlsx", compression: true });
      downloadBlob(fileName, new Blob([out], { type: XLSX_MIME }));
      setMade(fileName);
    } catch {
      setError("The workbook couldn't be created from these files.");
    }
  };

  const delimLabel = (d: string) => DELIMITERS.find((x) => x.value === d)?.label.split(" ")[0].toLowerCase() ?? d;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <FileDropZone multiple accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values" onFiles={add} title="Add CSV files" hint="Each file becomes its own sheet. Nothing is uploaded." />
          {items.length > 0 && (
            <FileList
              items={items}
              onChange={(next) => {
                setItems(next);
                setMade("");
              }}
              detail={(it) => `${plural(it.rows.length, "row")}, ${delimLabel(it.delimiter)}-separated`}
              label="CSV files in sheet order"
            />
          )}
          <FieldGrid>
            <SelectField
              label="Separator"
              value={separator}
              onChange={changeSeparator}
              options={[{ value: "auto", label: "Detect automatically" }, ...DELIMITERS]}
            />
            <SelectField
              label="Numbers"
              value={types}
              onChange={(v) => {
                setTypes(v);
                setMade("");
              }}
              options={[
                { value: "detect", label: "Store as numbers" },
                { value: "text", label: "Keep everything as text" },
              ]}
            />
          </FieldGrid>
          <TextField label="Workbook name" value={name} onChange={setName} placeholder="spreadsheet" />
          {items[0] && <SheetPreview rows={items[0].rows} label={`Preview of ${items[0].name}`} />}
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : items.length === 0 ? (
          <Verdict tone="neutral">Add one or more CSV files to turn them into a single Excel workbook.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={items.length === 1 ? "Rows" : "Sheets"}
              value={items.length === 1 ? totalRows.toLocaleString("en-US") : String(items.length)}
              sub={made ? `${made} downloaded` : items.length === 1 ? "In one sheet" : `${plural(totalRows, "row")} in total`}
            />
            <Button type="button" className="w-full gap-2" onClick={create}>
              <Download className="h-4 w-4" aria-hidden /> Create {fileName}
            </Button>
            <Verdict tone="neutral">
              Codes with leading zeros, such as ZIP codes, and numbers longer than 15 digits are always kept as text, so
              Excel can&apos;t strip or round them.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Excel to JSON                                                       */
/* ================================================================== */

/** The JSON panel holds this much; the download always has everything. */
const MAX_SHOWN_JSON = 200_000;

export function ExcelToJson() {
  const { file, wb, sheet, setSheet, error, busy, open } = useWorkbook();
  const [shape, setShape] = React.useState("objects");
  const [values, setValues] = React.useState("typed");
  const [json, setJson] = React.useState("");

  React.useEffect(() => {
    let live = true;
    if (!wb || !sheet) return;
    loadXlsx().then((XLSX) => {
      const ws = wb.Sheets[sheet];
      const raw = values === "typed";
      const data =
        shape === "objects"
          ? XLSX.utils.sheet_to_json(ws, { raw, defval: null, blankrows: false })
          : XLSX.utils.sheet_to_json(ws, { header: 1, raw, defval: null, blankrows: false });
      if (live) setJson(JSON.stringify(data, null, 2));
    });
    return () => {
      live = false;
    };
  }, [wb, sheet, shape, values]);

  const count = React.useMemo(() => {
    try {
      return json ? (JSON.parse(json) as unknown[]).length : 0;
    } catch {
      return 0;
    }
  }, [json]);
  const shown = json.length > MAX_SHOWN_JSON ? `${json.slice(0, MAX_SHOWN_JSON)}\n…` : json;

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <FileDropZone accept={SHEET_ACCEPT} onFiles={(f) => { setJson(""); open(f); }} title={file ? file.name : "Open an Excel, ODS or CSV file"} />
          {wb && <SheetPicker wb={wb} sheet={sheet} onChange={setSheet} />}
          <FieldGrid>
            <SelectField
              label="Shape"
              value={shape}
              onChange={setShape}
              options={[
                { value: "objects", label: "Objects (first row as keys)" },
                { value: "arrays", label: "Arrays (row by row)" },
              ]}
            />
            <SelectField
              label="Values"
              value={values}
              onChange={setValues}
              options={[
                { value: "typed", label: "Numbers, booleans and dates" },
                { value: "shown", label: "Text as Excel shows it" },
              ]}
            />
          </FieldGrid>
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Opening the spreadsheet…</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !wb || !json ? (
          <Verdict tone="neutral">Open a spreadsheet to turn a sheet into JSON.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label={shape === "objects" ? "Records" : "Rows"} value={count.toLocaleString("en-US")} sub={`${fmtBytes(new Blob([json]).size)} of JSON`} />
            <OutputPanel value={shown} filename={`${baseName(file!.name)}${wb.SheetNames.length > 1 ? `-${sheetFileName(sheet)}` : ""}.json`} mime="application/json" ariaLabel="JSON output" />
            {json.length > MAX_SHOWN_JSON && (
              <Verdict tone="neutral">The panel shows the first 200 KB. Copy and download include everything.</Verdict>
            )}
            <Verdict tone="neutral">Dates come out as ISO 8601 text in UTC, such as 2026-03-01T00:00:00.000Z. Empty cells become null.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Excel to PDF                                                        */
/* ================================================================== */

const PAPER: Record<string, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };
const MAX_PDF_ROWS = 20_000;
const NUMERIC = /^[-+(]?[$€£¥]?\s?[\d.,]+%?\)?$/;

export function ExcelToPdf() {
  const { file, wb, sheet, setSheet, error, busy, open } = useWorkbook();
  const [paper, setPaper] = React.useState("a4");
  const [orientation, setOrientation] = React.useState("landscape");
  const [fontSize, setFontSize] = React.useState("9");
  const [header, setHeader] = React.useState("yes");
  const [made, setMade] = React.useState<{ file: string; pages: number; replaced: number } | null>(null);
  const [working, setWorking] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const rows = useShownRows(wb, sheet);
  const tooMany = rows && rows.length > MAX_PDF_ROWS;

  const create = async () => {
    if (!file || !rows) return;
    setWorking(true);
    setFailed(false);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const size = Number(fontSize);
      const [pw, ph] = orientation === "landscape" ? [PAPER[paper][1], PAPER[paper][0]] : PAPER[paper];
      const margin = 36;
      const footer = 18;

      let replaced = 0;
      const safe = rows.map((r) =>
        r.map((c) => {
          const w = toWinAnsi(c);
          replaced += w.replaced;
          return w.text;
        })
      );
      const hasHeader = header === "yes";
      const measure = (t: string) => font.widthOfTextAtSize(t, size);
      const layout = layoutTable(safe, {
        measure,
        measureHeader: (t) => bold.widthOfTextAtSize(t, size),
        width: pw - 2 * margin,
        height: ph - 2 * margin - footer,
        fontSize: size,
        header: hasHeader,
      });
      const pad = 4;
      const line = rgb(0.8, 0.8, 0.8);
      // A column whose filled cells are mostly numbers is right-aligned, header included.
      const body = safe.slice(hasHeader ? 1 : 0, 2000);
      const numericCol = layout.colWidths.map((_, c) => {
        const filled = body.map((r) => (r[c] ?? "").trim()).filter(Boolean);
        return filled.length > 0 && filled.filter((v) => NUMERIC.test(v)).length / filled.length >= 0.8;
      });
      const sheetLabel = wb!.SheetNames.length > 1 ? `${toWinAnsi(sheet).text} · ` : "";

      layout.pages.forEach((pageRows, p) => {
        const page = doc.addPage([pw, ph]);
        let y = ph - margin;
        const drawRow = (cells: string[], isHeader: boolean) => {
          const top = y;
          y -= layout.rowHeight;
          if (isHeader) {
            const width = layout.colWidths.reduce((a, b) => a + b, 0);
            page.drawRectangle({ x: margin, y, width, height: layout.rowHeight, color: rgb(0.93, 0.93, 0.93) });
          }
          let x = margin;
          layout.colWidths.forEach((w, c) => {
            const text = fitText(cells[c] ?? "", w - pad * 2, (t) => (isHeader ? bold : font).widthOfTextAtSize(t, size));
            const tw = (isHeader ? bold : font).widthOfTextAtSize(text, size);
            const right = numericCol[c];
            page.drawText(text, {
              x: right ? x + w - pad - tw : x + pad,
              y: y + (layout.rowHeight - size) / 2 + size * 0.22,
              size,
              font: isHeader ? bold : font,
              color: rgb(0.1, 0.1, 0.1),
            });
            x += w;
          });
          page.drawLine({ start: { x: margin, y }, end: { x, y }, thickness: 0.5, color: line });
          if (isHeader) page.drawLine({ start: { x: margin, y: top }, end: { x, y: top }, thickness: 0.5, color: line });
        };
        if (hasHeader && safe[0]) drawRow(safe[0], true);
        pageRows.forEach((r) => drawRow(safe[r], false));
        page.drawText(`${sheetLabel}Page ${p + 1} of ${layout.pages.length}`, {
          x: margin,
          y: margin - footer + 6,
          size: 8,
          font,
          color: rgb(0.45, 0.45, 0.45),
        });
      });

      const name = `${baseName(file.name)}${wb!.SheetNames.length > 1 ? `-${sheetFileName(sheet)}` : ""}.pdf`;
      downloadBlob(name, bytesToBlob(await doc.save(), "application/pdf"));
      setMade({ file: name, pages: layout.pages.length, replaced });
    } catch {
      setMade(null);
      setFailed(true);
    } finally {
      setWorking(false);
    }
  };

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setMade(null);
  };

  return (
    <CalcLayout inputFirst
      inputs={
        <div className="space-y-4">
          <FileDropZone accept={SHEET_ACCEPT} onFiles={(f) => { setMade(null); open(f); }} title={file ? file.name : "Open an Excel, ODS or CSV file"} />
          {wb && <SheetPicker wb={wb} sheet={sheet} onChange={reset(setSheet)} />}
          <FieldGrid>
            <SelectField
              label="Paper"
              value={paper}
              onChange={reset(setPaper)}
              options={[
                { value: "a4", label: "A4" },
                { value: "letter", label: "US Letter" },
              ]}
            />
            <SelectField
              label="Orientation"
              value={orientation}
              onChange={reset(setOrientation)}
              options={[
                { value: "landscape", label: "Landscape" },
                { value: "portrait", label: "Portrait" },
              ]}
            />
            <SelectField
              label="Text size"
              value={fontSize}
              onChange={reset(setFontSize)}
              options={["7", "8", "9", "10", "12"].map((s) => ({ value: s, label: `${s} pt` }))}
            />
            <SelectField
              label="First row"
              value={header}
              onChange={reset(setHeader)}
              options={[
                { value: "yes", label: "Header, repeated on every page" },
                { value: "no", label: "Ordinary data" },
              ]}
            />
          </FieldGrid>
          {rows && <SheetPreview rows={rows} />}
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Opening the spreadsheet…</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !wb || !rows ? (
          <Verdict tone="neutral">Open a spreadsheet to print a sheet to PDF as a clean table.</Verdict>
        ) : tooMany ? (
          <Verdict tone="warn">This sheet has {plural(rows.length, "row")}. Up to {MAX_PDF_ROWS.toLocaleString("en-US")} rows fit in one PDF.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={made ? "PDF pages" : "Rows to print"}
              value={made ? String(made.pages) : rows.length.toLocaleString("en-US")}
              sub={made ? `${made.file} downloaded` : `From the ${sheet} sheet`}
            />
            {made && made.replaced > 0 && (
              <Verdict tone="warn">
                {plural(made.replaced, "character")} outside Western European alphabets printed as “?”. The built-in PDF font
                covers Latin text only.
              </Verdict>
            )}
            {failed && <Verdict tone="bad">The PDF couldn&apos;t be created from this sheet.</Verdict>}
            <Button type="button" className="w-full gap-2" onClick={create} disabled={working || rows.length === 0}>
              <Download className="h-4 w-4" aria-hidden /> {working ? "Building…" : "Create PDF"}
            </Button>
            <Verdict tone="neutral">
              Columns shrink to fit the page width, and text too long for its column is cut short with “…”. Cell colours,
              merged cells and charts are not included.
            </Verdict>
          </div>
        )
      }
    />
  );
}
