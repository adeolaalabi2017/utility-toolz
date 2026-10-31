// plan_content_b.js — Sections 7–11 and Appendix A (78-tool catalogue)
const { p, bullet, h1, h2, tableCaption, figCaption, mkTable, figure } = require("./plan_helpers");
const { Paragraph, TextRun } = require("docx");

const CH = "/home/z/my-project/scripts/charts";

function section7() {
  return [
    h1("7. Monetization Plan"),
    p("Monetisation uses three streams, deliberately sequenced so that each one starts only when the platform can support it: display advertising from month 2 (once a meaningful page count is indexed), affiliate recommendations from month 4 (once guides and commercial-adjacent tools exist), and the premium subscription from months 5 to 6 (once habitual users exist to convert). Over time the intended mix shifts from ad-dominated to subscription-dominated, which raises revenue per session and reduces exposure to advertising cycles."),
    h2("7.1 Stream one: display advertising"),
    p("Google AdSense is the starting network because approval is straightforward and it monetises from day one at any volume. The plan is to migrate to a premium network (Ezoic, Monumetric or a comparable managed partner) once traffic clears typical entry thresholds, which for the better networks sits around 50,000 sessions per month. Placement follows a strict rule: ads appear below the tool, between the result and the explanation, and beside the FAQ, never inside or above the working tool itself. Finance and advertising pages command the strongest RPMs of the catalogue, which is a further reason those domains launch first."),
    h2("7.2 Stream two: affiliate recommendations"),
    p("Affiliate income comes from contextual recommendations placed in tool results and guides: accounting software after the profit and loss calculator, email and marketing platforms after ROI and funnel tools, hosting and website builders after SEO utilities, design tools after image utilities. Two rules protect trust and compliance: recommendations must be genuinely relevant to the tool's outcome, and every affiliate placement carries a clear disclosure. Affiliate revenue is expected to stay the smallest stream; its real value is that it tests which commercial categories the audiences respond to, informing later premium bundles."),
    h2("7.3 Stream three: premium subscription"),
    p([
      "The premium plan is priced at ",
      { b: "$5 per month or $48 per year" },
      " and bundles the features that habitual users actually need: an ad-free experience; saved calculation history across devices; CSV and PDF export of results; batch mode for running multiple calculations at once; and embeddable widgets for the subscriber's own website or client reports. Launch bundles follow the personas: a Marketer pack (campaign and advertising collections with exports), an Accountant pack (the finance collection with exports and batch mode) and a Business pack (pricing, profitability and invoicing tools).",
    ]),
    p("Two principles govern the whole plan. Free tools always stay fully functional, because free usage is the growth engine; and premium sells convenience, never captivity, because a paywalled calculator cannot compete in search. A business tier (white-label embeds and API access for agencies) is a deliberate later opportunity once premium proves demand for the underlying features."),
  ];
}

function section8() {
  return [
    h1("8. Six-Month Build Roadmap"),
    p("The roadmap is organised into four phases across six months, followed by the backlog that completes the 78-tool catalogue. Table 4 summarises scope, timing and the checkpoint that gates each phase. Tool count is not the only gate: a phase closes only when its indexation coverage reaches the target in Section 6.4 and Core Web Vitals stay green, because publishing more pages onto an unindexed or slow site compounds waste, not growth."),
    tableCaption("Table 4: Six-month phased roadmap"),
    mkTable({
      headers: ["Phase", "Weeks", "Tools live", "Domains covered", "Key activities", "Exit checkpoint"],
      rows: [
        ["0 - Foundation", "1-2", "0", "0", "Domain and brand; stack setup; design system; tool registry and ToolPage template; analytics and Search Console", "Template and registry ship; first page indexed"],
        ["1 - MVP", "3-8", "20", "3", "Finance 8, Marketing 8, Advertising 4; three domain hubs; AdSense application at 20 indexed pages", "MVP live in week 8; first rankings appearing"],
        ["2 - Expansion", "9-16", "30", "4", "Advertising remainder 4, Business 6; profession hubs v1; affiliate links; first two pillar guides", "30 tools by month 4; indexation at 85 percent or higher"],
        ["3 - Breadth", "17-24", "60", "9", "Business remainder 2, SEO 8, Content 6, Design 6, Data 6, Developer 2; premium beta then public launch; newsletter", "60 tools by month 6; premium revenue live"],
        ["4 - Backlog", "25+", "78", "12", "Developer remainder 4, Productivity 6, Education 4, Everyday 4; B2B embed evaluation", "Catalogue complete; scale decisions for year two"],
      ],
      widths: [13, 8, 10, 13, 38, 18],
      fontSize: 18,
    }),
    p("The binding constraint is solo-founder bandwidth, and the roadmap is engineered around it. The registry and template approach drives the average build time for a simple calculator down to a few hours once Phase 1 is complete; batches are ordered by commercial value so that any pause in the schedule still leaves the highest-value tools live; and every phase produces search assets (hubs, guides, interlinks) that compound even while the next batch is being built."),
  ];
}

