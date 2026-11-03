"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtBytes } from "@/lib/archive";

/**
 * Drop zone for the Files tools: click, keyboard or drag and drop. The real
 * file input sits inside the label, so the label is the accessible control.
 */
export function FileDropZone({
  onFiles,
  accept,
  multiple = false,
  title,
  hint = "Files stay on your device. Nothing is uploaded.",
  folder = false,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title: string;
  hint?: string;
  /** Pick a whole folder; each file keeps its path inside it. */
  folder?: boolean;
}) {
  const id = React.useId();
  const [over, setOver] = React.useState(false);
  const folderProps = folder ? ({ webkitdirectory: "", directory: "" } as Record<string, string>) : {};

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const dropped = [...e.dataTransfer.files];
        if (dropped.length) onFiles(multiple ? dropped : dropped.slice(0, 1));
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-card p-6 text-center transition-colors",
        "hover:border-primary/50 hover:bg-accent/40 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
        over && "border-primary bg-accent/50"
      )}
    >
      <FileUp className="h-6 w-6 text-muted-foreground" aria-hidden />
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple || folder}
        className="sr-only"
        {...folderProps}
        onChange={(e) => {
          const picked = [...(e.target.files ?? [])];
          if (picked.length) onFiles(picked);
          // Let the same file be picked again after it is removed.
          e.target.value = "";
        }}
      />
    </label>
  );
}

/** Ordered list of picked files with move and remove buttons. */
export function FileList<T extends { key: string; name: string; size: number }>({
  items,
  onChange,
  detail,
  label = "Selected files",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  detail?: (item: T) => string;
  label?: string;
}) {
  const move = (i: number, by: number) => {
    const next = [...items];
    const [it] = next.splice(i, 1);
    next.splice(i + by, 0, it);
    onChange(next);
  };
  return (
    <ol aria-label={label} className="divide-y divide-border/70 rounded-lg border">
      {items.map((it, i) => (
        <li key={it.key} className="flex items-center gap-2 px-3 py-2">
          <span className="tnum w-5 shrink-0 text-xs text-muted-foreground">{i + 1}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{it.name}</span>
            <span className="tnum block text-xs text-muted-foreground">
              {fmtBytes(it.size)}
              {detail ? ` · ${detail(it)}` : ""}
            </span>
          </span>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 sm:h-8 sm:w-8" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${it.name} up`}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 sm:h-8 sm:w-8" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${it.name} down`}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 sm:h-8 sm:w-8" onClick={() => onChange(items.filter((x) => x.key !== it.key))} aria-label={`Remove ${it.name}`}>
            <X className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ol>
  );
}

let keySeq = 0;
/** Stable key for list rendering; file names repeat too often to use alone. */
export const nextFileKey = () => `f${++keySeq}`;

/**
 * The largest input the Files tools accept. Input and output both sit in
 * memory, so this keeps a phone tab from being killed mid-conversion.
 */
export const MAX_TOTAL_BYTES = 500 * 1024 * 1024;
