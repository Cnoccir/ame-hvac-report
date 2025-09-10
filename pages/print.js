import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { getReportData } from '../utils/getReportData';
import styles from '../styles/print.module.css';
import { getStaticMapUrl } from '../utils/staticMap';
import { ChartFigure } from '../components/print/ChartFigure';
import AmeLogo from '../components/AmeLogo';
import ExecutiveSummaryPrint from '../components/print/ExecutiveSummaryPrint';
import ServiceMapPrint from '../components/print/ServiceMapPrint';
import ServiceMetricsPrint from '../components/print/ServiceMetricsPrint';
import TimelinePrint from '../components/print/TimelinePrint';
import IssueAnalysisPrint from '../components/print/IssueAnalysisPrint';
import InventorySummaryPrint from '../components/print/InventorySummaryPrint';
import VisitLogsPrint from '../components/print/VisitLogsPrint';

// Small utility to chunk arrays for pagination
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function PrintPage({ data, pdfMode = false }) {
  const { meta, kpis, map, metrics, issues, inventory, timeline, visitLogs } = data;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for images and fonts before signaling ready (for Puppeteer)
    const waitImages = Array.from(document.images).map(img =>
      img.complete ? Promise.resolve() : new Promise(res => {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      })
    );
    const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([...waitImages, waitFonts]).then(() => {
      // allow a tick for layout
      requestAnimationFrame(() => setIsReady(true));
    });
  }, []);

  return (
    <main id="report-root" data-ready={isReady ? 'true' : 'false'} className={styles.printRoot}>
      <Head>
        <title>AME HVAC Report — {meta.periodLabel}</title>
      </Head>

      { !pdfMode && (
      <header className={styles.printHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AmeLogo size="small" />
          <strong>CLIFTON PUBLIC SCHOOLS HVAC ANALYSIS</strong>
        </div>
        <div>{meta.periodLabel}</div>
      </header>
      ) }

      { !pdfMode && (
      <footer className={styles.printFooter}>
        <div>AME Inc. • HVAC Service Report</div>
        <div>Generated {new Date(meta.generatedAt).toLocaleDateString()}</div>
      </footer>
      ) }

      {/* Section 1: Executive Summary */}
      <ExecutiveSummaryPrint meta={meta} kpis={kpis} summary={data.summary} />
      <div className={styles.pageBreak} />

      {/* Section 2: Service Map (static image) */}
      <ServiceMapPrint mapUrl={map.mapUrl} center={map.center} markers={map.markers} />
      <div className={styles.pageBreak} />

      {/* Section 3: Service Metrics */}
      <ServiceMetricsPrint metrics={metrics} />
      <div className={styles.pageBreak} />

      {/* Section 4: Service Visit Timeline */}
      <TimelinePrint timeline={timeline} />
      <div className={styles.pageBreak} />

      {/* Section 5: Issue Analysis */}
      <IssueAnalysisPrint issues={issues} />
      <div className={styles.pageBreak} />

      {/* Section 6: Inventory Summary */}
      <InventorySummaryPrint inventory={inventory} />
      <div className={styles.pageBreak} />

      {/* Section 7: Visit Logs */}
      <VisitLogsPrint visitLogs={visitLogs} />
    </main>
  );
}

export async function getServerSideProps({ query }) {
  const id = (query?.id && String(query.id)) || 'default';
  const data = await getReportData(id);
  const pdfMode = String(query?.pdf || '').toLowerCase() === '1' || String(query?.pdf || '').toLowerCase() === 'true';
  try {
    const url = getStaticMapUrl(data.map.center, data.map.markers);
    data.map.mapUrl = url;
  } catch (e) {
    // ignore
  }
  return { props: { data, pdfMode } };
}