function section9() {
  return [
    h1("9. Illustrative Traffic and Revenue Model"),
    p([
      "The figures in this section are ",
      { b: "illustrative planning assumptions for sizing the opportunity, not forecasts" },
      ". They exist to make the plan testable: from month 3 onward, Search Console and analytics actuals replace them, and the roadmap is re-planned against real growth. All arithmetic below follows from the stated assumptions.",
    ]),
    h2("9.1 Model assumptions"),
    bullet({ lead: "Traffic. ", rest: "60,000 monthly sessions at month 6, 250,000 at month 12 and 750,000 at month 24, driven by the expanding catalogue, indexation of tool and guide pages, and compounding internal linking (Figure 2)." }),
    bullet({ lead: "Display advertising. ", rest: "A blended ad RPM of $4.00 at month 6 rising to $5.50 at month 24 as the finance and advertising share of indexed pages grows; applied to sessions per thousand." }),
    bullet({ lead: "Affiliate. ", rest: "A modest flat stream ($50 to $1,200 per month across the horizon) reflecting contextual placement only." }),
    bullet({ lead: "Premium. ", rest: "Conversion of 0.10 percent of monthly sessions at month 6, 0.30 percent at month 12 and 0.40 percent at month 24, at $5 per month (60, 750 and 3,000 subscribers respectively); free tools stay free, so conversion depends on habit and export features." }),
    figure(`${CH}/fig2_sessions.png`, 520),
    figCaption("Figure 2: Illustrative monthly sessions trajectory at months 6, 12 and 24"),
    h2("9.2 Outputs and sensitivity"),
    tableCaption("Table 5: Illustrative monthly revenue model (planning assumptions, not forecasts)"),
    mkTable({
      headers: ["Line", "Month 6", "Month 12", "Month 24"],
      rows: [
        ["Monthly sessions", "60,000", "250,000", "750,000"],
        ["Blended ad RPM", "$4.00", "$5.00", "$5.50"],
        ["Display advertising", "$240", "$1,250", "$4,125"],
        ["Affiliate revenue", "$50", "$350", "$1,200"],
        ["Premium subscribers", "60", "750", "3,000"],
        ["Premium revenue", "$300", "$3,750", "$15,000"],
        ["Total revenue per month", "$590", "$5,350", "$20,325"],
      ],
      widths: [40, 20, 20, 20],
      alignRight: [1, 2, 3],
    }),
    p("At month 24 the illustrative mix is 74 percent premium, 20 percent display and 6 percent affiliate (Figure 3), an annualised run-rate of roughly $244,000. The model is deliberately simple and its sensitivity is easy to read: revenue moves almost linearly with sessions, so halving traffic halves revenue; the largest swing factor is premium conversion, where the gap between 0.2 and 0.6 percent moves total month-24 revenue by roughly half. This is exactly why the roadmap instruments Search Console and premium beta metrics early rather than treating monetisation as a month-12 surprise."),
    figure(`${CH}/fig3_revenue_mix.png`, 380),
    figCaption("Figure 3: Illustrative revenue mix at month 24"),
  ];
}

