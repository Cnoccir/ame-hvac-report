import React from 'react';
import styles from '../../styles/print.module.css';
import { ChartFigure } from './ChartFigure';

export default function ServiceMetricsPrint({ metrics }) {
  return (
    <section className={styles.section}>
      <h2>Service Metrics</h2>

      <ChartFigure title="Labor Hours by School" series={metrics.bySchool.map(d => ({ hours: d.hours }))} kind="bar" />
      <ChartFigure title="Monthly Service Hours" series={metrics.byMonth.map(d => ({ hours: d.hours }))} kind="line" />

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

      <h3>By School</h3>
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
  );
}

