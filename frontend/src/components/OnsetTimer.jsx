import React, { useEffect, useState } from 'react';
import { IconClock, IconAlert } from './icons.jsx';

// Finestre cliniche:
// - < 180 min   : finestra trombolitica piena
// - 180-270 min : finestra in chiusura (ancora trombolisi possibile fino a 4.5h)
// - > 270 min   : fuori finestra trombolitica (resta finestra trombectomia fino 6-24h)

function classify(minutes) {
  if (minutes < 180)  return { tone: 'success', label: 'in finestra trombolitica',  short: 'in finestra' };
  if (minutes < 270)  return { tone: 'warning', label: 'finestra in chiusura',       short: 'in chiusura' };
  return { tone: 'danger', label: 'fuori finestra trombolitica', short: 'fuori finestra' };
}

const TONE_BG = {
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger:  'bg-danger text-white',
};

// Calcola "minuti dall'esordio" da uno qualsiasi di:
//   - onsetMinutes (numero, già passato come "min fa")
//   - lastSeenWell (ISO datetime-local)
// Aggiorna ogni 30s.
function elapsedMin(onsetMinutes, lastSeenWell, tick) {
  if (lastSeenWell) {
    const t = new Date(lastSeenWell).getTime();
    if (!Number.isFinite(t)) return null;
    const diff = (Date.now() - t) / 60000;
    return Math.max(0, Math.round(diff));
  }
  if (onsetMinutes !== '' && onsetMinutes != null && Number.isFinite(Number(onsetMinutes))) {
    return Number(onsetMinutes) + Math.floor((tick * 30) / 60);
  }
  return null;
}

function formatHHMM(min) {
  if (min == null) return '--:--';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function OnsetTimer({ onsetMinutes, lastSeenWell, sticky = false, compact = false }) {
  // tick aumenta ogni 30s per forzare il re-render (utile quando l'unica sorgente
  // è onsetMinutes — un numero statico — e vogliamo simulare il tempo che passa
  // dall'inserimento)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const min = elapsedMin(onsetMinutes, lastSeenWell, tick);
  const empty = min == null;
  const c = empty ? { tone: 'success', label: 'esordio non specificato', short: '—' } : classify(min);

  const wrapperBase = sticky
    ? 'sticky top-0 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 pt-2 pb-2 no-print'
    : '';

  return (
    <div className={wrapperBase}>
      <div className={`rounded-xl shadow-card ${TONE_BG[c.tone]} flex items-center gap-3 px-4 py-2.5`}>
        <div className="p-1.5 rounded-lg bg-white/20">
          {c.tone === 'danger' ? <IconAlert className="w-5 h-5" /> : <IconClock className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest opacity-90">Tempo dall'esordio</div>
          <div className="flex items-baseline gap-2">
            <div className={`font-extrabold leading-none ${compact ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
              {empty ? '—' : formatHHMM(min)}
            </div>
            {!empty && <div className="text-xs opacity-90">{min} min</div>}
          </div>
        </div>
        <div className="text-right text-xs font-semibold uppercase tracking-wider opacity-95 hidden sm:block">
          {c.label}
        </div>
        <div className="text-right text-[10px] font-semibold uppercase tracking-wider opacity-95 sm:hidden">
          {c.short}
        </div>
      </div>
    </div>
  );
}
