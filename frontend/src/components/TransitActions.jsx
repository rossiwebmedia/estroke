import React, { useState } from 'react';
import { api, getRole } from '../lib/api.js';
import { IconAmbulance, IconHospital, IconCheck } from './icons.jsx';

// Bottoni "Ambulanza partita" e "Arrivato al centro" visibili all'Operatore 118
// (chi crea la valutazione) per aggiornare lo status in modo lineare:
//   created → in_transit → arrived → (poi review HUB chiude in confirmed/overridden)
export default function TransitActions({ evaluation, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const role = getRole();
  const status = evaluation?.status || 'created';
  const dest = evaluation?.effectiveDestination || evaluation?.result?.suggestedDestination;
  const timeline = evaluation?.transitTimeline || {};

  async function fire(action) {
    setBusy(true); setErr(null);
    try {
      const updated = await api.transitEvaluation(evaluation.id, { action, by: role });
      onUpdated?.(updated);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  // Operatore 118 (e Centrale Operativa per emergenza) può aggiornare il transit.
  const canTransit = role === 'Operatore 118' || role === 'Centrale Operativa';

  // Stato chiuso (confirmed/overridden) → mostro solo riepilogo timeline
  const closed = status === 'confirmed' || status === 'overridden';

  // Timeline come strip
  const steps = [
    { key: 'created',    icon: '📝', label: 'Creata',             at: evaluation.createdAt },
    { key: 'in_transit', icon: '🚑', label: 'Ambulanza partita',   at: timeline.dispatchedAt },
    { key: 'arrived',    icon: '🏥', label: 'Arrivato al centro',  at: timeline.arrivedAt },
  ];
  const reachedIdx =
    status === 'created' ? 0 :
    status === 'in_transit' ? 1 :
    status === 'arrived' || closed ? 2 : 0;

  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-widest text-primary-700 font-bold mb-2">
        Trasporto verso {dest}
      </div>

      <ol className="grid grid-cols-3 gap-2">
        {steps.map((s, i) => {
          const reached = i <= reachedIdx;
          return (
            <li key={s.key} className={`rounded-lg p-3 border ${
              reached ? 'bg-success-50 border-success-100 text-success' : 'bg-primary-50/30 border-primary-50 text-primary-700/60'
            }`}>
              <div className="text-xl">{s.icon}</div>
              <div className="font-bold text-sm mt-1">{s.label}</div>
              <div className="text-[10px] mt-0.5">
                {s.at ? new Date(s.at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </div>
            </li>
          );
        })}
      </ol>

      {err && <div className="mt-3 text-sm text-danger bg-danger-50 border border-danger-100 rounded p-2">{err}</div>}

      {canTransit && !closed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <button
            disabled={busy || status !== 'created'}
            onClick={() => fire('start_transit')}
            className="btn bg-accent text-white hover:opacity-90 disabled:opacity-40 min-h-[56px]"
          >
            <IconAmbulance className="w-5 h-5" /> Ambulanza partita
          </button>
          <button
            disabled={busy || status === 'arrived'}
            onClick={() => fire('mark_arrived')}
            className="btn bg-success text-white hover:opacity-90 disabled:opacity-40 min-h-[56px]"
          >
            <IconCheck className="w-5 h-5" /> Arrivato al centro
          </button>
        </div>
      )}
    </div>
  );
}
