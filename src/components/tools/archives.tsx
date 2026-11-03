"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalcLayout, FieldGrid, MiniTable, ResultHero, SelectField, StatRow, TextField, Verdict, downloadBlob } from "./ui";
import { FileDropZone, FileList, MAX_TOTAL_BYTES, nextFileKey } from "./file-drop";
import {
  ARCHIVE_MIME,
  ArchiveError,
  FORMAT_LABELS,
  archiveBaseName,
  bytesToBlob,
  fmtBytes,
  readArchive,
  writeArchive,
  type ArchiveEntry,
  type ArchiveFormat,
  type DetectedFormat,
} from "@/lib/archive";

const OUTPUT_FORMATS: { value: ArchiveFormat; label: string }[] = [
  { value: "zip", label: "ZIP (.zip)" },
  { value: "tar.gz", label: "TAR.GZ (.tar.gz)" },
  { value: "tar", label: "TAR (.tar), uncompressed" },
];

const LEVELS = [
  { value: "6", label: "Normal" },
  { value: "9", label: "Maximum (slower)" },
  { value: "0", label: "None (store only)" },
];

const tooBig = (bytes: number) =>
  bytes > MAX_TOTAL_BYTES ? `That's ${fmtBytes(bytes)}. The browser tools handle up to ${fmtBytes(MAX_TOTAL_BYTES)} at a time.` : "";

/** Let the "Working…" state paint before a synchronous compression job blocks the page. */
const nextFrame = () => new Promise((r) => setTimeout(r, 30));

function archiveError(e: unknown): string {
  return e instanceof ArchiveError ? e.message : "That file couldn't be read. It may be damaged or not an archive.";
}

/* ================================================================== */
/* Zip file creator                                                    */
/* ================================================================== */

interface PickedFile {
  key: string;
  name: string;
  size: number;
  file: File;
}

