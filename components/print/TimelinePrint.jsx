import React from 'react';
import styles from '../../styles/print.module.css';

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TimelinePrint({ timeline }) {
  const rows = timeline.visits || [];
  const groups = chunk(rows, 25);
  return (
    <section className={styles.section}>
      <h2>Service Visit Timeline</h2>
      {groups.map((group, gi) => (
        <div key={gi} className={styles.card}>
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
                <tr key={`${gi}-${idx}`}>
                  <td>{v.date}</td>
                  <td>{v.school}</td>
                  <td>{v.tech}</td>
                  <td>{v.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {gi < groups.length - 1 && <div className={styles.pageBreak} />}
        </div>
      ))}
    </section>
  );
}

