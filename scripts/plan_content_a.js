// plan_content_a.js — Executive Summary and Sections 1–6
const { p, bullet, h1, h2, tableCaption, figCaption, mkTable, figure } = require("./plan_helpers");

const CH = "/home/z/my-project/scripts/charts";

function execSummary() {
  return [
    h1("Executive Summary"),
    p("This plan sets out the build of a high-traffic utility tools platform organised by professional domain rather than by tool function. Instead of a generic directory of calculators and converters, the site presents twelve professional domains, from Finance and Accounting to Everyday Utilities, each containing a curated set of tools, guides and related collections. A digital marketer visiting the Marketing section finds everything needed for SEO, advertising, social media, content and campaign analysis in one place; a business owner finds pricing, profitability and operations tools together. The positioning is deliberately professional: a tools platform for people at work, not another pile of random utilities."),
    p([
      "The launch catalogue targets ",
      { b: "78 tools across twelve domains" },
      ", sequenced by commercial value: Finance and Accounting, Marketing and Growth, and Advertising and Media Buying launch first. The build starts with a 20-tool MVP in eight weeks, reaches 30 tools by month 4 and roughly 60 tools across nine domains by month 6, with the remaining catalogue items following as backlog. A two-level architecture (domain hubs above specialised categories above individual tool pages) plus a profession-based discovery layer gives every tool a dedicated, search-optimised landing page while preserving one coherent brand identity.",
    ]),
    p([
      "Traffic growth rests on programmatic SEO around high-intent calculator and converter queries, hub-and-spoke internal linking and fast static pages. Monetisation follows a three-stream ladder: display advertising from month 2, affiliate recommendations from month 4, and a ",
      { b: "$5 per month premium collection" },
      " (ad-free, saved history, exports, embeds) from months 5 to 6. On the illustrative planning assumptions stated in Section 9, the platform reaches approximately 60,000 monthly sessions at month 6, 250,000 at month 12 and 750,000 at month 24, supporting an indicative revenue run-rate of roughly $20,000 per month at month 24. Those figures are sizing assumptions to be replaced with Search Console actuals from month 3 onward, not forecasts.",
    ]),
  ];
}

function section1() {
  return [
    h1("1. Product Vision and Strategic Positioning"),
    p("Users do not wake up thinking in categories like calculators, converters or text tools. They arrive with a job: plan an ad budget, price a product, check a margin, prepare a quote. Organising the platform around professional domains matches that mental model. Someone working in digital marketing should be able to visit the Marketing section and find everything for SEO, advertising, social media, content creation and campaign analysis; someone running a business should find finance, operations, sales and administration tools together. This gives the platform a stronger identity than a function-first directory and creates room to expand into specialised, higher-value tools."),
    p([
      "The domain-first structure has three strategic advantages. ",
      { b: "First, it attracts distinct professional audiences" },
      " (accountants, digital marketers, advertising agencies, business owners, SEO specialists, designers, developers, students and freelancers) rather than a single undifferentiated calculator crowd. Each audience has different needs, different search behaviour and, importantly, different monetisation potential. ",
      { b: "Second, it creates topical authority" },
      ": the Marketing and Growth section can become a substantial resource covering marketing calculations, campaign planning, customer acquisition and performance measurement, built from interconnected tools and educational guides. Search engines reward that coherence, and users return to the brand that covers their whole workflow. ",
      { b: "Third, it opens a natural path to premium subscriptions" },
      ": a marketer can eventually pay for a campaign planning and reporting collection, an accountant for advanced financial calculators with export, an owner for pricing and profitability toolkits.",
    ]),
    p([
      "The recommended direction, carried through every later section of this plan, is therefore: ",
      { b: "build a domain-first, profession-aware global utilities platform" },
      ". Primary navigation follows professional domains; secondary navigation follows specialised tool categories inside each domain; every tool gets its own page; a discovery layer organises tools by profession and use case; and monetisation combines advertising, affiliate recommendations and premium tool collections. Function-based categorisation is not abandoned, it is demoted to a secondary layer of tags and collections, so a user who specifically wants all converters can still find them in one view.",
    ]),
  ];
}

