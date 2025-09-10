import React from 'react';

// Minimal inline SVG chart for print-safe rendering
export function ChartFigure({ title, series, kind }) {
  const width = 940;
  const height = 260;
  const pad = 30;
  const vals = (series || []).map(s => Number(s.hours) || 0);
  const max = Math.max(1, ...vals);
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const barW = kind === 'bar' ? (innerW / Math.max(1, series.length)) : 2;

  return (
    <figure className="figure" style={{ marginBottom: 12 }}>
      <figcaption><strong>{title}</strong></figcaption>
      <svg width={width} height={height} role="img" aria-label={title}>
        {/* axes */}
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#999" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#999" strokeWidth="1" />
        {kind === 'bar' && series.map((d, i) => {
          const h = Math.round(((Number(d.hours) || 0) / max) * innerH);
          const x = pad + i * barW;
          const y = height - pad - h;
          const w = Math.max(1, barW - 2);
          return <rect key={i} x={x} y={y} width={w} height={h} fill="#1D0F5A" />;
        })}
        {kind === 'line' && (() => {
          const points = series.map((d, i) => {
            const x = pad + (i * innerW) / Math.max(1, series.length - 1);
            const y = height - pad - ((Number(d.hours) || 0) / max) * innerH;
            return `${x},${y}`;
          }).join(' ');
          return <polyline fill="none" stroke="#3A6EE8" strokeWidth="2" points={points} />;
        })()}
      </svg>
    </figure>
  );
}