function section10() {
  return [
    h1("10. Risk Analysis and Mitigation"),
    p("The plan's main risks are external (search algorithms, advertising markets) and internal (bandwidth, quality at scale). Table 6 lists the six that matter most, with the mitigation already embedded in the preceding sections. The common thread is depth over volume: the registry enforces unique, useful content on every page, and the phase gates stop the catalogue from outrunning its own indexation."),
    tableCaption("Table 6: Principal risks and mitigations"),
    mkTable({
      headers: ["Risk", "Likelihood", "Impact", "Mitigation"],
      rows: [
        ["Google core update hits thin tool pages", "Medium", "High", "Unique example, FAQ and explanation on every page via the registry template; diversify traffic with newsletter, guides and brand direct visits"],
        ["Tool pages judged as doorway pages", "Low", "High", "No boilerplate-at-scale: one primary domain per tool, real functionality on every URL, hubs and categories carry editorial content"],
        ["AdSense rejection or weak ad rates", "Medium", "Medium", "Apply only after 20 substantial indexed pages; migrate to premium networks at threshold; affiliate and premium reduce ad dependence"],
        ["Incumbent generic tool sites outrank launch pages", "High", "Medium", "Profession-first identity, faster static pages, deeper per-domain clusters, and long-tail modifiers before head-term assaults"],
        ["Solo-founder bandwidth slips the roadmap", "Medium", "Medium", "Registry-driven builds (hours per tool after Phase 1), batches ordered by value, phase gates that protect quality over count"],
        ["Abuse or cost spikes from bots", "Low", "Medium", "Client-side computation, Cloudflare bot rules and caching, rate limits on the few server endpoints (accounts, payments)"],
      ],
      widths: [24, 14, 10, 52],
      fontSize: 18,
    }),
  ];
}

function section11() {
  return [
    h1("11. Conclusions and Immediate Next Steps"),
    p([
      "The recommended direction is unchanged from the original thesis: ",
      { b: "build a domain-first, profession-aware global utilities platform" },
      ", with primary navigation by professional domain, secondary navigation by specialised category, dedicated pages for individual tools, a discovery layer organised by profession, and monetisation through advertising, affiliate recommendations and premium collections. The twelve-domain structure and 78-tool catalogue give the platform room to grow for years; the two-level architecture keeps it coherent while it does.",
    ]),
    p("The first thirty days determine whether the rest of the roadmap holds. The actions below correspond to Phases 0 and the start of Phase 1:"),
    bullet({ lead: "Week 1: ", rest: "register the domain and brand, scaffold the Next.js project with the design system, and write the tool registry schema plus the ToolPage template." }),
    bullet({ lead: "Week 2: ", rest: "build the first four finance tools on the template (compound interest, loan and mortgage, VAT, profit and loss), set up Google Search Console, sitemap and analytics, and validate the first keyword clusters with a research tool." }),
    bullet({ lead: "Week 3: ", rest: "complete the finance batch of eight and the finance domain hub; start internal linking to the first guides." }),
    bullet({ lead: "Week 4: ", rest: "start the marketing batch, prepare the AdSense application for submission once twenty pages are indexed, and review build time per tool against the roadmap assumption." }),
    p("Three decisions are scheduled rather than open-ended: premium pricing is validated with the month 4 to 5 beta cohort; ad-network migration is evaluated when sessions cross roughly 50,000 per month; and contractor help is triggered if indexation consistently outpaces build capacity for two consecutive months. With those checkpoints in place, the plan converts the original strategic thesis into a buildable, measurable six-month programme."),
  ];
}