function section2() {
  const domainRows = [
    ["1", "Finance & Accounting", "1", "8", "8"],
    ["2", "Marketing & Growth", "2", "8", "8"],
    ["3", "Advertising & Media Buying", "3", "8", "8"],
    ["4", "Business & E-commerce", "4", "8", "8"],
    ["5", "SEO & Website Management", "5", "8", "8"],
    ["6", "Content & Writing", "6", "8", "6"],
    ["7", "Design & Creative", "7", "8", "6"],
    ["8", "Data & Analytics", "8", "8", "6"],
    ["9", "Developer & Technology", "9", "8", "6"],
    ["10", "Productivity & Project Management", "10", "8", "6"],
    ["11", "Education & Research", "11", "8", "4"],
    ["12", "Everyday Utilities", "12", "8", "4"],
    ["", "Total", "", "96", "78"],
  ];
  return [
    h1("2. Information Architecture: The Domain-First Structure"),
    h2("2.1 The twelve professional domains"),
    p("The platform starts with twelve major domains chosen to cover professional and everyday needs while keeping each hub commercially coherent. Five domains are commercial powerhouses (finance, marketing, advertising, business, SEO) where tool intent overlaps with buyer intent; four are broad utility domains (content, design, data, developer); three round out reach and habit (productivity, education, everyday). Table 1 shows the launch priority and catalogue sizing for each domain. The catalogue pool is the full list of candidate tools identified for this plan; the initial target is the subset that will exist when the catalogue is complete after the roadmap in Section 8."),
    tableCaption("Table 1: The twelve domains, launch priority and catalogue sizing"),
    mkTable({
      headers: ["#", "Domain", "Launch priority", "Catalogue pool (tools)", "Initial target (tools)"],
      rows: domainRows,
      widths: [6, 38, 16, 22, 18],
      alignRight: [0, 2, 3, 4],
    }),
    h2("2.2 The two-level system: domains, categories, tools"),
    p("Function-based categorisation survives as a secondary layer. The primary layer is the professional domain: a central landing page introduces each domain and links to its specialised tool categories. Inside Marketing and Growth, for example, those categories are SEO Tools, Social Media Tools, Email Marketing, Marketing Analytics, Content Marketing and Marketing Planning. The third level is the individual tool, and every tool keeps its own URL, landing page, full functionality, explanation and related-tools block. This mirrors how specialists browse (by field first, by task second) while keeping every page individually rankable in search."),
    h2("2.3 Tags and cross-listing"),
    p("Every tool carries searchable tags such as calculator, free, marketing, analytics, online, ROI. Tags power the site search, the collection pages and the future recommendation engine. A tool belongs to one primary domain but can appear in other relevant collections: the ROAS calculator lives primarily in Advertising and Media Buying, yet also appears in the Marketing and Growth analytics collection. This one-primary-domain rule keeps URL structure and editorial ownership clean, while tags and collections give every tool multiple discovery paths without duplicating pages."),
    h2("2.4 URL and navigation design"),
    p("URLs follow the hierarchy and carry keywords: /marketing/ is the domain hub, /marketing/analytics/ the category page, /marketing/marketing-roi-calculator/ the tool page, and /professions/marketer/ the profession hub. The main navigation reads Home, Finance, Marketing, Advertising, Business, Design, Developers, More, with the More menu revealing the remaining domains; the footer lists all twelve domains plus the profession hubs. Breadcrumbs on every tool page reinforce the same hierarchy for users and for search engines."),
  ];
}

