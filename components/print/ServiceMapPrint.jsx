import React from 'react';
import styles from '../../styles/print.module.css';

export default function ServiceMapPrint({ mapUrl, center, markers }) {
  return (
    <section className={styles.section}>
      <h2>Service Map</h2>
      <figure className={styles.figure}>
        {mapUrl ? (
          <img src={mapUrl} alt="Service Map (static)" style={{ width: '100%', height: 'auto' }} />
        ) : (
          <p>Center: {center[0].toFixed(3)}, {center[1].toFixed(3)} — Markers: {markers.length}</p>
        )}
        <figcaption>
          Marker color denotes service hours (blue → purple → red).
        </figcaption>
      </figure>
    </section>
  );
}