// ── Appendix A: 78-tool catalogue ──
// [domain, tool, complexity, phase]
const CATALOGUE = [
  ["Finance & Accounting", "Budget and expense calculator", "Medium", "1"],
  ["Finance & Accounting", "Loan and mortgage calculator", "Low", "1"],
  ["Finance & Accounting", "Compound interest calculator", "Low", "1"],
  ["Finance & Accounting", "Tax calculators", "Medium", "1"],
  ["Finance & Accounting", "VAT calculator", "Low", "1"],
  ["Finance & Accounting", "Profit and loss calculator", "Low", "1"],
  ["Finance & Accounting", "Currency converter", "Medium", "1"],
  ["Finance & Accounting", "Debt repayment calculator", "Low", "1"],
  ["Marketing & Growth", "Marketing ROI calculator", "Low", "1"],
  ["Marketing & Growth", "Campaign performance calculator", "Low", "1"],
  ["Marketing & Growth", "Customer acquisition cost calculator", "Low", "1"],
  ["Marketing & Growth", "Conversion rate calculator", "Low", "1"],
  ["Marketing & Growth", "Marketing budget planner", "Medium", "1"],
  ["Marketing & Growth", "Marketing funnel calculator", "Low", "1"],
  ["Marketing & Growth", "A/B test significance calculator", "Medium", "1"],
  ["Marketing & Growth", "Customer lifetime value calculator", "Low", "1"],
  ["Advertising & Media Buying", "CPC calculator", "Low", "1"],
  ["Advertising & Media Buying", "CPM calculator", "Low", "1"],
  ["Advertising & Media Buying", "CTR calculator", "Low", "1"],
  ["Advertising & Media Buying", "ROAS calculator", "Low", "1"],
  ["Advertising & Media Buying", "Ad budget calculator", "Low", "2"],
  ["Advertising & Media Buying", "Impression estimator", "Low", "2"],
  ["Advertising & Media Buying", "Reach and frequency calculator", "Low", "2"],
  ["Advertising & Media Buying", "Media planning calculator", "Medium", "2"],
  ["Business & E-commerce", "Profit margin calculator", "Low", "2"],
  ["Business & E-commerce", "Markup calculator", "Low", "2"],
  ["Business & E-commerce", "Break-even calculator", "Low", "2"],
  ["Business & E-commerce", "Pricing calculator", "Low", "2"],
  ["Business & E-commerce", "Discount calculator", "Low", "2"],
  ["Business & E-commerce", "Sales commission calculator", "Low", "2"],
  ["Business & E-commerce", "Shipping cost calculator", "Medium", "3"],
  ["Business & E-commerce", "Invoice generator", "High", "3"],
  ["SEO & Website Management", "Meta title generator", "Low", "3"],
  ["SEO & Website Management", "Meta description generator", "Low", "3"],
  ["SEO & Website Management", "SERP snippet preview", "Low", "3"],
  ["SEO & Website Management", "Keyword density checker", "Low", "3"],
  ["SEO & Website Management", "Robots.txt generator", "Low", "3"],
  ["SEO & Website Management", "XML sitemap generator", "Medium", "3"],
  ["SEO & Website Management", "URL slug generator", "Low", "3"],
  ["SEO & Website Management", "Schema markup generator", "Medium", "3"],
  ["Content & Writing", "Word counter", "Low", "3"],
  ["Content & Writing", "Character counter", "Low", "3"],
  ["Content & Writing", "Reading time calculator", "Low", "3"],
  ["Content & Writing", "Text case converter", "Low", "3"],
  ["Content & Writing", "Lorem Ipsum generator", "Low", "3"],
  ["Content & Writing", "Headline analyser", "Medium", "3"],
  ["Design & Creative", "Image compressor", "High", "3"],
  ["Design & Creative", "Image resizer", "Medium", "3"],
  ["Design & Creative", "Image cropper", "Medium", "3"],
  ["Design & Creative", "Colour palette generator", "Low", "3"],
  ["Design & Creative", "HEX to RGB converter", "Low", "3"],
  ["Design & Creative", "Aspect ratio calculator", "Low", "3"],
  ["Data & Analytics", "Percentage change calculator", "Low", "3"],
  ["Data & Analytics", "Data format converter", "Medium", "3"],
  ["Data & Analytics", "CSV viewer", "Medium", "3"],
  ["Data & Analytics", "JSON to CSV converter", "Low", "3"],
  ["Data & Analytics", "Average calculator", "Low", "3"],
  ["Data & Analytics", "Standard deviation calculator", "Low", "3"],
  ["Developer & Technology", "JSON formatter", "Low", "3"],
  ["Developer & Technology", "Regex tester", "Medium", "3"],
  ["Developer & Technology", "Base64 encoder/decoder", "Low", "4"],
  ["Developer & Technology", "URL encoder/decoder", "Low", "4"],
  ["Developer & Technology", "UUID generator", "Low", "4"],
  ["Developer & Technology", "Hash generator", "Low", "4"],
  ["Productivity & Project Mgmt", "Pomodoro timer", "Low", "4"],
  ["Productivity & Project Mgmt", "Meeting cost calculator", "Low", "4"],
  ["Productivity & Project Mgmt", "Working days calculator", "Low", "4"],
  ["Productivity & Project Mgmt", "Project cost calculator", "Low", "4"],
  ["Productivity & Project Mgmt", "Deadline calculator", "Low", "4"],
  ["Productivity & Project Mgmt", "Time zone converter", "Medium", "4"],
  ["Education & Research", "GPA calculator", "Low", "4"],
  ["Education & Research", "Grade calculator", "Low", "4"],
  ["Education & Research", "Percentage calculator", "Low", "4"],
  ["Education & Research", "Citation formatter", "Medium", "4"],
  ["Everyday Utilities", "Age calculator", "Low", "4"],
  ["Everyday Utilities", "Date calculator", "Low", "4"],
  ["Everyday Utilities", "Unit converter", "Medium", "4"],
  ["Everyday Utilities", "Temperature converter", "Low", "4"],
];

