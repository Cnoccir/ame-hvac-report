import { NextResponse } from 'next/server';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  try {
    const id = (req.query.id && String(req.query.id)) || 'default';
    const base = process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.host || 'localhost:3000'}`;
    const target = `${base}/print?id=${encodeURIComponent(id)}&pdf=1`;

    let browser;
    let page;

    const isVercel = !!process.env.VERCEL;
    if (isVercel) {
      const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
        import('@sparticuz/chromium'),
        import('puppeteer-core'),
      ]);
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
      page = await browser.newPage();
    } else {
      const { default: puppeteer } = await import('puppeteer');
      browser = await puppeteer.launch({ headless: true });
      page = await browser.newPage();
    }

    await page.goto(target, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector("#report-root[data-ready='true']", { timeout: 30000 });

    const today = new Date().toLocaleDateString();
    const headerHTML = `
      <style>
        .pdf-header { font-size:10px; color:#555; width:100%; padding:0 10mm; }
        .pdf-header .right { text-align:right; }
      </style>
      <div class="pdf-header">
        <div class="right">AME HVAC Report — ${id}</div>
      </div>`;

    const footerHTML = `
      <style>
        .pdf-footer{ font-size:10px; color:#555; width:100%; padding:0 10mm; display:flex; justify-content:space-between; }
        .pdf-footer .center{ text-align:center; flex:1; }
      </style>
      <div class="pdf-footer">
        <div>AME Inc.</div>
        <div class="center">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
        <div>${today}</div>
      </div>`;

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.6in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      displayHeaderFooter: true,
      headerTemplate: headerHTML,
      footerTemplate: footerHTML,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="hvac-report-${id}.pdf"`);
    res.status(200).send(pdf);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'PDF export failed' });
  }
}
