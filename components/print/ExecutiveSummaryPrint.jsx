import React from 'react';
import styles from '../../styles/print.module.css';

export default function ExecutiveSummaryPrint({ meta, kpis, summary }) {
  return (
    <section className={styles.section}>
      <h1>Executive Summary</h1>
      <p><strong>Customer:</strong> {meta.customer} · <strong>Period:</strong> {meta.periodLabel}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, margin: '8px 0 12px' }}>
        <div className={styles.card}><div><strong>{kpis.schools}</strong></div><div>Schools</div></div>
        <div className={styles.card}><div><strong>{kpis.visits}</strong></div><div>Visits</div></div>
        <div className={styles.card}><div><strong>{kpis.hours}</strong></div><div>Labor Hours</div></div>
        <div className={styles.card}><div><strong>{kpis.technicians}</strong></div><div>Technicians</div></div>
      </div>

      <h3>Key Findings</h3>
      <ul>
        {(summary?.keyFindings || []).map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <h3>Recommendations</h3>
      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(summary?.recommendations || []).map((r, i) => (
            <tr key={i}>
              <td>{r.issue}</td>
              <td>{r.priority}</td>
              <td>{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Most Serviced Locations</h3>
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
          {(summary?.mostServiced || []).map((s, i) => (
            <tr key={i}>
              <td>{s.school}</td>
              <td>{s.address}</td>
              <td>{s.visits}</td>
              <td>{s.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

