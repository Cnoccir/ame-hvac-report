import React from 'react';
import styles from '../../styles/print.module.css';

function chunk(arr, size) { const out=[]; for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }

export default function InventorySummaryPrint({ inventory }) {
  const k = inventory.summary || {};
  return (
    <section className={styles.section}>
      <h2>Inventory Summary</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, margin: '8px 0 12px' }}>
        <div className={styles.card}><div><strong>{k.jaces}</strong></div><div>Supervisors (JACE)</div></div>
        <div className={styles.card}><div><strong>{k.bacnet}</strong></div><div>BACnet Devices</div></div>
        <div className={styles.card}><div><strong>{k.points}</strong></div><div>Total Points</div></div>
        <div className={styles.card}><div><strong>{k.systems}</strong></div><div>Systems (Schools)</div></div>
      </div>

      <h3>Supervisors</h3>
      {chunk(inventory.jaceStatusTable || [], 20).map((group, gi) => (
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
          {gi < Math.ceil((inventory.jaceStatusTable || []).length / 20) - 1 && <div className={styles.pageBreak} />}
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
          {(inventory.bySchoolDevicesPoints || []).map((row, idx) => (
            <tr key={idx}>
              <td>{row.school}</td>
              <td>{row.devices}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