export function ZipFileCreator() {
  const [items, setItems] = React.useState<PickedFile[]>([]);
  const [format, setFormat] = React.useState<ArchiveFormat>("zip");
  const [level, setLevel] = React.useState("6");
  const [name, setName] = React.useState("archive");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [made, setMade] = React.useState<{ size: number; file: string } | null>(null);

  const add = (files: File[]) => {
    setMade(null);
    setItems((prev) => [
      ...prev,
      // A folder pick keeps each file's path inside the folder.
      ...files.map((f) => ({ key: nextFileKey(), name: f.webkitRelativePath || f.name, size: f.size, file: f })),
    ]);
  };
  const total = items.reduce((n, it) => n + it.size, 0);
  const limit = tooBig(total);
  const ext = format === "zip" ? "zip" : format;
  const fileName = `${name.trim().replace(/[\\/:*?"<>|]+/g, "-") || "archive"}.${ext}`;

  const create = async () => {
    setBusy(true);
    setError("");
    await nextFrame();
    try {
      const entries: ArchiveEntry[] = await Promise.all(
        items.map(async (it) => ({
          name: it.name,
          data: new Uint8Array(await it.file.arrayBuffer()),
          mtime: new Date(it.file.lastModified),
        }))
      );
      const out = writeArchive(entries, format, Number(level) as 0 | 6 | 9);
      downloadBlob(fileName, bytesToBlob(out, ARCHIVE_MIME[format]));
      setMade({ size: out.length, file: fileName });
    } catch {
      setError("The archive couldn't be created. Try fewer or smaller files.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FieldGrid>
            <FileDropZone multiple onFiles={add} title="Add files" />
            <FileDropZone folder onFiles={add} title="Add a folder" hint="Keeps the folder structure inside the archive." />
          </FieldGrid>
          {items.length > 0 && (
            <FileList items={items} onChange={(next) => { setItems(next); setMade(null); }} />
          )}
          <FieldGrid cols={3}>
            <SelectField label="Format" value={format} onChange={(v) => { setFormat(v as ArchiveFormat); setMade(null); }} options={OUTPUT_FORMATS} />
            {format !== "tar" && (
              <SelectField label="Compression" value={level} onChange={(v) => { setLevel(v); setMade(null); }} options={LEVELS} />
            )}
            <TextField label="Archive name" value={name} onChange={setName} />
          </FieldGrid>
        </div>
      }
      results={
        items.length === 0 ? (
          <Verdict tone="neutral">Add files or a folder to pack them into one archive.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={made ? "Archive size" : "Files to pack"}
              value={made ? fmtBytes(made.size) : String(items.length)}
              sub={made ? `${made.file} downloaded` : `${fmtBytes(total)} in total`}
            />
            {made && (
              <div>
                <StatRow label="Original size" value={fmtBytes(total)} />
                <StatRow
                  label="Saved"
                  value={total > 0 ? `${Math.max(0, Math.round((1 - made.size / total) * 100))}%` : "—"}
                  emphasis
                />
              </div>
            )}
            {limit && <Verdict tone="bad">{limit}</Verdict>}
            {error && <Verdict tone="bad">{error}</Verdict>}
            <Button type="button" className="w-full gap-2" disabled={busy || !!limit} onClick={create}>
              <Download className="h-4 w-4" aria-hidden />
              {busy ? "Packing…" : `Create ${fileName}`}
            </Button>
            <Verdict tone="neutral">
              Photos, videos and PDFs are already compressed, so they shrink very little. Text, code and
              spreadsheets often shrink by 70% or more.
            </Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Shared: open one archive                                            */
/* ================================================================== */

interface OpenedArchive {
  file: File;
  format: DetectedFormat;
  entries: ArchiveEntry[];
}

function useOpenedArchive() {
  const [opened, setOpened] = React.useState<OpenedArchive | null>(null);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const open = async (files: File[]): Promise<OpenedArchive | null> => {
    const file = files[0];
    setOpened(null);
    setError(tooBig(file.size));
    if (file.size > MAX_TOTAL_BYTES) return null;
    setBusy(true);
    await nextFrame();
    try {
      const { format, entries } = readArchive(file.name, new Uint8Array(await file.arrayBuffer()));
      const result = { file, format, entries };
      setOpened(result);
      return result;
    } catch (e) {
      setError(archiveError(e));
      return null;
    } finally {
      setBusy(false);
    }
  };
  return { opened, error, busy, open };
}

const ARCHIVE_ACCEPT = ".zip,.tar,.tgz,.gz,.tar.gz,application/zip,application/x-tar,application/gzip";

/* ================================================================== */
/* Archive extractor                                                   */
/* ================================================================== */

const MAX_LISTED = 300;

export function ArchiveExtractor() {
  const { opened, error, busy, open } = useOpenedArchive();
  const total = opened?.entries.reduce((n, e) => n + e.data.length, 0) ?? 0;

  const save = (e: ArchiveEntry) =>
    downloadBlob(e.name.split("/").pop() || "file", bytesToBlob(e.data, "application/octet-stream"));

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone accept={ARCHIVE_ACCEPT} onFiles={open} title={opened ? opened.file.name : "Open a ZIP, TAR, TAR.GZ or GZ file"} />
          {opened && opened.entries.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Contents</p>
              <ul className="max-h-[28rem] divide-y divide-border/70 overflow-auto rounded-lg border">
                {opened.entries.slice(0, MAX_LISTED).map((e, i) => (
                  <li key={`${i}-${e.name}`} className="flex items-center gap-3 px-3 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{e.name}</span>
                      <span className="tnum block text-xs text-muted-foreground">{fmtBytes(e.data.length)}</span>
                    </span>
                    <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => save(e)} aria-label={`Download ${e.name}`}>
                      <Download className="h-3.5 w-3.5" aria-hidden /> Save
                    </Button>
                  </li>
                ))}
              </ul>
              {opened.entries.length > MAX_LISTED && (
                <p className="text-xs text-muted-foreground">
                  Showing the first {MAX_LISTED} of {opened.entries.length} files. Download all of them as a ZIP from Results.
                </p>
              )}
            </div>
          )}
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Opening the archive…</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !opened ? (
          <Verdict tone="neutral">Open an archive to see what&apos;s inside and save the files you need.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero label="Files inside" value={String(opened.entries.length)} sub={`${FORMAT_LABELS[opened.format]} archive`} />
            <div>
              <StatRow label="Archive size" value={fmtBytes(opened.file.size)} />
              <StatRow label="Unpacked size" value={fmtBytes(total)} emphasis />
            </div>
            {opened.entries.length === 0 ? (
              <Verdict tone="warn">The archive is valid but holds no files, only empty folders.</Verdict>
            ) : (
              opened.format !== "zip" &&
              opened.entries.length > 1 && (
                <Button
                  type="button"
                  className="w-full gap-2"
                  onClick={() =>
                    downloadBlob(`${archiveBaseName(opened.file.name)}.zip`, bytesToBlob(writeArchive(opened.entries, "zip"), ARCHIVE_MIME.zip))
                  }
                >
                  <Download className="h-4 w-4" aria-hidden /> Download all as ZIP
                </Button>
              )
            )}
            <Verdict tone="neutral">Files open from the archive in your browser. Nothing is uploaded.</Verdict>
          </div>
        )
      }
    />
  );
}

/* ================================================================== */
/* Archive converter                                                   */
/* ================================================================== */

export function ArchiveConverter() {
  const { opened, error, busy, open } = useOpenedArchive();
  const [target, setTarget] = React.useState<ArchiveFormat>("zip");
  const [made, setMade] = React.useState<{ size: number; file: string } | null>(null);

  const onFiles = async (files: File[]) => {
    setMade(null);
    const result = await open(files);
    // Default the target to something other than what was opened.
    if (result) setTarget(result.format === "zip" ? "tar.gz" : "zip");
  };

  const convert = () => {
    if (!opened) return;
    const out = writeArchive(opened.entries, target);
    const file = `${archiveBaseName(opened.file.name)}.${target}`;
    downloadBlob(file, bytesToBlob(out, ARCHIVE_MIME[target]));
    setMade({ size: out.length, file });
  };

  const rows: [string, string][] = opened
    ? [
        ["Detected format", FORMAT_LABELS[opened.format]],
        ["Files", String(opened.entries.length)],
        ["Size", fmtBytes(opened.file.size)],
      ]
    : [];

  return (
    <CalcLayout
      inputs={
        <div className="space-y-4">
          <FileDropZone accept={ARCHIVE_ACCEPT} onFiles={onFiles} title={opened ? opened.file.name : "Open a ZIP, TAR, TAR.GZ or GZ file"} />
          <SelectField
            label="Convert to"
            value={target}
            onChange={(v) => {
              setTarget(v as ArchiveFormat);
              setMade(null);
            }}
            options={OUTPUT_FORMATS}
          />
          {opened && <MiniTable head={["Input", ""]} rows={rows} />}
        </div>
      }
      results={
        busy ? (
          <Verdict tone="neutral">Opening the archive…</Verdict>
        ) : error ? (
          <Verdict tone="bad">{error}</Verdict>
        ) : !opened ? (
          <Verdict tone="neutral">Open an archive, pick the format you need, and download the converted copy.</Verdict>
        ) : (
          <div className="space-y-4">
            <ResultHero
              label={made ? "Converted size" : "Ready to convert"}
              value={made ? fmtBytes(made.size) : `${FORMAT_LABELS[opened.format]} → ${FORMAT_LABELS[target]}`}
              sub={made ? `${made.file} downloaded` : `${opened.entries.length} file${opened.entries.length === 1 ? "" : "s"}`}
            />
            <Button type="button" className="w-full gap-2" onClick={convert} disabled={opened.entries.length === 0}>
              <Download className="h-4 w-4" aria-hidden /> Convert and download
            </Button>
            <Verdict tone="neutral">
              File names, folders and modified dates carry over. Unix permissions and empty folders do not.
            </Verdict>
          </div>
        )
      }
    />
  );
}
