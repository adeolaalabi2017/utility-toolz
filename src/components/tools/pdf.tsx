"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Download, RotateCcw, RotateCw, Trash2, Undo2 } from "lucide-react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { CalcLayout, FieldGrid, NumberField, ResultHero, SelectField, TextField, Verdict, downloadBlob } from "./ui";
import { FileDropZone, FileList, MAX_TOTAL_BYTES, nextFileKey } from "./file-drop";
import { bytesToBlob, fmtBytes, writeArchive } from "@/lib/archive";
import { parsePageRanges } from "@/lib/pdf-pages";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Library loading                                                     */
/* ------------------------------------------------------------------ */

// Both libraries are large, so they load on first use rather than with the page.
const loadPdfLib = () => import("pdf-lib");

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
function loadPdfjs() {
  pdfjsPromise ??= import("pdfjs-dist").then((pdfjs) => {
    // A module worker bundled from our own origin, as CSP worker-src 'self' requires.
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" }
    );
    return pdfjs;
  });
  return pdfjsPromise;
}

const readBytes = async (file: File) => new Uint8Array(await file.arrayBuffer());

function pdfError(e: unknown): string {
  const name = e instanceof Error ? e.name : "";
  const msg = e instanceof Error ? e.message : String(e);
  if (name === "EncryptedPDFError" || name === "PasswordException" || /encrypt|password/i.test(msg)) {
    return "This PDF is password-protected. Remove the password in your PDF reader first, then try again.";
  }
  return "That file couldn't be read as a PDF. It may be damaged or a different kind of file.";
}

/**
 * Open a PDF for rendering; call close() when done to free the worker's copy.
 * pdf.js takes ownership of the buffer it is given, so it gets a copy.
 */
async function openWithPdfjs(bytes: Uint8Array): Promise<{ doc: PDFDocumentProxy; close: () => Promise<void> }> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data: bytes.slice() });
  return { doc: await task.promise, close: () => task.destroy() };
}

async function renderPage(page: PDFPageProxy, scale: number): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  // Display intent schedules work with requestAnimationFrame, which stalls in a
  // background tab; print intent keeps converting while the visitor looks away.
  await page.render({ canvas, viewport, intent: "print" }).promise;
  return canvas;
}

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), type, quality)
  );

const pdfBlob = (bytes: Uint8Array) => bytesToBlob(bytes, "application/pdf");
const baseName = (fileName: string) => fileName.replace(/\.pdf$/i, "") || "document";
const pagesLabel = (n: number) => `${n} page${n === 1 ? "" : "s"}`;
const tooBig = (bytes: number) =>
  bytes > MAX_TOTAL_BYTES ? `That's ${fmtBytes(bytes)}. The browser tools handle up to ${fmtBytes(MAX_TOTAL_BYTES)} at a time.` : "";

/** A single opened PDF with its page count, shared by the one-file tools. */
function useSinglePdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [error, setError] = React.useState("");

  const open = async (files: File[]) => {
    const f = files[0];
    setFile(null);
    setPageCount(0);
    setError(tooBig(f.size));
    if (f.size > MAX_TOTAL_BYTES) return null;
    try {
      const { PDFDocument } = await loadPdfLib();
      const doc = await PDFDocument.load(await readBytes(f));
      setFile(f);
      setPageCount(doc.getPageCount());
      return f;
    } catch (e) {
      setError(pdfError(e));
      return null;
    }
  };
  return { file, pageCount, error, setError, open };
}

/* ================================================================== */
/* PDF merger                                                          */
/* ================================================================== */

interface PdfItem {
  key: string;
  name: string;
  size: number;
  file: File;
  pages: number;
  error?: string;
}

