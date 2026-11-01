"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Printer, Check } from "lucide-react";
import { exportToCsv, copyAsMarkdownTable, printCurrentReport, type ExportColumn } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ExportToolbarProps<T> {
  filename: string;
  columns: ExportColumn<T>[];
  rows: T[];
  enableCsv?: boolean;
  enableMarkdown?: boolean;
  enablePrint?: boolean;
  className?: string;
}

export function ExportToolbar<T>({
  filename,
  columns,
  rows,
  enableCsv = true,
  enableMarkdown = true,
  enablePrint = true,
  className,
}: ExportToolbarProps<T>) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCsv = () => {
    if (!rows.length) {
      toast({
        title: "No data to export",
        description: "Generate or calculate data first before exporting.",
        variant: "destructive",
      });
      return;
    }
    const success = exportToCsv(filename, columns, rows);
    if (success) {
      toast({
        title: "CSV Downloaded",
        description: `Exported ${rows.length} rows to ${filename}.csv`,
      });
    }
  };

  const handleCopyMarkdown = async () => {
    if (!rows.length) {
      toast({
        title: "No data to copy",
        description: "Generate or calculate data first before copying.",
        variant: "destructive",
      });
      return;
    }
    const success = await copyAsMarkdownTable(columns, rows);
    if (success) {
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Formatted Markdown table ready to paste into Jira, Slack, or GitHub.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    printCurrentReport();
  };

  return (
    <div className={cn("no-print flex flex-wrap items-center gap-2", className)}>
      {enableCsv && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCsv}
          className="h-10 sm:h-8 gap-1.5 text-xs font-medium"
        >
          <Download className="h-3.5 w-3.5 text-primary" />
          <span>Export CSV</span>
        </Button>
      )}

      {enableMarkdown && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyMarkdown}
          className="h-10 sm:h-8 gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-deep-green" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span>{copied ? "Copied Table" : "Copy Markdown"}</span>
        </Button>
      )}

      {enablePrint && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="h-10 sm:h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          title="Print or Save as PDF"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Print / PDF</span>
        </Button>
      )}
    </div>
  );
}
