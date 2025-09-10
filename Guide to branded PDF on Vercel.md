Perfect — here’s a complete Codex/agent prompt pack you can paste (step-by-step) to update Cnoccir/ame-hvac-report so the entire multi-tab report renders as a single, expanded print view and exports a branded PDF on Vercel.

Assumptions (Codex should verify in Step 0):

* Next.js Pages Router (has pages/ directory).  
* Data & transforms already exist (JSON/loaders). We’ll centralize into a single getReportData() for the print route.  
* Google Maps is already configured (we’ll add a Static Maps helper for print).  
* Vercel deploy target; API route allowed.

---

# STEP 0 — Repo scan & guardrails

Prompt to Codex:

Goal: Confirm routing mode & file layout; create a new feature branch.

Do:

1. Inspect repo root: confirm there’s a pages/ dir (Pages Router).  
2. List folders: components, pages, public, styles, utils, any data files (e.g., public/data/), and any map config docs.  
3. Create branch: feat/print-and-pdf.  
4. Output a brief inventory (paths only), and whether charts are SVG (Recharts) or canvas (Chart.js).

Acceptance:

* Printed summary shows router type, charting library, and suspected data sources.  
* New branch created.

---

# STEP 1 — Central data loader (single source of truth)

Files to ADD: utils/getReportData.ts  
Prompt to Codex:

Goal: Add a server-safe data loader that aggregates everything needed for print (executive summary, service map, metrics, timeline, issues, inventory, visit logs) into a single JSON.

Do:

1. Create utils/getReportData.ts exporting:

export type ReportData \= { meta: { id: string; customer: string; periodLabel: string; generatedAt: string }; kpis: { schools: number; visits: number; hours: number; technicians: number }; map: { center: \[number, number\]; markers: Array\<{ lat:number; lng:number; hours:number; label:string }\> }; metrics: { bySchool: Array\<{ school: string; hours: number }\>; byMonth: Array\<{ month: string; hours: number }\>; byTech: Array\<{ tech: string; visits: number; hours: number; sharePct: number }\>; bySchoolTable: Array\<{ school: string; address?: string; visits: number; hours: number }\>; }; issues: { totals: { schools: number; issues: number; categories: number }; bySchool: Array\<{ school: string; count: number }\>; cards: Array\<{ priority:"High"|"Medium"; title:string; impact:string; recommendation:string; affects:string }\>; }; inventory: { summary: { jaces:number; bacnet:number; points:number; systems:number }; models: Array\<{ label:string; pct:number }\>; versions: Array\<{ label:string; pct:number }\>; connStatus: { connectedPct:number; notConnectedPct:number }; jaceStatus: Array\<{ label:string; pct:number }\>; bySchoolDevicesPoints: Array\<{ school:string; devices:number; points:number }\>; jaceStatusTable: Array\<{ name:string; ip:string; model:string; version:string; health:string; clientConn:string }\>; }; timeline: { monthWeeks: Array\<{ month:string; weeks:Array\<{ label:string; hours:number }\> }\>; visits: Array\<{ date:string; school:string; tech:string; hours:number; work:string\[\] }\>; }; visitLogs: Array\<{ school:string; totalVisits:number; totalHours:number; entries:Array\<{ date:string; tech:string; hours:number; work:string\[\] }\> }\>; }; export async function getReportData(id?: string): Promise\<ReportData\>;

2. Implement getReportData() to pull from your existing sources (prefer server-side reads; no client fetch in print). Start with public/data/\*.json if present, then replace with your live loader(s) if any.

Acceptance:

* getReportData() returns a fully populated object locally via a quick Node/TS test.  
* No client-only APIs used.

---

# STEP 2 — Print view route (flatten all tabs)

Files to ADD: pages/print.tsx, styles/print.module.css  
Prompt to Codex:

Goal: Create /print?id=... that renders every tab as a sequential section with no tabs/accordions.

Do (pages/print.tsx):