function section3() {
  return [
    h1("3. Site Experience Design"),
    h2("3.1 Landing page"),
    p("The landing page must communicate in seconds that this is a platform for professionals and everyday users, not a random collection of utilities. The main navigation (Home, Finance, Marketing, Advertising, Business, Design, Developers, More) is repeated in the page header, and the homepage itself is composed of eight blocks in a fixed order: a hero section with a prominent tool search; browse by professional domain; popular tools; tools for your profession; recently added tools; featured guides and tutorials; a premium subscription promotion; and a footer listing every tool domain. The hero search is the critical element: it queries the tool registry (names, tags, categories) and routes users to a tool in one keystroke-to-click interaction."),
    h2("3.2 Profession hubs: Tools for Your Profession"),
    p("Alongside the domain categories, the platform ships a section called Tools for Your Profession. Six hubs launch: for marketers (campaigns, SEO, advertising, analytics), accountants (finance, tax, budgets, profitability), business owners (pricing, sales, operations, planning), developers (coding, formatting, testing, conversion), designers (images, colours, dimensions, formats) and students (grades, research, calculations, study planning). Profession pages improve discovery for users who self-identify by occupation rather than by tool type, they create natural cross-links between domains, and they later support personalised tool recommendations once accounts exist. Each hub is also a compact SEO asset targeting phrases such as marketing tools for agencies or tools for small business owners."),
    h2("3.3 The standard tool page template"),
    p("Every one of the 78 tools ships on the same page skeleton, which is both a quality guarantee and the engine of the SEO strategy in Section 6. The template contains: an H1 with the tool name and a one-line value proposition; the working tool above the fold; a short how-it-works explanation; at least one worked example with realistic numbers; three to five FAQ entries; a related-tools block linking four to six sibling tools; and tags plus a breadcrumb back to the category and domain hubs. Users get orientation and depth; search engines get unique, structured content on every URL rather than a bare widget."),
  ];
}

function section4() {
  return [
    h1("4. Launch Catalogue and Build Priorities"),
    p([
      "The 78-tool figure is a ",
      { b: "catalogue target for expansion, not a pre-launch obligation" },
      ". The plan launches with the strongest 20 to 30 tools and expands from there. Phase 1 (the MVP, weeks 3 to 8) ships all eight finance tools, all eight marketing tools and the four headline advertising calculators (CPC, CPM, CTR, ROAS), because these combine high commercial intent with simple, fully client-side logic. Phase 2 (by month 4) adds the remaining four advertising tools and six business calculators. Phase 3 (by month 6) adds the business remainder plus eight SEO tools, six content tools, six design tools, six data tools and the first two developer tools. Phase 4 completes the 78-tool catalogue with the remaining developer tools, productivity, education and everyday utilities.",
    ]),
    p("Figure 1 shows the resulting trajectory. The curve is deliberately steepest in months 1 and 2 (template building plus the finance and marketing batches) and again in months 5 and 6, when the registry-driven build process hits its stride and simple tools can be added in hours rather than days. Image-heavy design tools are scheduled into Phase 3 because they require more engineering (canvas and WebAssembly processing) than formula calculators."),
    figure(`${CH}/fig1_roadmap_tools.png`, 520),
    figCaption("Figure 1: Six-month rollout, cumulative tools live by month"),
  ];
}

function section5() {
  return [
    h1("5. Technology Stack and Architecture"),
    h2("5.1 Core stack decisions"),
    p([
      "The recommended stack is ",
      { b: "Next.js (App Router) with static generation, TypeScript end to end and Tailwind CSS" },
      ". Every tool page is pre-rendered at build time (with incremental regeneration for registry changes), which makes pages effectively instant, keeps Core Web Vitals comfortably green, and serves traffic from a CDN without origin load. All tool logic runs client-side in the browser: calculations never touch a server, which means zero marginal compute cost as traffic scales, privacy-friendly behaviour (user data never leaves the device), and resilience to traffic spikes. Image tools process files locally with canvas and WebAssembly, so images are never uploaded.",
    ]),
    h2("5.2 The tool registry: one template, 78 pages"),
    p("The architectural centrepiece is a typed tool registry: a single configuration source that defines every tool (slug, domain, category, tags, component, description, how-it-works copy, worked example, FAQ entries, related tools). One ToolPage template renders all tool pages from the registry, and the domain hubs, category pages, sitemap and search index are generated from the same source. Adding a tool becomes adding a config entry and a component, which is what makes a 60-tool six-month roadmap realistic for a small team. The registry also enforces the SEO template of Section 3.3: no tool page can ship without an example and FAQ."),
    p("Supporting services stay boring and cheap: a managed Postgres (Neon or Supabase) for tool metadata, newsletter sign-ups and premium user data; Clerk or Auth.js for accounts; Stripe for subscriptions; Pagefind for fast client-side search over the registry; Plausible or GA4 plus Google Search Console for measurement; MDX for the guides layer. Hosting is Vercel (or Cloudflare Pages) fronted by Cloudflare DNS and CDN."),
    h2("5.3 Infrastructure cost by traffic tier"),
    p("Table 2 gives indicative monthly infrastructure costs at three traffic tiers, at current published list prices (to be verified at purchase time). The client-side architecture is the main cost shield: infrastructure spend grows with page views served by the CDN, not with calculations performed."),
    tableCaption("Table 2: Indicative monthly infrastructure cost by traffic tier"),
    mkTable({
      headers: ["Tier", "Monthly sessions", "Stack at this tier", "Indicative cost (per month)"],
      rows: [
        ["Launch", "Under 100,000", "Vercel Pro, Neon/Supabase free tier, Cloudflare free, analytics", "$25 - $50"],
        ["Growth", "100,000 - 1 million", "Vercel Pro with usage overages, managed Postgres paid tier, Cloudflare free/pro", "$100 - $300"],
        ["Scale", "1 - 5 million", "Usage-based hosting (Vercel enterprise or Cloudflare Workers paid), dedicated Postgres, cache layer", "$500 - $1,500"],
      ],
      widths: [12, 20, 48, 20],
    }),
  ];
}

