// plan_helpers.js — palette, typography helpers, table/figure builders, R1 cover
// Document: "High-Traffic Utility Tools Platform — Build Plan" (English, report/proposal scene)
const {
  Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, ExternalHyperlink,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType, TableLayoutType,
} = require("docx");
const fs = require("fs");

// ── DS-1 Deep Sea palette (design-system.md coverPalettes) ──
const P = {
  bg: "0B1C2C",            // deep navy cover background
  accent: "529286",        // teal accent
  primary: "0B1C2C",       // navy headings on white body pages
  body: "000000",          // Profile A (report): pure black body text
  secondary: "606060",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "529286", headerText: "FFFFFF", accentLine: "529286", innerLine: "BECFCC", surface: "E8ECEB" },
};

const EN = "Times New Roman";
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── Text run builder: accepts "str", {b:"bold"}, {i:"italic"} or arrays of these ──
function runs(x, base) {
  const arr = Array.isArray(x) ? x : [x];
  return arr.map((item) => {
    if (typeof item === "string") return new TextRun({ text: item, size: 24, color: P.body, font: { ascii: EN, eastAsia: "SimSun" }, ...base });
    if (item && item.b !== undefined) return new TextRun({ text: item.b, bold: true, size: 24, color: P.body, font: { ascii: EN, eastAsia: "SimSun" }, ...base });
    if (item && item.i !== undefined) return new TextRun({ text: item.i, italics: true, size: 24, color: P.body, font: { ascii: EN, eastAsia: "SimSun" }, ...base });
    return new TextRun({ text: String(item), size: 24, color: P.body, font: { ascii: EN, eastAsia: "SimSun" }, ...base });
  });
}

// ── Body paragraph (English: left-aligned, no first-line indent, 1.3x spacing) ──
function p(x, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 312, after: 120, ...(opts.spacing || {}) },
    keepNext: opts.keepNext || undefined,
    children: runs(x),
  });
}

// ── Bullet paragraph; item = string | array | {lead, rest} for a bold lead-in ──
function bullet(item) {
  let children;
  if (item && item.lead !== undefined) {
    children = [...runs([{ b: item.lead }, item.rest])];
  } else {
    children = runs(item);
  }
  return new Paragraph({ bullet: { level: 0 }, spacing: { line: 312, after: 60 }, children });
}

// ── Headings (real Heading styles so the TOC can index them) ──
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.primary, font: { ascii: EN, eastAsia: "SimHei" } })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.primary, font: { ascii: EN, eastAsia: "SimHei" } })],
  });
}

// ── Captions ──
function tableCaption(text) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: 200, after: 80, line: 312 },
    children: [new TextRun({ text, bold: true, size: 21, color: P.primary, font: { ascii: EN } })],
  });
}
function figCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 240, line: 312 },
    children: [new TextRun({ text, size: 20, color: P.secondary, font: { ascii: EN } })],
  });
}

// ── Horizontal-Only business table (design-system.md style 3) ──
// headers: string[]; rows: (string | number)[][]; widths: percentage[]
function mkTable({ headers, rows, widths, fontSize = 20, zebra = false, alignRight = [] }) {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({
        spacing: { line: 276 },
        alignment: alignRight.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children: [new TextRun({ text, bold: true, size: fontSize, color: P.table.headerText, font: { ascii: EN } })],
      })],
    })),
  });
  const dataRows = rows.map((cells, r) => new TableRow({
    cantSplit: true,
    children: cells.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      shading: zebra && r % 2 === 0
        ? { type: ShadingType.CLEAR, fill: P.table.surface }
        : { type: ShadingType.CLEAR, fill: "FFFFFF" },
      margins: { top: 50, bottom: 50, left: 120, right: 120 },
      children: [new Paragraph({
        spacing: { line: 276 },
        alignment: alignRight.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children: [new TextRun({ text: String(text), size: fontSize, color: P.body, font: { ascii: EN } })],
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      left: NB, right: NB,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      insideVertical: NB,
    },
    rows: [headerRow, ...dataRows],
  });
}

// ── Figure embed with aspect ratio from PNG IHDR ──
function pngSize(buf) { return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }; }
function figure(path, displayWidth = 520) {
  const buf = fs.readFileSync(path);
  const dims = pngSize(buf);
  const displayHeight = Math.round(displayWidth * (dims.height / dims.width));
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 40 },
    keepNext: true,
    children: [new ImageRun({ data: buf, transformation: { width: displayWidth, height: displayHeight }, type: "png" })],
  });
}

// ── Cover title layout (calcTitleLayout, Latin-aware width) ──
// Latin glyphs are roughly 55% of a CJK glyph width at the same point size, so
// per design-system estimateTextWidth guidance the per-char width is pt*11 twips.
function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([..." \t", ..."-_/", ...",.;:!?"]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += " " + last;
  }
  return lines;
}
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 11; // Latin-aware width (CJK would be pt*20)
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = splitTitleLines(title, charsPerLine(minPt));
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}
function calcCoverSpacing(params) {
  const {
    titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0,
  } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

// ── Recipe R1: Pure Paragraph Cover (left-aligned, full-page dark background) ──
function buildCoverR1(config) {
  const PC = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length,
    fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: PC.accent, space: 12 };
  const children = [];

  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));

  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PC.accent, space: 8 } },
      children: [new TextRun({
        text: config.englishLabel.split("").join("  "),
        size: 18, color: PC.accent, font: { ascii: "Arial", eastAsia: "SimHei" }, characterSpacing: 40,
      })],
    }));
  }

  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({
        text: titleLines[i], size: titleSize, bold: true,
        color: PC.titleColor, font: { eastAsia: "SimHei", ascii: "Arial" },
      })],
    }));
  }

  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 800 },
      children: [new TextRun({
        text: config.subtitle, size: 24, color: PC.subtitleColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" },
      })],
    }));
  }

  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({
        text: line, size: 24, color: PC.metaColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" },
      })],
    }));
  }

  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));

  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: PC.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: PC.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: PC.footerColor, font: { ascii: "Arial" } }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: PC.bg },
        borders: noBorders,
        children,
      })],
    })],
  })];
}

module.exports = {
  P, EN, NB, noBorders, allNoBorders,
  runs, p, bullet, h1, h2, tableCaption, figCaption, mkTable, figure, buildCoverR1,
};
