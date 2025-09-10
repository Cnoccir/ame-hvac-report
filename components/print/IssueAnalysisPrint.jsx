import React from 'react';
import styles from '../../styles/print.module.css';
import { ChartFigure } from './ChartFigure';

export default function IssueAnalysisPrint({ issues }) {
  const dist = (issues?.bySchool || []).map(d => ({ hours: d.count }));
  return (
    <section className={styles.section}>
      <h2>Issue Analysis</h2>
      <ChartFigure title="Issues by School" series={dist} kind="bar" />

      <div className={styles.card}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div><strong>{issues?.totals?.schools}</strong><div>Schools</div></div>
          <div><strong>{issues?.totals?.issues}</strong><div>Total Issues</div></div>
          <div><strong>{issues?.totals?.categories}</strong><div>Critical Categories</div></div>
        </div>
      </div>

      <h3>Critical Issues by Priority</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {(issues?.cards || []).map((c, i) => (
          <div key={i} className={styles.card}>
            <div><strong>{c.title}</strong> <span style={{ fontSize: '10px' }}>({c.priority})</span></div>
            <div style={{ marginTop: 6 }}>
              <div><strong>Impact:</strong> {c.impact}</div>
              <div><strong>Recommendation:</strong> {c.recommendation}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