export function PdfMerger() {
  const [items, setItems] = React.useState<PdfItem[]>([]);
  const [name, setName] = React.useState("merged");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [made, setMade] = React.useState<{ size: number; file: string } | null>(null);

  const add = async (files: File[]) => {
    setMade(null);
    const { PDFDocument } = await loadPdfLib();
    const added = await Promise.all(
      files.map(async (file): Promise<PdfItem> => {
        const base = { key: nextFileKey(), name: file.name, size: file.size, file, pages: 0 };
        try {
          return { ...base, pages: (await PDFDocument.load(await readBytes(file))).getPageCount() };
        } catch (e) {
          return { ...base, error: pdfError(e) };
        }
      })
    );
    setItems((prev) => [...prev, ...added]);
  };

  const good = items.filter((it) => !it.error);
  const bad = items.filter((it) => it.error);
  const totalPages = good.reduce((n, it) => n + it.pages, 0);
  const limit = tooBig(good.reduce((n, it) => n + it.size, 0));
  const fileName = `${name.trim().replace(/[\\/:*?"<>|]+/g, "-") || "merged"}.pdf`;

  const merge = async () => {
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const out = await PDFDocument.create();
      for (const it of good) {
        const src = await PDFDocument.load(await readBytes(it.file));
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(fileName, pdfBlob(bytes));
      setMade({ size: bytes.length, file: fileName });
    } catch (e) {
      setError(pdfError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone multiple accept="application/pdf,.pdf" onFiles={add} title="Add PDF files" />
          {items.length > 0 && (
            <FileList
              items={items}
              onChange={(next) => {
                setItems(next);
                setMade(null);
              }}
              detail={(it) => it.error ?? pagesLabel(it.pages)}
              label="PDFs in merge order"
            />
          )}
          <TextField label="File name" value={name} onChange={setName} />
        </div>
      }
      results={
        good.length === 0 ? (
          <Verdict tone={bad.length ? "bad" : "neutral"}>
            {bad.length ? bad[0].error : "Add two or more PDFs, put them in order, and merge them into one file."}
          </Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={made ? "Merged PDF" : "Pages in the merged PDF"}
              value={made ? fmtBytes(made.size) : String(totalPages)}
              sub={made ? `${made.file} downloaded, ${pagesLabel(totalPages)}` : `From ${good.length} file${good.length === 1 ? "" : "s"}, in the order listed`}
            />
            {bad.length > 0 && (
              <Verdict tone="warn">
                {bad.length === 1 ? `${bad[0].name} will be skipped: ` : `${bad.length} files will be skipped. `}
                {bad.length === 1 ? bad[0].error : "Each is shown with its reason in the list."}
              </Verdict>
            )}
            {limit && <Verdict tone="bad">{limit}</Verdict>}
            {error && <Verdict tone="bad">{error}</Verdict>}
            <Button type="button" className="w-full gap-2" onClick={merge} disabled={busy || !!limit || good.length < 2}>
              <Download className="h-4 w-4" aria-hidden />
              {busy ? "Merging…" : good.length < 2 ? "Add another PDF to merge" : `Merge into ${fileName}`}
            </Button>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* PDF splitter                                                        */
/* ================================================================== */

const SPLIT_MODES = [
  { value: "range", label: "Extract pages into one PDF" },
  { value: "each", label: "Every page as its own PDF" },
  { value: "chunks", label: "Every N pages as a PDF" },
];

export function PdfSplitter() {
  const { file, pageCount, error, setError, open } = useSinglePdf();
  const [mode, setMode] = React.useState("range");
  const [ranges, setRanges] = React.useState("1-3");
  const [chunk, setChunk] = React.useState("2");
  const [busy, setBusy] = React.useState(false);
  const [made, setMade] = React.useState("");

  const parsed = pageCount ? parsePageRanges(ranges, pageCount) : {};
  const n = Math.floor(Number(chunk));
  const groups: number[][] =
    !pageCount
      ? []
      : mode === "range"
        ? parsed.pages
          ? [parsed.pages]
          : []
        : Array.from({ length: Math.ceil(pageCount / (mode === "each" ? 1 : Math.max(1, n || 1))) }, (_, g) => {
            const size = mode === "each" ? 1 : Math.max(1, n || 1);
            return Array.from({ length: Math.min(size, pageCount - g * size) }, (_, i) => g * size + i);
          });
  const problem =
    mode === "range" ? parsed.error ?? "" : mode === "chunks" && !(n >= 1) ? "Enter how many pages go in each PDF." : "";

  const split = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const src = await PDFDocument.load(await readBytes(file));
      const outputs: { name: string; data: Uint8Array }[] = [];
      for (const pages of groups) {
        const out = await PDFDocument.create();
        (await out.copyPages(src, pages)).forEach((p) => out.addPage(p));
        const inOrder = pages.every((p, i) => i === 0 || p === pages[i - 1] + 1);
        const label =
          pages.length === 1
            ? `page-${pages[0] + 1}`
            : inOrder
              ? `pages-${pages[0] + 1}-${pages[pages.length - 1] + 1}`
              : "selected-pages";
        outputs.push({ name: `${baseName(file.name)}-${label}.pdf`, data: await out.save() });
      }
      if (outputs.length === 1) {
        downloadBlob(outputs[0].name, pdfBlob(outputs[0].data));
        setMade(outputs[0].name);
      } else {
        // PDFs are already compressed, so the ZIP only stores them.
        const zipName = `${baseName(file.name)}-split.zip`;
        downloadBlob(zipName, bytesToBlob(writeArchive(outputs, "zip", 0), "application/zip"));
        setMade(`${zipName} (${outputs.length} PDFs)`);
      }
    } catch (e) {
      setError(pdfError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone accept="application/pdf,.pdf" onFiles={(f) => { setMade(""); open(f); }} title={file ? `${file.name} · ${pagesLabel(pageCount)}` : "Open a PDF"} />
          <SelectField label="How to split" value={mode} onChange={(v) => { setMode(v); setMade(""); }} options={SPLIT_MODES} />
          {mode === "range" && (
            <TextField
              label="Pages to keep"
              value={ranges}
              onChange={(v) => { setRanges(v); setMade(""); }}
              hint="Such as 1-3, 5, 8-. Pages come out in the order you list them."
            />
          )}
          {mode === "chunks" && <NumberField label="Pages per PDF" value={chunk} onChange={(v) => { setChunk(v); setMade(""); }} />}
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !file ? (
          <Verdict tone="neutral">Open a PDF to pull out pages or break it into smaller files.</Verdict>
        ) : problem ? (
          <Verdict tone="warn">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={groups.length === 1 ? "Pages in the new PDF" : "PDFs to create"}
              value={String(groups.length === 1 ? groups[0].length : groups.length)}
              sub={made ? `${made} downloaded` : groups.length === 1 ? `From ${pagesLabel(pageCount)}` : "Downloaded together as one ZIP"}
            />
            <Button type="button" className="w-full gap-2" onClick={split} disabled={busy}>
              <Download className="h-4 w-4" aria-hidden /> {busy ? "Splitting…" : "Split and download"}
            </Button>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* PDF page organizer: reorder, rotate, delete                         */
/* ================================================================== */

interface PageCard {
  key: string;
  /** Zero-based index in the original PDF. */
  index: number;
  thumb: string;
  /** Extra rotation in degrees, applied on top of the page's own. */
  turn: number;
  removed: boolean;
}

const MAX_ORGANIZE_PAGES = 300;

export function PdfPageOrganizer() {
  const [file, setFile] = React.useState<File | null>(null);
  const [cards, setCards] = React.useState<PageCard[]>([]);
  const [progress, setProgress] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [made, setMade] = React.useState("");
  const runId = React.useRef(0);

  const open = async (files: File[]) => {
    const f = files[0];
    const run = ++runId.current;
    setFile(null);
    setCards([]);
    setMade("");
    setError(tooBig(f.size));
    if (f.size > MAX_TOTAL_BYTES) return;
    try {
      const { doc, close } = await openWithPdfjs(await readBytes(f));
      try {
        if (doc.numPages > MAX_ORGANIZE_PAGES) {
          setError(`This PDF has ${doc.numPages} pages. The organizer handles up to ${MAX_ORGANIZE_PAGES}; split it first.`);
          return;
        }
        setFile(f);
        const out: PageCard[] = [];
        for (let i = 1; i <= doc.numPages; i++) {
          if (run !== runId.current) return; // a newer file was opened
          setProgress(`Drawing page ${i} of ${doc.numPages}…`);
          const page = await doc.getPage(i);
          const scale = 160 / page.getViewport({ scale: 1 }).width;
          const canvas = await renderPage(page, scale);
          out.push({ key: nextFileKey(), index: i - 1, thumb: canvas.toDataURL("image/jpeg", 0.8), turn: 0, removed: false });
          if (i % 6 === 0 || i === doc.numPages) setCards([...out]);
        }
      } finally {
        await close();
      }
    } catch (e) {
      setError(pdfError(e));
    } finally {
      if (run === runId.current) setProgress("");
    }
  };

  const update = (key: string, patch: Partial<PageCard>) => {
    setMade("");
    setCards((cs) => cs.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  };
  const move = (i: number, by: number) => {
    setMade("");
    setCards((cs) => {
      const next = [...cs];
      const [c] = next.splice(i, 1);
      next.splice(i + by, 0, c);
      return next;
    });
  };
  const kept = cards.filter((c) => !c.removed);
  const changed = cards.some((c, i) => c.removed || c.turn % 360 !== 0 || c.index !== i);

  const save = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await loadPdfLib();
      const src = await PDFDocument.load(await readBytes(file));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, kept.map((c) => c.index));
      pages.forEach((p, i) => {
        p.setRotation(degrees((((p.getRotation().angle + kept[i].turn) % 360) + 360) % 360));
        out.addPage(p);
      });
      const name = `${baseName(file.name)}-organized.pdf`;
      downloadBlob(name, pdfBlob(await out.save()));
      setMade(name);
    } catch (e) {
      setError(pdfError(e));
    } finally {
      setBusy(false);
    }
  };

  const iconBtn = "h-8 w-8 sm:h-8 sm:w-8";

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone accept="application/pdf,.pdf" onFiles={open} title={file ? file.name : "Open a PDF"} />
          {cards.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => { setMade(""); setCards((cs) => cs.map((c) => ({ ...c, turn: c.turn + 90 }))); }}>
                  <RotateCw className="h-3.5 w-3.5" aria-hidden /> Rotate all
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => open([file!])} disabled={!changed}>
                  <Undo2 className="h-3.5 w-3.5" aria-hidden /> Start over
                </Button>
              </div>
              <ol aria-label="Pages in output order" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {cards.map((c, i) => (
                  <li key={c.key} className={cn("rounded-lg border bg-background p-2", c.removed && "opacity-45")}>
                    <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md bg-muted">
                                      <img
                        src={c.thumb}
                        alt={`Page ${c.index + 1}`}
                        className="max-h-full max-w-full shadow-sm transition-transform"
                        style={{ transform: `rotate(${c.turn}deg)` }}
                      />
                    </div>
                    <p className="tnum mt-1.5 text-center text-xs text-muted-foreground">
                      {c.removed ? `Page ${c.index + 1} removed` : `Page ${c.index + 1}`}
                    </p>
                    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                      <Button type="button" variant="ghost" size="icon" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move page ${c.index + 1} earlier`}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className={iconBtn} onClick={() => update(c.key, { turn: c.turn - 90 })} aria-label={`Rotate page ${c.index + 1} left`}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className={iconBtn} onClick={() => update(c.key, { turn: c.turn + 90 })} aria-label={`Rotate page ${c.index + 1} right`}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className={iconBtn} onClick={() => update(c.key, { removed: !c.removed })} aria-label={c.removed ? `Restore page ${c.index + 1}` : `Remove page ${c.index + 1}`}>
                        {c.removed ? <Undo2 className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className={iconBtn} disabled={i === cards.length - 1} onClick={() => move(i, 1)} aria-label={`Move page ${c.index + 1} later`}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !file ? (
          <Verdict tone="neutral">Open a PDF to reorder, rotate or remove its pages.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label="Pages in the new PDF"
              value={String(kept.length)}
              sub={made ? `${made} downloaded` : `${cards.length - kept.length} removed, ${cards.filter((c) => !c.removed && c.turn % 360 !== 0).length} rotated`}
            />
            {progress && <Verdict tone="neutral">{progress}</Verdict>}
            {cards.length > 0 && kept.length === 0 && (
              <Verdict tone="warn">Every page is removed. Restore at least one to save.</Verdict>
            )}
            <Button type="button" className="w-full gap-2" onClick={save} disabled={busy || !!progress || kept.length === 0}>
              <Download className="h-4 w-4" aria-hidden /> {busy ? "Saving…" : "Save the new PDF"}
            </Button>
            <Verdict tone="neutral">Text, links and form fields stay as they are. Only page order and rotation change.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Images to PDF                                                       */
/* ================================================================== */

interface ImageItem {
  key: string;
  name: string;
  size: number;
  file: File;
}

const PAGE_SIZES: Record<string, [number, number] | null> = {
  fit: null,
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export function ImagesToPdf() {
  const [items, setItems] = React.useState<ImageItem[]>([]);
  const [size, setSize] = React.useState("a4");
  const [orientation, setOrientation] = React.useState("auto");
  const [margin, setMargin] = React.useState("18");
  const [name, setName] = React.useState("images");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [made, setMade] = React.useState<{ size: number; file: string } | null>(null);

  const total = items.reduce((n, it) => n + it.size, 0);
  const limit = tooBig(total);
  const fileName = `${name.trim().replace(/[\\/:*?"<>|]+/g, "-") || "images"}.pdf`;

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await loadPdfLib();
      const doc = await PDFDocument.create();
      const m = Number(margin);
      for (const it of items) {
        let bitmap: ImageBitmap;
        try {
          // from-image applies EXIF rotation, so phone photos aren't sideways.
          bitmap = await createImageBitmap(it.file, { imageOrientation: "from-image" });
        } catch {
          throw new Error(`${it.name} isn't an image this browser can open.`);
        }
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
        bitmap.close();
        const jpeg = it.file.type === "image/jpeg";
        const blob = await canvasToBlob(canvas, jpeg ? "image/jpeg" : "image/png", 0.92);
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const img = jpeg ? await doc.embedJpg(bytes) : await doc.embedPng(bytes);

        // Pixels at 96 per inch, in PDF points (72 per inch).
        const iw = img.width * 0.75;
        const ih = img.height * 0.75;
        const fixed = PAGE_SIZES[size];
        let pw: number;
        let ph: number;
        if (!fixed) {
          pw = iw + 2 * m;
          ph = ih + 2 * m;
        } else {
          const landscape = orientation === "landscape" || (orientation === "auto" && iw > ih);
          [pw, ph] = landscape ? [fixed[1], fixed[0]] : fixed;
        }
        const scale = Math.min((pw - 2 * m) / iw, (ph - 2 * m) / ih, fixed ? Infinity : 1);
        const w = iw * scale;
        const h = ih * scale;
        doc.addPage([pw, ph]).drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }
      const bytes = await doc.save();
      downloadBlob(fileName, pdfBlob(bytes));
      setMade({ size: bytes.length, file: fileName });
    } catch (e) {
      setError(e instanceof Error && e.message.endsWith("can open.") ? e.message : "The PDF couldn't be created from these images.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone multiple accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" onFiles={(fs) => { setMade(null); setItems((p) => [...p, ...fs.map((file) => ({ key: nextFileKey(), name: file.name, size: file.size, file }))]); }} title="Add JPG, PNG or WebP images" />
          {items.length > 0 && <FileList items={items} onChange={(n) => { setItems(n); setMade(null); }} label="Images in page order" />}
          <FieldGrid cols={3}>
            <SelectField
              label="Page size"
              value={size}
              onChange={(v) => { setSize(v); setMade(null); }}
              options={[
                { value: "a4", label: "A4" },
                { value: "letter", label: "US Letter" },
                { value: "fit", label: "Same as the image" },
              ]}
            />
            {size !== "fit" && (
              <SelectField
                label="Orientation"
                value={orientation}
                onChange={(v) => { setOrientation(v); setMade(null); }}
                options={[
                  { value: "auto", label: "Match each image" },
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ]}
              />
            )}
            <SelectField
              label="Margin"
              value={margin}
              onChange={(v) => { setMargin(v); setMade(null); }}
              options={[
                { value: "0", label: "None" },
                { value: "18", label: "Small (¼ in)" },
                { value: "36", label: "Normal (½ in)" },
              ]}
            />
          </FieldGrid>
          <TextField label="File name" value={name} onChange={setName} />
        </div>
      }
      results={
        items.length === 0 ? (
          <Verdict tone="neutral">Add images, put them in order, and turn them into one PDF with a page per image.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={made ? "PDF size" : "Pages"}
              value={made ? fmtBytes(made.size) : String(items.length)}
              sub={made ? `${made.file} downloaded` : "One image per page, in the order listed"}
            />
            {limit && <Verdict tone="bad">{limit}</Verdict>}
            {error && <Verdict tone="bad">{error}</Verdict>}
            <Button type="button" className="w-full gap-2" onClick={create} disabled={busy || !!limit}>
              <Download className="h-4 w-4" aria-hidden /> {busy ? "Building…" : `Create ${fileName}`}
            </Button>
            <Verdict tone="neutral">Images are scaled down to fit the page but never stretched or cropped.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* PDF to images                                                       */
/* ================================================================== */

interface RenderedImage {
  name: string;
  blob: Blob;
  url: string;
}

const MAX_RENDER_PAGES = 100;

export function PdfToImages() {
  const { file, pageCount, error, setError, open } = useSinglePdf();
  const [format, setFormat] = React.useState("image/png");
  const [dpi, setDpi] = React.useState("150");
  const [ranges, setRanges] = React.useState("");
  const [busy, setBusy] = React.useState("");
  const [images, setImages] = React.useState<RenderedImage[]>([]);

  // Object URLs pin their blobs in memory until revoked.
  const clear = React.useCallback(() => {
    setImages((imgs) => {
      imgs.forEach((i) => URL.revokeObjectURL(i.url));
      return [];
    });
  }, []);
  React.useEffect(() => clear, [clear]);

  const parsed = pageCount ? (ranges.trim() ? parsePageRanges(ranges, pageCount) : { pages: Array.from({ length: pageCount }, (_, i) => i) }) : {};
  const pages = parsed.pages ?? [];
  const problem = parsed.error ?? (pages.length > MAX_RENDER_PAGES ? `Convert up to ${MAX_RENDER_PAGES} pages at a time. Enter a range such as 1-${MAX_RENDER_PAGES}.` : "");
  const ext = format === "image/png" ? "png" : "jpg";

  const convert = async () => {
    if (!file) return;
    clear();
    setError("");
    try {
      const { doc, close } = await openWithPdfjs(await readBytes(file));
      const out: RenderedImage[] = [];
      try {
        for (const [n, index] of pages.entries()) {
          setBusy(`Rendering page ${n + 1} of ${pages.length}…`);
          const canvas = await renderPage(await doc.getPage(index + 1), Number(dpi) / 72);
          const blob = await canvasToBlob(canvas, format, 0.9);
          out.push({ name: `${baseName(file.name)}-page-${index + 1}.${ext}`, blob, url: URL.createObjectURL(blob) });
        }
      } finally {
        await close();
      }
      setImages(out);
    } catch (e) {
      setError(pdfError(e));
    } finally {
      setBusy("");
    }
  };

  const downloadAll = async () => {
    const entries = await Promise.all(images.map(async (i) => ({ name: i.name, data: new Uint8Array(await i.blob.arrayBuffer()) })));
    downloadBlob(`${baseName(file!.name)}-images.zip`, bytesToBlob(writeArchive(entries, "zip", 0), "application/zip"));
  };
  const totalSize = images.reduce((n, i) => n + i.blob.size, 0);

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone accept="application/pdf,.pdf" onFiles={(f) => { clear(); open(f); }} title={file ? `${file.name} · ${pagesLabel(pageCount)}` : "Open a PDF"} />
          <FieldGrid>
            <SelectField
              label="Image format"
              value={format}
              onChange={(v) => { setFormat(v); clear(); }}
              options={[
                { value: "image/png", label: "PNG (sharp text)" },
                { value: "image/jpeg", label: "JPG (smaller files)" },
              ]}
            />
            <SelectField
              label="Resolution"
              value={dpi}
              onChange={(v) => { setDpi(v); clear(); }}
              options={[
                { value: "72", label: "72 DPI (screen)" },
                { value: "150", label: "150 DPI (standard)" },
                { value: "300", label: "300 DPI (print)" },
              ]}
            />
          </FieldGrid>
          <TextField label="Pages" value={ranges} onChange={(v) => { setRanges(v); clear(); }} placeholder="All pages" hint="Leave empty for every page, or enter a range such as 1-3, 5" />
          {images.length > 0 && (
            <ul aria-label="Converted images" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img) => (
                <li key={img.url} className="rounded-lg border bg-background p-2">
                  <img src={img.url} alt={img.name} className="mx-auto max-h-48 w-auto shadow-sm" />
                  <p className="mt-1.5 truncate text-xs text-muted-foreground">{img.name}</p>
                  <Button type="button" variant="outline" size="sm" className="mt-1.5 w-full gap-1.5" onClick={() => downloadBlob(img.name, img.blob)} aria-label={`Download ${img.name}`}>
                    <Download className="h-3.5 w-3.5" aria-hidden /> Save · {fmtBytes(img.blob.size)}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
      results={
        error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !file ? (
          <Verdict tone="neutral">Open a PDF to turn its pages into PNG or JPG images.</Verdict>
        ) : problem ? (
          <Verdict tone="warn">{problem}</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={images.length ? "Images ready" : "Pages to convert"}
              value={String(images.length || pages.length)}
              sub={images.length ? `${fmtBytes(totalSize)} in total` : `${ext.toUpperCase()} at ${dpi} DPI`}
            />
            {busy && <Verdict tone="neutral">{busy}</Verdict>}
            {images.length === 0 ? (
              <Button type="button" className="w-full" onClick={convert} disabled={!!busy}>
                {busy ? "Converting…" : "Convert pages"}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full gap-2"
                onClick={() => (images.length === 1 ? downloadBlob(images[0].name, images[0].blob) : downloadAll())}
              >
                <Download className="h-4 w-4" aria-hidden /> {images.length === 1 ? "Download image" : "Download all as ZIP"}
              </Button>
            )}
          </div>
        )
      }
    />
  );
}