function section6() {
  return [
    h1("6. SEO and Traffic Growth Strategy"),
    h2("6.1 Keyword clusters by domain"),
    p("Utility tools win search when each tool page is the best answer for a specific high-intent query, and the domain-first structure adds the topical coherence that generic tool sites lack. Each domain maps to a cluster of head terms plus modifier patterns (formula, how to calculate, by country, by platform). Table 3 lists example clusters; exact volumes must be validated with a keyword research tool during Phase 0 and re-checked before each batch is built, so no figures are quoted here."),
    tableCaption("Table 3: Example keyword clusters and modifier patterns (volumes to be validated in Phase 0)"),
    mkTable({
      headers: ["Domain", "Example head terms", "Modifier patterns"],
      rows: [
        ["Finance & Accounting", "compound interest calculator, mortgage calculator, VAT calculator", "+ country, + loan type, formula, how to calculate"],
        ["Marketing & Growth", "marketing ROI calculator, customer lifetime value calculator, conversion rate calculator", "formula, benchmark, by industry, how to improve"],
        ["Advertising & Media Buying", "ROAS calculator, CPM calculator, CPC calculator, CTR calculator", "+ Google Ads, + Meta, formula, what is a good"],
        ["Business & E-commerce", "profit margin calculator, markup calculator, break-even calculator", "vs markup, formula, by product"],
        ["SEO & Website Management", "meta title generator, schema markup generator, robots.txt generator", "for WordPress, best practices, examples"],
        ["Everyday Utilities", "age calculator, date calculator, unit converter", "in months, between dates, specific conversions"],
      ],
      widths: [22, 42, 36],
    }),
    h2("6.2 Programmatic page patterns"),
    p("Four page patterns are generated from the registry and guide content. Tool pages are the primary assets and target the head terms. Formula explainers (a how-it-uses-the-math section on the same page, expanded for key tools) target informational queries such as how to calculate CAC without diluting the tool page across multiple URLs; where volume justifies it, a dedicated guide page is created instead. Comparison pages (markup versus margin, ROAS versus ROI) answer adjacent commercial queries and interlink both tools. Pillar guides per domain (for example, a guide to marketing metrics that embeds five tools) build the authority layer that search engines expect of a topical hub."),
    h2("6.3 Internal linking architecture"),
    p("Linking follows a strict hub-and-spoke model: domain hub to category to tool to related tools. Every tool links up to its parent category and domain, sideways to four to six related tools, and (where relevant) to its profession hub; every hub links down to everything beneath it. New tools therefore inherit internal links from established siblings on launch day, which accelerates indexation. This is only possible because the registry knows each tool's neighbours; the related-tools block is generated, not hand-maintained."),
    h2("6.4 Technical SEO checklist and measurement"),
    p("Technical fundamentals ship with the template: pre-rendered static pages (target LCP well under 2.5 seconds), WebApplication and FAQ schema generated from registry fields, an auto-generated XML sitemap per domain, canonical URLs, breadcrumbs, and clean keyword-bearing slugs. Measurement is part of the build plan rather than an afterthought: indexation coverage in Search Console is a phase gate (a batch is considered done when at least 85 percent of its pages are indexed), and per-domain counts of top-20 keywords and sessions per tool page are reviewed monthly to decide which clusters get the next batch of guides."),
  ];
}

module.exports = { execSummary, section1, section2, section3, section4, section5, section6 };
