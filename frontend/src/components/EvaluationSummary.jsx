import React from 'react';
import { SYMPTOM_FIELDS, decisionEngine } from '../lib/decisionEngine.js';
import { IconArrowRight, IconAlert } from './icons.jsx';

const destBadge = {
  HUB: 'bg-danger text-white',
  SPOKE: 'bg-success text-white',
  VALUTAZIONE_CLINICA: 'bg-warning text-white',
};

// Sezione riusabile con titolo, bottone "Modifica", e righe key-value.
function Section({ title, onEdit, children }) {
  return (
    <div className="card p-4 lg:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary-700">{title}</h3>
        <button onClick={onEdit} className="btn-ghost text-sm py-1.5 px-3">
          Modifica <IconArrowRight className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between py-1 text-sm gap-3 border-b border-primary-50/60 last:border-0">
      <span className="text-primary-700">{k}</span>
      <span className="font-semibold text-primary-900 text-right">{v ?? '—'}</span>
    </div>
  );
}

export default function EvaluationSummary({ data, onEditPaziente, onEditSintomi, onEditLogistica }) {
  // Calcolo l'anteprima coi numeri convertiti.
  const preview = decisionEngine({
    ...data,
    hubTimeMin: Number(data.hubTimeMin),
    hubDistanceKm: Number(data.hubDistanceKm),
    onsetMinutes: data.onsetMinutes === '' ? null : Number(data.onsetMinutes),
  });

  return (
    <div className="space-y-4">
      {/* Esito anticipato — la decisione finale resta del medico, ma l'operatore vede subito la proposta */}
      <div className={`rounded-2xl p-5 lg:p-6 shadow-card ${destBadge[preview.suggestedDestination]}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">Esito proposto</div>
            <div className="text-3xl font-extrabold mt-1">
              {preview.suggestedDestination.replace('_', ' ')}
            </div>
            <div className="text-sm opacity-90 mt-1 capitalize">
              Rischio: {preview.riskClass} · LVO: {preview.lvoEstimate}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest opacity-80">iStroke Score</div>
            <div className="text-5xl font-extrabold leading-none mt-1">{preview.score}</div>
          </div>
        </div>
        {preview.warnings?.length > 0 && (
          <div className="mt-4 bg-white/15 rounded-lg p-3 text-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold">
              <IconAlert className="w-4 h-4" /> Avvertenze
            </div>
            {preview.warnings.map((w, i) => <div key={i}>• {w}</div>)}
          </div>
        )}
      </div>

      <Section title="Paziente / Intervento" onEdit={onEditPaziente}>
        <Row k="ID paziente"           v={data.patientId || '—'} />
        <Row k="Età · Sesso"           v={`${data.age || '—'} anni · ${data.sex}`} />
        <Row k="Comune"                v={data.city || '—'} />
        <Row k="Esordio sintomi"       v={data.onsetMinutes !== '' ? `${data.onsetMinutes} min fa` : '—'} />
        <Row k="Ultima volta visto bene" v={data.lastSeenWell || '—'} />
      </Section>

      <Section title="Scala sintomi · iStroke" onEdit={onEditSintomi}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {SYMPTOM_FIELDS.map((f) => {
            const val = Number(data.symptoms?.[f.key]) || 0;
            const idx = f.options.indexOf(val);
            const lbl = idx >= 0 ? f.optionLabels[idx] : '—';
            return (
              <div key={f.key} className="flex justify-between py-1 text-sm gap-3 border-b border-primary-50/60">
                <span className="text-primary-700">
                  {f.label}{f.side ? <span className={`ml-1.5 text-[9px] font-extrabold uppercase tracking-widest px-1 py-0.5 rounded ${f.side === 'Sx' ? 'bg-accent-50 text-accent' : 'bg-warning-50 text-warning'}`}>{f.side}</span> : ''}
                </span>
                <span className="font-semibold text-primary-900 whitespace-nowrap">
                  {lbl} <span className="text-primary-700/70 font-normal">(+{val})</span>
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Logistica HUB / SPOKE" onEdit={onEditLogistica}>
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-primary-700/70 mb-1">HUB</div>
            <Row k="Tempo"    v={`${data.hubTimeMin || '—'} min`} />
            <Row k="Distanza" v={`${data.hubDistanceKm || '—'} km`} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-primary-700/70 mb-1">SPOKE</div>
            <Row k="Tempo"    v={`${data.spokeTimeMin || '—'} min`} />
            <Row k="Distanza" v={`${data.spokeDistanceKm || '—'} km`} />
          </div>
        </div>
      </Section>

      {data.notes?.trim() && (
        <Section title="Note dell'operatore" onEdit={onEditLogistica}>
          <p className="text-sm text-primary-900 whitespace-pre-wrap">{data.notes}</p>
        </Section>
      )}

      <div className="card p-4 text-sm bg-warning-50/40 border-warning-100 text-primary-900">
        <strong>Sei pronto a salvare?</strong> Controlla i dati qui sopra; al salvataggio la
        valutazione finirà nell'archivio con stato <em>in transito</em> in attesa di review
        del Medico HUB.
      </div>
    </div>
  );
}