function appendixA() {
  const rows = CATALOGUE.map((t, i) => [String(i + 1), t[0], t[1], t[2], t[3]]);
  const phaseCounts = {};
  for (const t of CATALOGUE) phaseCounts[t[3]] = (phaseCounts[t[3]] || 0) + 1;
  return [
    h1("Appendix A: The 78-Tool Launch Catalogue"),
    p("Table A1 lists the full launch catalogue, sized to the per-domain targets in Table 1 (eight tools each for the five commercial domains, six each for the four broad utility domains, and four each for education and everyday utilities). Complexity reflects build effort on the ToolPage template: Low items are formula or string utilities deliverable in hours, Medium items need additional inputs, parsing or file handling, and High items involve heavy processing such as client-side image compression or document generation. Phase numbers correspond to the roadmap in Section 8."),
    tableCaption("Table A1: The 78-tool launch catalogue with complexity and launch phase"),
    mkTable({
      headers: ["#", "Domain", "Tool", "Complexity", "Phase"],
      rows,
      widths: [6, 26, 43, 15, 10],
      fontSize: 18,
      zebra: true,
      alignRight: [0, 4],
    }),
    new Paragraph({
      spacing: { before: 160, line: 312, after: 120 },
      children: [
        new TextRun({
          text: `Phase distribution: Phase 1 = ${phaseCounts["1"]} tools (MVP), Phase 2 = ${phaseCounts["2"]} (to 30 by month 4), Phase 3 = ${phaseCounts["3"]} (to 60 by month 6), Phase 4 = ${phaseCounts["4"]} (to 78). The remaining candidate tools from the original catalogue pool (grammar utilities, text comparison, image format converter, font pairing utilities, data comparison tool, chart and graph utilities, HTML formatter, CSS minifier, time tracker, task prioritisation tool, study time planner, research sample size calculator, scientific unit converter, exam countdown calculator, time calculator, distance converter, speed calculator and measurement converter) form the expansion backlog that follows the initial catalogue.`,
          size: 20, color: "606060", font: { ascii: "Times New Roman" },
        }),
      ],
    }),
  ];
}

module.exports = { section7, section8, section9, section10, section11, appendixA };
