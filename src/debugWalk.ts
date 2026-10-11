// Position source #2: tap the map and the dot walks there at walking pace. Test without leaving the desk.
// The walk starts where the device is (one GPS reading), like the real app; SUTD only when location is blocked, missing or too slow.
import type L from 'leaflet';
import { SUTD, WALK_SPEED, DEBUG_TICK_MS, DEBUG_ACCURACY, GPS_OPTIONS, PROBE_TIMEOUT_MS } from './config.ts';
import type { Fix } from './types.ts';

export function startDebugWalk(map: L.Map, where: () => Fix | null, onFix: (fix: Fix) => void, multiplier: number) {
  const speed = WALK_SPEED * (Math.abs(multiplier) || 1);
  let target: L.LatLng | null = null, last = performance.now(), started = false;
  const begin = (lat: number, lng: number) => { if (!started) { started = true; onFix({ lat, lng, accuracy: DEBUG_ACCURACY }); } };   // a rough reading still starts a clean walk
  const atSutd = () => begin(SUTD[0], SUTD[1]);
  if (!navigator.geolocation) atSutd();
  else {
    setTimeout(atSutd, PROBE_TIMEOUT_MS + 2000);       // some browsers never answer (a prompt left open): don't wait forever
    navigator.geolocation.getCurrentPosition((p) => begin(p.coords.latitude, p.coords.longitude), atSutd, { ...GPS_OPTIONS, timeout: PROBE_TIMEOUT_MS });
  }
  map.on('click', (e) => { target = e.latlng; });
  setInterval(() => {
    const now = performance.now(), dt = (now - last) / 1000; last = now;   // real elapsed time, so throttled tabs don't slow the walk
    const me = where();
    if (!target || !me) return;
    const d = map.distance(me, target), step = speed * dt;
    const f = d ? Math.min(1, step / d) : 1;
    onFix({ lat: me.lat + (target.lat - me.lat) * f, lng: me.lng + (target.lng - me.lng) * f, accuracy: DEBUG_ACCURACY });
    if (f === 1) target = null;
  }, DEBUG_TICK_MS);
}
