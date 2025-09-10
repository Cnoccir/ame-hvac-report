import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { getReportData } from '../utils/getReportData';
import styles from '../styles/print.module.css';
import { getStaticMapUrl } from '../utils/staticMap';
import { ChartFigure } from '../components/print/ChartFigure';
import AmeLogo from '../components/AmeLogo';

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
      <section className={styles.section}>
        <h1>Executive Summary</h1>
        <p><strong>Customer:</strong> {meta.customer}</p>
        <p><strong>Period:</strong> {meta.periodLabel}</p>
        <p><strong>Generated:</strong> {new Date(meta.generatedAt).toLocaleString()}</p>
        <ul>
          <li>Schools: {kpis.schools}</li>
          <li>Total Visits: {kpis.visits}</li>
          <li>Labor Hours: {kpis.hours}</li>
          <li>Technicians: {kpis.technicians}</li>
        </ul>
      </section>
      <div className={styles.pageBreak} />

      {/* Section 2: Service Map (static image) */}
      <section className={styles.section}>
        <h2>Service Map</h2>
        <figure className={styles.figure}>
          {map.mapUrl ? (
            <img src={map.mapUrl} alt="Service Map (static)" style={{ width: '100%', height: 'auto' }} />
          ) : (
            <p>Center: {map.center[0].toFixed(3)}, {map.center[1].toFixed(3)} — Markers: {map.markers.length}</p>
          )}
          <figcaption>Marker color denotes service hours (blue → purple → red).</figcaption>
        </figure>
      </section>
      <div className={styles.pageBreak} />

      {/* Section 3: Service Metrics */}
      <section className={styles.section}>
        <h2>Service Metrics</h2>

        {/* Print-safe charts */}
        <ChartFigure title="Labor Hours by School" series={metrics.bySchool} kind="bar" />
        <ChartFigure title="Monthly Service Hours" series={metrics.byMonth} kind="line" />

        <h3>Hours by School</h3>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {metrics.bySchool.map((row) => (
              <tr key={row.school}>
                <td>{row.school}</td>
                <td>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Monthly Service Hours</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {metrics.byMonth.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>By Technician</h3>
        <table>
          <thead>
            <tr>
              <th>Technician</th>
              <th>Visits</th>
              <th>Hours</th>
              <th>Share %</th>
            </tr>
          </thead>
          <tbody>
            {metrics.byTech.map((row) => (
              <tr key={row.tech}>
                <td>{row.tech}</td>
                <td>{row.visits}</td>
                <td>{row.hours}</td>
                <td>{row.sharePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>By School (Detail)</h3>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Address</th>
              <th>Visits</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {metrics.bySchoolTable.map((row) => (
              <tr key={row.school}>
                <td>{row.school}</td>
                <td>{row.address || '-'}</td>
                <td>{row.visits}</td>
                <td>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className={styles.pageBreak} />

      {/* Section 4: Service Visit Timeline */}
      <section className={styles.section}>
        <h2>Service Visit Timeline</h2>
        {chunk(timeline.visits, 25).map((group, i) => (
          <div key={i} className={styles.card}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>School</th>
                  <th>Technician</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {group.map((v, idx) => (
                  <tr key={`${i}-${idx}`}>
                    <td>{v.date}</td>
                    <td>{v.school}</td>
                    <td>{v.tech}</td>
                    <td>{v.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {i < Math.ceil(timeline.visits.length / 25) - 1 && <div className={styles.pageBreak} />}
          </div>
        ))}
      </section>
      <div className={styles.pageBreak} />

      {/* Section 5: Issue Analysis */}
      <section className={styles.section}>
        <h2>Issue Analysis</h2>
        <h3>Totals</h3>
        <ul>
          <li>Schools: {issues.totals.schools}</li>
          <li>Total Issues: {issues.totals.issues}</li>
          <li>Critical Categories: {issues.totals.categories}</li>
        </ul>

        <h3>Issues by School</h3>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {issues.bySchool.map((row) => (
              <tr key={row.school}>
                <td>{row.school}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Critical Categories</h3>
        <ul>
          {issues.cards.map((c, idx) => (
            <li key={idx} className={styles.card}>
              <strong>{c.priority}:</strong> {c.title} — {c.impact}
              <br />
              <em>Recommendation:</em> {c.recommendation}
            </li>
          ))}
        </ul>
      </section>
      <div className={styles.pageBreak} />

      {/* Section 6: Inventory Summary */}
      <section className={styles.section}>
        <h2>Inventory Summary</h2>
        <ul>
          <li>Supervisors (JACE): {inventory.summary.jaces}</li>
          <li>BACnet Devices: {inventory.summary.bacnet}</li>
          <li>Total Points: {inventory.summary.points}</li>
          <li>Systems (Schools): {inventory.summary.systems}</li>
        </ul>

        <h3>Supervisors</h3>
        {chunk(inventory.jaceStatusTable, 20).map((group, gi) => (
          <div key={gi} className={styles.card}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IP</th>
                  <th>Model</th>
                  <th>Version</th>
                  <th>Health</th>
                  <th>Client Conn</th>
                </tr>
              </thead>
              <tbody>
                {group.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.ip}</td>
                    <td>{row.model}</td>
                    <td>{row.version}</td>
                    <td>{row.health}</td>
                    <td>{row.clientConn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {gi < Math.ceil(inventory.jaceStatusTable.length / 20) - 1 && <div className={styles.pageBreak} />}
          </div>
        ))}

        <h3>Devices & Points by Station</h3>
        <table>
          <thead>
            <tr>
              <th>Station</th>
              <th>Devices</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {inventory.bySchoolDevicesPoints.map((row, idx) => (
              <tr key={idx}>
                <td>{row.school}</td>
                <td>{row.devices}</td>
                <td>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className={styles.pageBreak} />

      {/* Section 7: Visit Logs */}
      <section className={styles.section}>
        <h2>Visit Logs</h2>
        {visitLogs.map((log, i) => (
          <div key={log.school} className={styles.card}>
            <h3>{i + 1}. {log.school}</h3>
            <p>Total Visits: {log.totalVisits} · Total Hours: {log.totalHours}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tech</th>
                  <th>Hours</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {log.entries.map((e, idx) => (
                  <tr key={idx}>
                    <td>{e.date}</td>
                    <td>{e.tech}</td>
                    <td>{e.hours}</td>
                    <td>
                      <ul>
                        {e.work.map((w, wi) => (
                          <li key={wi}>{w}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pageBreak} />
          </div>
        ))}
      </section>
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
