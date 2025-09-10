// Google Static Maps helper
// center: [lat, lng]
// markers: Array<{ lat, lng, hours, label }>
export function getStaticMapUrl(center, markers) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const base = 'https://maps.googleapis.com/maps/api/staticmap';
  const size = '1024x640';
  const centerStr = `${center[0]},${center[1]}`;
  const markerParams = (markers || []).map(m => {
    const color = m.hours > 20 ? 'red' : m.hours > 10 ? 'purple' : 'blue';
    const label = encodeURIComponent((m.label && String(m.label)[0]) || 'S');
    return `color:${color}|label:${label}|${m.lat},${m.lng}`;
  });
  const markersQuery = markerParams.map(p => `&markers=${encodeURIComponent(p)}`).join('');
  const keyParam = key ? `&key=${key}` : '';
  return `${base}?center=${centerStr}&size=${size}${markersQuery}${keyParam}`;
}
