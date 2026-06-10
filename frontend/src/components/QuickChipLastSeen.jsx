import React, { useState } from 'react';
import { IconClock, IconAlert } from './icons.jsx';

// Chip rapidi per inserire l'ultima volta visto bene senza tastiera.
// Calcola lastSeenWell come ISO datetime-local e onsetMinutes come minuti.
// Tutte le opzioni sono pensate per essere tappabili con guanti / una sola mano.

const CHIPS = [
  { min: 0,   label: 'Adesso',     desc: '0 min'  },
  { min: 15,  label: '15 min',     desc: ''       },
  { min: 30,  label: '30 min',     desc: ''       },
  { min: 60,  label: '1 ora',      desc: '60 min' },
  { min: 120, label: '2 ore',      desc: '120 min'},
  { min: 180, label: '3 ore',      desc: '180 min'},
  { min: 270, label: '4h e più',   desc: '270+ min'},
];

function toLocalDateTime(d) {
  // Genera la stringa per input datetime-local in fuso locale.
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  return `${y}-${M}-${D}T${h}:${m}`;
}

export default function QuickChipLastSeen({ value, onsetMinutes, onChange }) {
  const [manual, setManual] = useState(false);

  // Trova il chip attualmente attivo (se onsetMinutes è esattamente uno dei valori)
  const om = Number(onsetMinutes);
  const activeChip = Number.isFinite(om) ? CHIPS.find((c) => c.min === om) : null;
  const unknown = onsetMinutes === '__unknown__';

  function pick(min) {
    const lastSeen = new Date(Date.now() - min * 60 * 1000);
    onChange({
      lastSeenWell: toLocalDateTime(lastSeen),
      onsetMinutes: String(min),
    });
  }

  function pickUnknown() {
    onChange({ lastSeenWell: '', onsetMinutes: '__unknown__' });
  }

  return (
    <div>
      <label className="label">Quando è stato visto bene l'ultima volta?</label>
      {!manual ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHIPS.map((c) => {
              const isActive = activeChip?.min === c.min;
              return (
                <button
                  key={c.min}
                  type="button"
                  onClick={() => pick(c.min)}
                  className={`min-h-[56px] rounded-xl border px-3 py-2 text-left transition ${
                    isActive
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-primary-100 bg-white text-primary-900 hover:border-accent hover:bg-accent-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 opacity-70" />
                    <span className="font-bold text-sm">{c.label}</span>
                  </div>
                  {c.desc && (
                    <div className={`text-[11px] mt-0.5 ${isActive ? 'text-white/80' : 'text-primary-700'}`}>
                      {c.desc} fa
                    </div>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={pickUnknown}
              className={`min-h-[56px] rounded-xl border px-3 py-2 text-left transition col-span-2 sm:col-span-2 ${
                unknown
                  ? 'border-warning bg-warning text-white shadow-sm'
                  : 'border-primary-100 bg-white text-primary-900 hover:border-warning hover:bg-warning-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <IconAlert className="w-3.5 h-3.5 opacity-70" />
                <span className="font-bold text-sm">Non noto / wake-up stroke</span>
              </div>
              <div className={`text-[11px] mt-0.5 ${unknown ? 'text-white/80' : 'text-primary-700'}`}>
                Aggiungerà un warning nella decisione
              </div>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setManual(true)}
            className="text-sm text-accent hover:underline"
          >
            Inserisci data e ora precise →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="datetime-local"
            className="input"
            value={value || ''}
            onChange={(e) => {
              const dt = e.target.value;
              const ms = dt ? new Date(dt).getTime() : null;
              const minutes = ms ? Math.max(0, Math.round((Date.now() - ms) / 60000)) : '';
              onChange({ lastSeenWell: dt, onsetMinutes: String(minutes) });
            }}
          />
          <button
            type="button"
            onClick={() => setManual(false)}
            className="text-sm text-accent hover:underline"
          >
            ← Torna ai chip rapidi
          </button>
        </div>
      )}
    </div>
  );
}