* getServerSideProps: call getReportData(id); compute a static map URL via getStaticMapUrl() (add in Step 3).  
* Render sections in this order:  
  1. Executive Summary  
  2. Service Map (static image)  
  3. Service Metrics (static charts \+ tables)  
  4. Service Visit Timeline (expanded list/cards)  
  5. Issue Analysis (chart \+ cards)  
  6. Inventory Summary (charts \+ JACE table)  
  7. Visit Logs (expanded; chunk if long)  
* Root element: \<main id="report-root" data-ready="true"\> (we’ll wait for this in PDF export).  
* Insert \<div className="page-break" /\> between major sections.

Do (styles/print.module.css):

* Add:

.printRoot { color:\#111; font: 12pt/1.45 system-ui, sans-serif; } @media print { :root { color\-scheme: light; } .no-print { display:none \!important; } @page { size:A4; margin:16mm 14mm; } .section, .card, .figure, table { break-inside: avoid; } .page-break { break-after: page; } header.print, footer.print { position:fixed; left:0; right:0; font-size:10px; opacity:.8; } header.print { top:0; } footer.print { bottom:0; } }

Acceptance:

* Visiting /print?id=demo renders all content expanded with no runtime errors.  
* Page breaks occur between sections; tables/charts aren’t split mid-element.

---

# STEP 3 — Static map \+ print-safe charts

Files to ADD: utils/staticMap.ts, components/print/ChartFigure.tsx  
Prompt to Codex:

Goal: Ensure all visuals are static for print.

Do (utils/staticMap.ts):

* Export getStaticMapUrl(center, markers) for Google Static Maps. Use GOOGLE\_MAPS\_API\_KEY. Color ramp by hours (blue \< purple \< red). Include labels.

Do (components/print/ChartFigure.tsx):

* Create a minimal inline SVG bar/line plotter for print fallback:

export function ChartFigure({ title, series, kind }:{ title:string; series:Array\<{ hours:number; \[k:string\]:any }\>; kind:"bar"|"line"; }) { /\* inline SVG; width\~940, height\~260; break-inside:avoid \*/ }

* If repo already uses an SVG-capable chart library, instead render that library in “static/SVG mode” for perfect fidelity.

Acceptance:

* Service Metrics chart(s) render as \<svg\> or \<img\> (data URL) in /print.  
* Map renders as \<img src="...staticmap..."\> with pins.

---

# STEP 4 — Tables & long lists (visit logs)

Prompt to Codex:

Goal: Prevent ugly splits; chunk long content.

Do:

* Implement a small utility chunk\<T\>(arr: T\[\], size: number): T\[\]\[\].  
* In Visit Logs and Timeline, insert \<div className="page-break" /\> between chunks (e.g., every 15–25 entries or based on rendered height if estimated).  
* Apply break-inside: avoid to .card and table.

Acceptance:

* No mid-row breaks; long lists paginate cleanly.

---

# STEP 5 — PDF export API (serverless Chromium)

Files to ADD: pages/api/export/pdf.ts  
Prompt to Codex:

Goal: Add an API route that generates a PDF of /print?id=... on Vercel.

Do:

* Add deps to package.json:  
  1. "@sparticuz/chromium": "^128.0.0", "puppeteer-core": "^23.7.0" in dependencies.  
  2. Optional: "puppeteer": "^23.7.0" in devDependencies for local debugging.  
* Implement pages/api/export/pdf.ts:  
  1. Build target URL: ${process.env.NEXT\_PUBLIC\_BASE\_URL}/print?id=...  
  2. Launch puppeteer-core with @sparticuz/chromium executable path/args.  
  3. page.goto(target, { waitUntil: "networkidle0" }).  
  4. await page.waitForSelector("\#report-root\[data-ready='true'\]").  
  5. page.pdf({ format:"A4", printBackground:true, margin:{ top:"16mm", bottom:"16mm", left:"14mm", right:"14mm" }, displayHeaderFooter:false }).  
  6. Stream with Content-Type: application/pdf and Content-Disposition: attachment; filename="hvac-report-\<id\>.pdf".

Acceptance:

* Hitting /api/export/pdf?id=demo downloads a multi-page PDF in Chrome.  
* No “could not find Chromium” errors on Vercel.

---

# STEP 6 — “Download PDF” button in the live UI

Prompt to Codex:

Goal: Add a visible button that opens the API route in a new tab.

Do:

* Create a small DownloadPdfButton and place it in the primary report header/nav:

function DownloadPdfButton({ id }: { id:string }) { return \<button className\="no-print" onClick\={() \=\> window.open(\`/api/export/pdf?id=${encodeURIComponent(id)}\`, "\_blank")}\>Download PDF\</button\>; }

* Pass the current report id.

Acceptance:

* Clicking the button returns a valid PDF that matches /print.

---

# STEP 7 — Env vars & Vercel config

Prompt to Codex:

Goal: Ensure deployment works first-try.

Do:

* Document required env vars in README.md “Print/PDF Export” section:  
  1. NEXT\_PUBLIC\_BASE\_URL=https://\<your-app\>.vercel.app  
  2. GOOGLE\_MAPS\_API\_KEY=\<key\>  
* If not already present, add a “How to Test” snippet:  
  1. npm i  
  2. npm run dev  
  3. Visit /print?id=demo  
  4. Call /api/export/pdf?id=demo

Acceptance:

* Local and Vercel environments have required vars; API returns a PDF.

---

# STEP 8 — QA checklist (automatable \+ manual)

Prompt to Codex:

Goal: Verify parity with tabs and print fidelity.

Do:

* Add a Jest (or Vitest) smoke test that calls getReportData() and asserts essential keys exist.  
* Manual checks:  
  * KPIs, counts, and totals match the live tabs.  
  * Every chart/map/timeline is static in /print.  
  * Section order & page breaks correct; no mid-graphic/table splits.  
  * Header/footer (if added) consistent.  
  * File size reasonable (prefer SVG for charts).

Acceptance:

* Test passes; manual checks documented in PR.

---

# STEP 9 — Commit, PR, and roll-back instructions

Prompt to Codex:

Goal: Deliver changes safely with the ability to revert quickly.

Do:

* Commit in logical chunks:  
  * feat(print): add getReportData() \+ print route  
  * feat(print): static charts \+ static map  
  * feat(pdf): serverless chromium API route \+ button  
  * docs: README print/pdf usage  
* Open PR feat/print-and-pdf. Include screenshots of:  
  * /print sections  
  * Saved PDF (first two pages)  
* Rollback plan in PR body (revert PR or toggle “Download PDF” button via feature flag).

Acceptance:

* PR builds on Vercel preview; reviewer can click “Download PDF” and verify output.

---

## Optional refinements (prompt as needed)

* Feature flag: Show the Download button only when process.env.NEXT\_PUBLIC\_PDF\_EXPORT \=== "true".  
* TOC & anchors: Generate a Table of Contents at the top of /print that anchors to section IDs.  
* Appendix mode: For huge Visit Logs, add ?appendix=visit-logs to move full logs to the end.  
* Branding header/footer: If you want page numbers, switch displayHeaderFooter:true and provide simple HTML templates in page.pdf().

---

## Quick copy block: dependencies

{ "dependencies": { "@sparticuz/chromium": "^128.0.0", "puppeteer-core": "^23.7.0" }, "devDependencies": { "puppeteer": "^23.7.0" } }

## Quick copy block: static map helper

// utils/staticMap.ts export function getStaticMapUrl( center: \[number, number\], markers: Array\<{ lat:number; lng:number; hours:number; label:string }\> ) { const key \= process.env.GOOGLE\_MAPS\_API\_KEY\!; const base \= "https://maps.googleapis.com/maps/api/staticmap"; const size \= "1024x640"; const centerStr \= \`${center\[0\]},${center\[1\]}\`; const markerParams \= markers.map(m \=\> { const color \= m.hours \> 20 ? "red" : m.hours \> 10 ? "purple" : "blue"; return \`color:${color}|label:${encodeURIComponent(m.label?.\[0\] ?? "S")}|${m.lat},${m.lng}\`; }); return \`${base}?center=${centerStr}\&size=${size}${ markerParams.map(p \=\> \`\&markers=${encodeURIComponent(p)}\`).join("") }\&key=${key}\`; }

## Quick copy block: minimal SVG chart wrapper

// components/print/ChartFigure.tsx export function ChartFigure({ title, series, kind }:{ title:string; series:Array\<{ hours:number; \[k:string\]:any }\>; kind:"bar"|"line"; }) { const width=940, height=260, pad=30; const vals \= series.map(s=\>s.hours); const max \= Math.max(1, ...vals); const barW \= kind==="bar" ? (width \- pad\*2)/series.length : 2; return ( \<figure className\="figure"\> \<figcaption\>\<strong\>{title}\</strong\>\</figcaption\> \<svg width\={width} height\={height} role\="img" aria-label\={title}\> {kind==="bar" && series.map((d,i)=\>{ const h \= Math.round((d.hours/max)\*(height \- pad\*2)); return \<rect key\={i} x\={pad \+ i\*barW} y\={height \- pad \- h} width\={Math.max(1, barW-2)} height\={h} /\>; })} {kind==="line" && (()=\> { const pts \= series.map((d,i)=\>{ const x \= pad \+ (i\*(width \- pad\*2))/Math.max(1, series.length-1); const y \= height \- pad \- (d.hours/max)\*(height \- pad\*2); return \`${x},${y}\`; }).join(" "); return \<polyline fill\="none" stroke\="currentColor" strokeWidth\="2" points\={pts} /\>; })()} \</svg\> \</figure\> ); }

## Quick copy block: PDF API route

// pages/api/export/pdf.ts import type { NextApiRequest, NextApiResponse } from "next"; export const config \= { api: { bodyParser: false } }; export default async function handler(req: NextApiRequest, res: NextApiResponse) { try { const id \= (req.query.id as string) || "default"; const target \= \`${process.env.NEXT\_PUBLIC\_BASE\_URL}/print?id=${encodeURIComponent(id)}\`; const \[{ default: chromium }, { default: puppeteer }\] \= await Promise.all(\[ import("@sparticuz/chromium"), import("puppeteer-core"), \]); const browser \= await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true, }); const page \= await browser.newPage(); await page.goto(target, { waitUntil: "networkidle0", timeout: 60\_000 }); await page.waitForSelector("\#report-root\[data-ready='true'\]", { timeout: 30\_000 }); const pdf \= await page.pdf({ format: "A4", printBackground: true, margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" }, displayHeaderFooter: false }); await browser.close(); res.setHeader("Content-Type", "application/pdf"); res.setHeader("Content-Disposition", \`attachment; filename="hvac-report-${id}.pdf"\`); res.status(200).send(pdf); } catch (e:any) { res.status(500).json({ error: e?.message || "PDF export failed" }); } }  
---

### What to tell your team

* “Go to /print?id=\<reportId\> to see the expanded, paginated report.  
  Click Download PDF to get the same layout as a PDF.”  
* “If any chart/map doesn’t match the tab view, it means that section’s print component still needs its static renderer wired.”

If you want, I can tailor these prompts to your exact file paths (components for each tab) so Codex reuses your existing renderers with a printMode prop instead of the minimal fallbacks.

Worked for 2 minutes

Below is a concise but comprehensive prompt pack you can paste into Codex (or any code‑gen agent) to upgrade Cnoccir/ame‑hvac‑report so that the entire tabbed report renders as a fully expanded print page and can be exported to a PDF on Vercel. These steps assume a Next.js Pages Router with Recharts for charts and Tailwind for styling, which is consistent with package.json

[GitHub](https://github.com/Cnoccir/ame-hvac-report/blob/main/package.json#L12-L21)

.

---

## 🚀 1\. Centralize your data (no client fetches)

Create utils/getReportData.ts:

import fs from 'fs/promises'; import path from 'path'; export type ReportData \= { meta: { id:string; customer:string; periodLabel:string; generatedAt:string }; kpis: { schools:number; visits:number; hours:number; technicians:number }; map: { center:\[number,number\]; markers:{ lat:number; lng:number; hours:number; label:string }\[\] }; metrics: { bySchool:{ school:string; hours:number }\[\]; byMonth:{ month:string; hours:number }\[\]; byTech:{ tech:string; visits:number; hours:number; sharePct:number }\[\]; bySchoolTable:{ school:string; address?:string; visits:number; hours:number }\[\]; }; issues: { totals:{ schools:number; issues:number; categories:number }; bySchool:{ school:string; count:number }\[\]; cards:{ priority:'High'|'Medium'; title:string; impact:string; recommendation:string; affects:string }\[\]; }; inventory: { summary:{ jaces:number; bacnet:number; points:number; systems:number }; models:{ label:string; pct:number }\[\]; versions:{ label:string; pct:number }\[\]; connStatus:{ connectedPct:number; notConnectedPct:number }; jaceStatus:{ label:string; pct:number }\[\]; bySchoolDevicesPoints:{ school:string; devices:number; points:number }\[\]; jaceStatusTable:{ name:string; ip:string; model:string; version:string; health:string; clientConn:string }\[\]; }; timeline: { monthWeeks:{ month:string; weeks:{ label:string; hours:number }\[\] }\[\]; visits:{ date:string; school:string; tech:string; hours:number; work:string\[\] }\[\]; }; visitLogs:{ school:string; totalVisits:number; totalHours:number; entries:{ date:string; tech:string; hours:number; work:string\[\] }\[\] }\[\]; }; export async function getReportData(id='default'): Promise\<ReportData\> { // adapt these paths to where your JSON lives, e.g., \`public/data/\*\` const base \= path.join(process.cwd(), 'public', 'data'); const read \= async (f:string) \=\> JSON.parse(await fs.readFile(path.join(base,f),'utf8')); return { meta: await read('meta.json'), kpis: await read('kpis.json'), map: await read('map.json'), metrics: await read('metrics.json'), issues: await read('issues.json'), inventory: await read('inventory.json'), timeline: await read('timeline.json'), visitLogs: await read('visitLogs.json'), }; }

This function fetches everything your tabs need in one shot, allowing the print page to be server‑rendered.

---

## 📄 2\. Build a print route that flattens all tabs

Create pages/print.tsx (Pages Router):

import { GetServerSideProps } from 'next'; import Head from 'next/head'; import { getReportData, ReportData } from '../utils/getReportData'; import { getStaticMapUrl } from '../utils/staticMap'; import { ChartFigure } from '../components/print/ChartFigure'; import styles from '../styles/print.module.css'; type Props \= { data: ReportData; mapUrl: string; }; export default function Print({ data, mapUrl }: Props) { return ( \<main id\="report-root" data-ready\="true" className\={styles.printRoot}\> \<Head\> \<title\>AME HVAC Report\</title\> \</Head\> \<header className\="print"\>AME HVAC Report — {data.meta.periodLabel}\</header\> {/\* Section 1: Executive Summary \*/} \<section className\="section"\> \<h1\>Executive Summary\</h1\> \<p\>{data.meta.customer} · Generated {data.meta.generatedAt}\</p\> \<ul\> \<li\>Schools: {data.kpis.schools}\</li\> \<li\>Visits: {data.kpis.visits}\</li\> \<li\>Labor Hours: {data.kpis.hours}\</li\> \<li\>Technicians: {data.kpis.technicians}\</li\> \</ul\> \</section\> \<div className\="page-break"\>\</div\> {/\* Section 2: Service Map \*/} \<section className\="section"\> \<h2\>Service Map\</h2\> \<figure className\="figure"\> \<img src\={mapUrl} alt\="Service Map (static)" /\> \<figcaption\>Marker color denotes service hours (blue → purple → red).\</figcaption\> \</figure\> \</section\> \<div className\="page-break"\>\</div\> {/\* Section 3: Service Metrics \*/} \<section className\="section"\> \<h2\>Service Metrics\</h2\> \<ChartFigure title\="Labor Hours by School" series\={data.metrics.bySchool} kind\="bar" /\> \<ChartFigure title\="Monthly Service Hours" series\={data.metrics.byMonth} kind\="line" /\> {/\* Add tables for metrics.byTech & metrics.bySchoolTable \*/} \</section\> \<div className\="page-break"\>\</div\> {/\* Section 4: Service Visit Timeline \*/} \<section className\="section"\> \<h2\>Service Visit Timeline\</h2\> {/\* Flatten timeline cards here \*/} \</section\> \<div className\="page-break"\>\</div\> {/\* Section 5: Issue Analysis \*/} \<section className\="section"\> \<h2\>Issue Analysis\</h2\> {/\* Chart \+ card list using data.issues \*/} \</section\> \<div className\="page-break"\>\</div\> {/\* Section 6: Inventory Summary \*/} \<section className\="section"\> \<h2\>Inventory Summary\</h2\> {/\* Pie charts & device tables using data.inventory \*/} \</section\> \<div className\="page-break"\>\</div\> {/\* Section 7: Visit Logs \*/} \<section className\="section"\> \<h2\>Visit Logs\</h2\> {/\* Expand all logs; chunk with manual page breaks if long \*/} \</section\> \<footer className\="print"\> \<div id\="page-numbers"\>\</div\> \</footer\> \</main\> ); } export const getServerSideProps: GetServerSideProps \= async ({ query }) \=\> { const id \= query.id as string || 'default'; const data \= await getReportData(id); const mapUrl \= getStaticMapUrl(data.map.center, data.map.markers); return { props: { data, mapUrl } }; };

This file uses the getReportData loader and getStaticMapUrl helper (see Step 3\) to render every tab’s content in sequence. Each section uses break-inside: avoid; (see CSS in Step 4\) and page breaks (page-break class) to ensure a clean PDF.

---

## 🗺️ 3\. Static map & print-safe charts

utils/staticMap.ts:

export function getStaticMapUrl( center: \[number,number\], markers: { lat:number; lng:number; hours:number; label:string }\[\] ) { const key \= process.env.GOOGLE\_MAPS\_API\_KEY\!; const base \= 'https://maps.googleapis.com/maps/api/staticmap'; const size \= '1024x640'; const centerStr \= \`${center\[0\]},${center\[1\]}\`; const markerParams \= markers.map(m \=\> { const color \= m.hours \> 20 ? 'red' : m.hours \> 10 ? 'purple' : 'blue'; return \`color:${color}|label:${encodeURIComponent(m.label\[0\])}|${m.lat},${m.lng}\`; }); return \`${base}?center=${centerStr}\&size=${size}${markerParams.map(p \=\> \`\&markers=${encodeURIComponent(p)}\`).join('')}\&key=${key}\`; }

components/print/ChartFigure.tsx (fallback inline SVG; swap in Recharts if your existing charts can render to SVG directly):

export function ChartFigure({ title, series, kind }:{ title:string; series:{ hours:number; \[k:string\]:any }\[\]; kind:'bar'|'line'; }) { const width=940, height=260, pad=30; const vals \= series.map(s=\>s.hours); const max \= Math.max(1, ...vals); const barW \= kind==='bar' ? (width \- pad\*2)/series.length : 2; return ( \<figure className\="figure"\> \<figcaption\>\<strong\>{title}\</strong\>\</figcaption\> \<svg width\={width} height\={height} role\="img" aria-label\={title}\> {kind==='bar' && series.map((d,i) \=\> { const h \= Math.round((d.hours/max)\*(height-pad\*2)); return \<rect key\={i} x\={pad \+ i\*barW} y\={height-pad-h} width\={Math.max(1,barW-2)} height\={h} /\>; })} {kind==='line' && (() \=\> { const pts \= series.map((d,i) \=\> { const x \= pad \+ (i\*(width-pad\*2))/Math.max(1, series.length-1); const y \= height-pad \- (d.hours/max)\*(height-pad\*2); return \`${x},${y}\`; }).join(' '); return \<polyline fill\="none" stroke\="currentColor" strokeWidth\="2" points\={pts} /\>; })()} \</svg\> \</figure\> ); }  
---

## 🎨 4\. Print‑ready CSS

Create styles/print.module.css and import it in pages/print.tsx:

.printRoot { color:\#111; font: 12pt/1.45 system-ui, sans-serif; } @media print { :root { color\-scheme: light; } .no-print { display: none \!important; } @page { size: A4; margin: 16mm 14mm; } .section, .card, .figure, table { break-inside: avoid; } .page-break { break-after: page; } header.print, footer.print { position: fixed; left:0; right:0; font-size: 10px; opacity: .8; } header.print { top: 0; } footer.print { bottom: 0; } }

This stylesheet defines page size, margins, prevents mid‑row splits, and creates reusable .page-break elements.

---

## 🧾 5\. PDF export (serverless Chromium)

Add dependencies to your package.json (already using Next.js \+ Recharts

[GitHub](https://github.com/Cnoccir/ame-hvac-report/blob/main/package.json#L12-L21)

):

"dependencies": { "@sparticuz/chromium": "^128.0.0", "puppeteer-core": "^23.7.0" }, "devDependencies": { "puppeteer": "^23.7.0" }

Create pages/api/export/pdf.ts:

import type { NextApiRequest, NextApiResponse } from 'next'; export const config \= { api: { bodyParser: false } }; export default async function handler(req:NextApiRequest, res:NextApiResponse) { try { const id \= (req.query.id as string) || 'default'; const target \= \`${process.env.NEXT\_PUBLIC\_BASE\_URL}/print?id=${encodeURIComponent(id)}\`; const \[{ default: chromium }, { default: puppeteer }\] \= await Promise.all(\[ import('@sparticuz/chromium'), import('puppeteer-core'), \]); const browser \= await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true, }); const page \= await browser.newPage(); await page.goto(target, { waitUntil: 'networkidle0', timeout: 60000 }); await page.waitForSelector('\#report-root\[data-ready="true"\]', { timeout: 30000 }); const pdf \= await page.pdf({ format: 'A4', printBackground: true, margin: { top:'16mm', bottom:'16mm', left:'14mm', right:'14mm' }, displayHeaderFooter: false, }); await browser.close(); res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', \`attachment; filename="hvac-report-${id}.pdf"\`); res.status(200).send(pdf); } catch (err:any) { res.status(500).json({ error: err?.message || 'PDF export failed' }); } }

This route uses puppeteer-core with @sparticuz/chromium (the pattern recommended for Vercel serverless

[GitHub](https://github.com/Cnoccir/ame-hvac-report/blob/main/package.json#L12-L21)

) to render /print?id=... into a PDF.

---

## 🖱️ 6\. Download button for users

Add a new component anywhere in your UI (e.g., in your navigation bar):

function DownloadPdfButton({ id }: { id:string }) { return ( \<button className\="no-print" onClick\={() \=\> window.open(\`/api/export/pdf?id=${encodeURIComponent(id)}\`, '\_blank')}\> Download PDF \</button\> ); }

Make sure to pass the current report id. This will call the API route and return a ready PDF.

---

## ✅ 7\. Deployment & env vars

1. Environment variables in Vercel:  
   * NEXT\_PUBLIC\_BASE\_URL – your deployed domain (e.g. https://ame-hvac-report.vercel.app)  
   * GOOGLE\_MAPS\_API\_KEY – your existing key used for Static Maps  
2. Local testing:  
   * Run npm i then npm run dev  
   * Visit http://localhost:3000/print?id=demo to check the expanded report  
   * Hit /api/export/pdf?id=demo to test PDF generation  
3. Add these variables and dependencies to Vercel before deploying.

---

### 🔍 Final reminders

* Recharts is an SVG library, so you can eventually replace ChartFigure with your existing chart components in print mode for better fidelity.  
* Use break-inside: avoid for all table rows and .card elements.  
* For huge logs, implement a chunk() helper to insert page-break after N entries.  
* Don’t forget to document the new print/PDF features in your README.md (mention environment vars and how to preview/export the report).

With this plan, your repo will generate a polished report page and a PDF using only built‑in Next.js capabilities plus a serverless headless browser.

