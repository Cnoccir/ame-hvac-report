import { NextResponse } from 'next/server';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  try {
    const id = (req.query.id && String(req.query.id)) || 'default';
    const base = process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.host || 'localhost:3000'}`;
    const target = `${base}/print?id=${encodeURIComponent(id)}`;

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

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
      displayHeaderFooter: false,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="hvac-report-${id}.pdf"`);
    res.status(200).send(pdf);
  } catch (e) {
    res.status(500).json({ error: e?.message || 'PDF export failed' });
  }
}
