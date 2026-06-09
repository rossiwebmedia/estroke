import React, { useState } from 'react';
import { api, getRole } from '../lib/api.js';
import { can } from '../lib/roles.js';
import { IconCheck, IconAlert } from './icons.jsx';

// Mostra:
// - bottoni Conferma/Correggi al Medico HUB se lo status è 'created'
// - card riepilogativa della review a tutti i ruoli se lo status è confirmed/overridden
//
// Props:
//   evaluation: oggetto valutazione
//   onUpdated(updated): callback dopo PATCH
export default function HubReviewActions({ evaluation, onUpdated }) {
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideTo,   setOverrideTo]   = useState(
    evaluation?.result?.suggestedDestination === 'HUB' ? 'SPOKE' : 'HUB'
  );
  const [notes, setNotes] = useState('');
  const [confirmNotesOpen, setConfirmNotesOpen] = useState(false);

  const role        = getRole();
  const status      = evaluation?.status || 'created';
  const isOpen      = status === 'created';
  const isReviewer  = can(role, 'canReview');
  const review      = evaluation?.hubReview;
  const suggested   = evaluation?.result?.suggestedDestination;
  const effective   = evaluation?.effectiveDestination || suggested;

  async function send(action, extra = {}) {
    setBusy(true); setErr(null);
    try {
      const updated = await api.reviewEvaluation(evaluation.id, { action, by: role, ...extra });
      onUpdated?.(updated);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  // STATO 1 — la review è già stata fatta: mostra a tutti il riepilogo.
  if (!isOpen && review) {
    const isOverride = status === 'overridden';
    const tone = isOverride
      ? 'bg-warning-50 border-warning-100 text-warning'
      : 'bg-success-50 border-success-100 text-success';
    return (
      <div className={`card border ${tone} p-5`}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          {isOverride ? <IconAlert className="w-4 h-4" /> : <IconCheck className="w-4 h-4" />}
          Review HUB · {isOverride ? 'destinazione corretta' : 'destinazione confermata'}
        </div>
        <div className="text-primary-900 mt-2 text-sm leading-relaxed">
          {isOverride ? (
            <>
              Il <strong>{review.by}</strong> ha corretto la destinazione suggerita
              dall'algoritmo (<strong>{suggested}</strong>) in <strong>{effective}</strong>.
            </>
          ) : (
            <>Il <strong>{review.by}</strong> ha confermato la destinazione <strong>{effective}</strong>.</>
          )}
          {' '}
          <span className="text-primary-700">
            ({new Date(review.reviewedAt).toLocaleString('it-IT')})
          </span>
        </div>
        {review.notes && (
          <div className="mt-3 bg-white/60 border border-primary-50 rounded-lg p-3 text-sm text-primary-900">
            <div className="text-[10px] uppercase tracking-widest text-primary-700 font-bold mb-1">Note</div>
            {review.notes}
          </div>
        )}
      </div>
    );
  }

  // STATO 2 — la review è aperta ma chi guarda non è il Medico HUB: mostra solo informazione.
  if (isOpen && !isReviewer) {
    return (
      <div className="card border bg-accent-50 border-accent-50 text-accent p-4">
        <div className="text-xs uppercase tracking-widest font-bold">In transito</div>
        <div className="text-primary-900 mt-1 text-sm">
          La valutazione è in attesa di conferma da parte del Medico HUB.
        </div>
      </div>
    );
  }

  // STATO 3 — Medico HUB e review aperta: mostra i bottoni di azione.
  return (
    <div className="card border-accent-50 border p-5 lg:p-6">
      <div className="text-xs uppercase tracking-widest text-primary-700 font-bold">Azione richiesta</div>
      <h3 className="text-lg font-bold text-primary-900 mt-1">
        Conferma o correggi la destinazione suggerita
      </h3>
      <p className="text-sm text-primary-700 mt-1">
        L'algoritmo suggerisce <strong>{suggested}</strong>. Confermalo se l'indicazione clinica
        è coerente, oppure correggi in base alla rivalutazione al triage di accettazione.
      </p>

      {err && (
        <div className="mt-3 text-sm text-danger bg-danger-50 border border-danger-100 rounded p-2">{err}</div>
      )}

      {!overrideOpen && !confirmNotesOpen ? (
        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              disabled={busy}
              onClick={() => send('confirm')}
              className="btn bg-success text-white hover:opacity-90 disabled:opacity-50"
            >
              <IconCheck className="w-5 h-5" /> Conferma {suggested}
            </button>
            <button
              disabled={busy}
              onClick={() => setOverrideOpen(true)}
              className="btn bg-warning text-white hover:opacity-90 disabled:opacity-50"
            >
              <IconAlert className="w-5 h-5" /> Correggi destinazione
            </button>
          </div>
          <button
            onClick={() => setConfirmNotesOpen(true)}
            className="btn-ghost text-sm w-full"
          >
            + Aggiungi una nota e conferma
          </button>
        </div>
      ) : confirmNotesOpen ? (
        <div className="mt-4 space-y-3">
          <div>
            <label className="label">Nota clinica (opzionale)</label>
            <textarea
              className="input min-h-[100px]"
              maxLength={500}
              placeholder="Annotazioni del Medico HUB sulla conferma"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirmNotesOpen(false)} className="btn-ghost">Annulla</button>
            <button
              disabled={busy}
              onClick={() => send('confirm', { notes: notes.trim() || undefined })}
              className="btn bg-success text-white hover:opacity-90 disabled:opacity-50"
            >
              <IconCheck className="w-5 h-5" /> Conferma {suggested}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <label className="label">Nuova destinazione</label>
            <div className="grid grid-cols-2 gap-2">
              {['HUB', 'SPOKE'].map((d) => (
                <button
                  key={d}
                  onClick={() => setOverrideTo(d)}
                  className={`rounded-lg border px-3 py-3 font-bold ${
                    overrideTo === d
                      ? d === 'HUB' ? 'bg-danger text-white border-danger' : 'bg-success text-white border-success'
                      : 'bg-white text-primary border-primary-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Nota clinica (opzionale)</label>
            <textarea
              className="input min-h-[80px]"
              maxLength={500}
              placeholder="Motivazione del cambio destinazione"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOverrideOpen(false)} className="btn-ghost">Annulla</button>
            <button
              disabled={busy}
              onClick={() => send('override', { overrideTo, notes: notes.trim() || undefined })}
              className="btn-primary disabled:opacity-50"
            >
              Salva correzione
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
