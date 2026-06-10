import { useEffect, useState } from 'react';
import { HOSPITALS, CITY_COORDINATES } from '../data/hospitals.js';
import { nearestHospitals, haversineKm } from './geo.js';

// Hook che, una volta sola, chiede la posizione dell'operatore al browser
// e suggerisce:
//   - il comune più vicino (dal dataset CITY_COORDINATES)
//   - il PIÙ vicino HUB e il PIÙ vicino SPOKE (dal dataset HOSPITALS)
//     con km in linea d'aria e stima minuti di guida
//
// Niente fallback rumoroso: in caso di permesso negato, ritorna { status: 'denied' }
// e il chiamante mantiene il comportamento manuale.
export function useOperatorGeolocation({ enabled = true } = {}) {
  const [state, setState] = useState({ status: 'idle' });

  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'unsupported' });
      return;
    }
    setState({ status: 'locating' });
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        const point = { lat: pos.coords.latitude, lon: pos.coords.longitude };

        // Comune più vicino
        const cityRanked = CITY_COORDINATES
          .map((c) => ({ ...c, distance: haversineKm(point, c) }))
          .sort((a, b) => a.distance - b.distance);
        const city = cityRanked[0] || null;

        // Suggerimento HUB / SPOKE (i 5 più vicini totali, ma poi separo per tipo)
        const all = nearestHospitals(point, HOSPITALS, HOSPITALS.length);
        const hub   = all.find((h) => h.type === 'HUB')   || null;
        const spoke = all.find((h) => h.type === 'SPOKE') || all.find((h) => h.type === 'PS') || null;

        setState({
          status: 'ok',
          point,
          city,
          hub,
          spoke,
        });
      },
      (err) => {
        if (cancelled) return;
        setState({
          status: err.code === 1 ? 'denied' : 'error',
          message: err.message || 'Errore di geolocalizzazione',
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
    return () => { cancelled = true; };
  }, [enabled]);

  return state;
}
