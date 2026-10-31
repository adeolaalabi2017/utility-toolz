// generate_toolsite_plan.js — assembles the Word document
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, SectionType, TableOfContents,
} = require("docx");
const fs = require("fs");
const { P, buildCoverR1 } = require("./plan_helpers");
const A = require("./plan_content_a");
const B = require("./plan_content_b");

// ── sanity: catalogue must total 78 with phase split 20/10/30/18 ──
const { execSync } = require("child_process");

const pgSize = { width: 11906, height: 16838 };
const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

function pageNumFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
    })],
  });
}
function docHeader() {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: "single", size: 2, color: "BECFCC", space: 4 } },
      children: [new TextRun({ text: "High-Traffic Utility Tools Platform - Build Plan", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
    })],
  });
}

// ── Cover config (Recipe R1, DS-1 palette) ──
const coverConfig = {
  title: "High-Traffic Utility Tools Platform",
  subtitle: "A domain-first, profession-aware build plan for an online tools business",
  englishLabel: "BUILD PLAN",
  metaLines: [
    "Prepared for: Founder (working blueprint)",
    "Scope: 12 professional domains, 78-tool launch catalogue",
    "Horizon: 6-month phased rollout",
    "October 2026",
  ],
  footerLeft: "Internal planning document",
  footerRight: "October 2026",
  palette: {
    bg: P.bg, accent: P.accent,
    titleColor: P.cover.titleColor, subtitleColor: P.cover.subtitleColor,
    metaColor: P.cover.metaColor, footerColor: P.cover.footerColor,
  },
};

// ── Front matter: Table of Contents ──
const tocChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 360 },
    children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
  }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({
    spacing: { before: 200 },
    children: [new TextRun({
      text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"",
      italics: true, size: 18, color: "888888", font: { ascii: "Times New Roman" },
    })],
  }),
];

// ── Body ──
const bodyChildren = [
  ...A.execSummary(),
  ...A.section1(),
  ...A.section2(),
  ...A.section3(),
  ...A.section4(),
  ...A.section5(),
  ...A.section6(),
  ...B.section7(),
  ...B.section8(),
  ...B.section9(),
  ...B.section10(),
  ...B.section11(),
  ...B.appendixA(),
];

const doc = new Document({
  creator: "Founder Planning",
  title: "High-Traffic Utility Tools Platform - Build Plan",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimSun" }, size: 24, color: "000000" },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: P.primary },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: P.primary },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 24, bold: true, color: P.primary },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  sections: [
    { // Section 1: Cover — margin 0, no header/footer, no pageNumbers
      properties: {
        page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: buildCoverR1(coverConfig),
    },
    { // Section 2: Front matter (TOC) — Roman numerals
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
      },
      footers: { default: pageNumFooter() },
      children: tocChildren,
    },
    { // Section 3: Body — Arabic numerals restarting at 1
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: { default: docHeader() },
      footers: { default: pageNumFooter() },
      children: bodyChildren,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "/home/z/my-project/download/Utility-Tools-Platform-Build-Plan.docx";
  fs.writeFileSync(out, buf);
  console.log("Written:", out, buf.length, "bytes");
});
