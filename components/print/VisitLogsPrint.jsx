import React from 'react';
import styles from '../../styles/print.module.css';

function chunk(arr, size) { const out=[]; for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }

export default function VisitLogsPrint({ visitLogs }) {
  return (
    <section className={styles.section}>
      <h2>Visit Logs</h2>
      {visitLogs.map((log, i) => (
        <div key={log.school} className={styles.card}>
          <h3>{i + 1}. {log.school}</h3>
          <p>Total Visits: {log.totalVisits} · Total Hours: {log.totalHours}</p>
          {chunk(log.entries, 18).map((group, gi) => (
            <div key={gi}>
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
                  {group.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.date}</td>
                      <td>{e.tech}</td>
                      <td>{e.hours}</td>
                      <td>
                        <ul>
                          {(e.work || []).map((w, wi) => <li key={wi}>{w}</li>)}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gi < Math.ceil(log.entries.length / 18) - 1 && <div className={styles.pageBreak} />}
            </div>
          ))}
          <div className={styles.pageBreak} />
        </div>
      ))}
    </section>
  );
}

