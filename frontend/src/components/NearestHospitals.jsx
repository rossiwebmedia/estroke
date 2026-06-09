import React, { useState } from 'react';
import { HOSPITALS, CITY_COORDINATES } from '../data/hospitals.js';
import { nearestHospitals } from '../lib/geo.js';
import { IconHospital, IconAmbulance, IconClock, IconAlert, IconArrowRight } from './icons.jsx';

// state: 'idle' | 'locating' | 'results' | 'manual' | 'error'

const TYPE_BADGE = {
  HUB:   { label: 'HUB',   className: 'bg-danger-50 text-danger',   icon: IconHospital  },
  SPOKE: { label: 'SPOKE', className: 'bg-success-50 text-success', icon: IconAmbulance },
  PS:    { label: 'PS',    className: 'bg-primary-50 text-primary', icon: IconHospital  },
};

export default function NearestHospitals({ darkSurface = false }) {
  const [state, setState] = useState('idle');
  const [hospitals, setHospitals] = useState([]);
  const [originLabel, setOriginLabel] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  function requestGeolocation() {
    if (!('geolocation' in navigator)) {
      setErrMsg('Geolocalizzazione non disponibile su questo dispositivo.');
      setState('error');
      return;
    }
    setState('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setHospitals(nearestHospitals(point, HOSPITALS, 5));
        setOriginLabel('la tua posizione');
        setState('results');
      },
      (err) => {
        setErrMsg(
          err.code === 1
            ? 'Permesso di posizione negato. Puoi inserire il tuo comune manualmente.'
            : 'Impossibile ottenere la posizione. Puoi inserire il tuo comune manualmente.'
        );
        setState('error');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }

  function useCity(city) {
    setHospitals(nearestHospitals({ lat: city.lat, lon: city.lon }, HOSPITALS, 5));
    setOriginLabel(city.name);
    setState('results');
  }

  function reset() {
    setHospitals([]);
    setErrMsg('');
    setCityQuery('');
    setState('idle');
  }

  const cityMatches = cityQuery.trim().length >= 2
    ? CITY_COORDINATES.filter((c) => c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())).slice(0, 6)
    : [];

  // Stile chiaro/scuro a seconda di dove è incastonato.
  const container = darkSurface
    ? 'bg-white/10 text-white border border-white/15'
    : 'bg-white text-primary-900 border border-primary-50';
  const titleClass = darkSurface ? 'text-white' : 'text-primary-900';
  const subClass   = darkSurface ? 'text-white/80' : 'text-primary-700';
  const muted      = darkSurface ? 'text-white/70' : 'text-primary-700/80';
  const ctaPrimary = darkSurface
    ? 'btn bg-white text-danger hover:bg-white/90'
    : 'btn-primary';
  const ctaGhost = darkSurface
    ? 'btn bg-transparent border border-white/30 text-white hover:bg-white/10'
    : 'btn-secondary';

  return (
    <div className={`mt-6 rounded-2xl p-5 lg:p-6 ${container}`}>
      <div className="flex items-center gap-2.5">
        <IconHospital className={`w-6 h-6 ${darkSurface ? 'text-white' : 'text-accent'}`} />
        <div>
          <div className={`text-xs uppercase tracking-widest ${subClass}`}>Ospedali nelle vicinanze</div>
          <div className={`font-bold ${titleClass}`}>Dove portare la persona</div>
        </div>
      </div>

      {state === 'idle' && (
        <div className="mt-4 space-y-3">
          <p className={`text-sm leading-relaxed ${subClass}`}>
            Posso mostrarti gli ospedali con stroke unit più vicini, con distanza e tempo stimato.
            <strong> Chiama comunque il 118 prima</strong>: ti indirizzerà al centro più appropriato.
          </p>
          <button onClick={requestGeolocation} className={`${ctaPrimary} w-full`}>
            Usa la mia posizione
          </button>
          <button onClick={() => setState('manual')} className={`${ctaGhost} w-full`}>
            Inserisci il tuo comune
          </button>
        </div>
      )}

      {state === 'locating' && (
        <div className={`mt-4 text-sm flex items-center gap-2 ${subClass}`}>
          <span className="inline-block w-3 h-3 rounded-full bg-current animate-pulse" />
          Acquisizione della posizione in corso…
        </div>
      )}

      {state === 'error' && (
        <div className="mt-4 space-y-3">
          <div className={`text-sm flex items-start gap-2 ${darkSurface ? 'text-white/95' : 'text-warning'}`}>
            <IconAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errMsg}</span>
          </div>
          <button onClick={() => setState('manual')} className={`${ctaPrimary} w-full`}>
            Inserisci il tuo comune
          </button>
        </div>
      )}

      {state === 'manual' && (
        <div className="mt-4 space-y-3">
          <label className={`block text-xs uppercase tracking-widest ${subClass}`}>
            Comune
          </label>
          <input
            autoFocus
            className={`w-full rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 ${
              darkSurface
                ? 'bg-white text-primary-900 focus:ring-white'
                : 'border border-primary-100 bg-white text-primary-900 focus:ring-accent'
            }`}
            placeholder="es. Catania, Palermo, Enna…"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
          {cityMatches.length > 0 && (
            <ul className={`rounded-lg overflow-hidden ${darkSurface ? 'bg-white/10' : 'border border-primary-50'}`}>
              {cityMatches.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => useCity(c)}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:opacity-90 ${
                      darkSurface ? 'text-white hover:bg-white/15' : 'text-primary-900 hover:bg-primary-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <IconArrowRight className="w-4 h-4 opacity-70" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cityQuery.trim().length >= 2 && cityMatches.length === 0 && (
            <div className={`text-xs ${muted}`}>Nessun comune trovato. Prova con il capoluogo più vicino.</div>
          )}
          <button onClick={reset} className={`${ctaGhost} w-full`}>Annulla</button>
        </div>
      )}

      {state === 'results' && (
        <div className="mt-4 space-y-3">
          <div className={`text-xs ${subClass}`}>
            Risultati ordinati per distanza da <strong>{originLabel}</strong>.
          </div>
          <ul className="space-y-2">
            {hospitals.map((h) => {
              const badge = TYPE_BADGE[h.type] || TYPE_BADGE.PS;
              return (
                <li
                  key={h.id}
                  className={`rounded-xl p-3.5 flex items-start gap-3 ${
                    darkSurface ? 'bg-white text-primary-900' : 'bg-surface'
                  }`}
                >
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider ${badge.className}`}>
                    {badge.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold leading-tight">{h.name}</div>
                    <div className="text-xs text-primary-700 mt-0.5">{h.city}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-primary-700">
                      <span className="inline-flex items-center gap-1">
                        <IconClock className="w-3.5 h-3.5" />
                        ~{h.driveMinutes} min
                      </span>
                      <span>·</span>
                      <span>{h.distanceKm.toLocaleString('it-IT')} km</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-accent whitespace-nowrap mt-1"
                  >
                    Mappa →
                  </a>
                </li>
              );
            })}
          </ul>
          <div className={`text-[11px] leading-snug ${muted}`}>
            Distanze in linea d'aria e tempi stimati senza considerare traffico/strade reali.
            Dati a scopo dimostrativo: <strong>chiama il 118</strong>, che ti indirizzerà al centro più appropriato.
          </div>
          <button onClick={reset} className={`${ctaGhost} w-full`}>Nuova ricerca</button>
        </div>
      )}
    </div>
  );
}
