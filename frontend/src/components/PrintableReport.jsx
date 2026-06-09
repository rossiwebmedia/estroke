import React from 'react';

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('it-IT');
}

const destLabel = {
  HUB: 'HUB — Centro neurovascolare',
  SPOKE: 'SPOKE — Centro di prossimità',
  VALUTAZIONE_CLINICA: 'Valutazione clinica necessaria',
};

export default function PrintableReport({ evaluation }) {
  if (!evaluation) return null;
  const { input, result, createdAt, id } = evaluation;
  return (
    <div className="max-w-3xl mx-auto bg-white text-primary-900 p-8 print:p-0">
      <header className="border-b-2 border-primary pb-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-3xl font-extrabold tracking-tight font-serif">E-STROKE</div>
          <div className="text-xs uppercase tracking-widest text-primary-700 mt-1">
            Early · Effective · Essential
          </div>
        </div>
        <div className="text-right text-sm text-primary-700">
          <div>Report ID: <span className="font-mono">{id}</span></div>
          <div>Data: {fmt(createdAt)}</div>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider text-primary-700 mb-2">
          Paziente / Intervento
        </h2>
        <Grid items={[
          ['ID paziente', input.patientId],
          ['Età', `${input.age ?? '—'} anni`],
          ['Sesso', input.sex],
          ['Luogo', input.city || '—'],
          ['Tempo dall\'esordio', input.onsetMinutes != null ? `${input.onsetMinutes} min` : '—'],
          ['Ultima volta visto bene', input.lastSeenWell || '—'],
          ['Operatore', input.operatorRole],
        ]} />
      </section>

      <section className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider text-primary-700 mb-2">
          Logistica
        </h2>
        <Grid items={[
          ['Tempo verso HUB',     `${input.hubTimeMin ?? '—'} min`],
          ['Distanza verso HUB',  `${input.hubDistanceKm ?? '—'} km`],
          ['Tempo verso SPOKE',   `${input.spokeTimeMin ?? '—'} min`],
          ['Distanza verso SPOKE',`${input.spokeDistanceKm ?? '—'} km`],
        ]} />
      </section>

      <section className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider text-primary-700 mb-2">
          Esito iStroke
        </h2>
        <div className="border-2 border-primary rounded-lg p-4">
          <Grid items={[
            ['iStroke Score', result.score],
            ['Fascia di rischio', result.riskClass],
            ['LVO stimata', result.lvoEstimate],
            ['Destinazione suggerita', destLabel[result.suggestedDestination] || result.suggestedDestination],
          ]} />
          <div className="mt-4 text-sm leading-relaxed">
            <div className="font-bold mb-1">Motivazione</div>
            <div>{result.rationale}</div>
          </div>
          {result.warnings?.length > 0 && (
            <div className="mt-3 text-sm">
              <div className="font-bold mb-1">Avvertenze</div>
              <ul className="list-disc list-inside space-y-1">
                {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      {input.notes && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase tracking-wider text-primary-700 mb-2">
            Note dell'operatore
          </h2>
          <div className="border border-primary-100 rounded-lg p-3 text-sm whitespace-pre-wrap">
            {input.notes}
          </div>
        </section>
      )}

      {evaluation.hubReview && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase tracking-wider text-primary-700 mb-2">
            Review del Medico HUB
          </h2>
          <div className="border border-primary-100 rounded-lg p-3 text-sm space-y-1">
            <Grid items={[
              ['Esito review', evaluation.hubReview.action === 'confirm' ? 'Destinazione confermata' : `Destinazione corretta in ${evaluation.hubReview.overrideTo}`],
              ['Operatore', evaluation.hubReview.by],
              ['Data review', new Date(evaluation.hubReview.reviewedAt).toLocaleString('it-IT')],
            ]} />
            {evaluation.hubReview.notes && (
              <div className="pt-2 whitespace-pre-wrap">
                <span className="font-bold">Note: </span>{evaluation.hubReview.notes}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="mt-8 pt-4 border-t border-primary-100 text-xs text-primary-700">
        <div className="font-bold mb-1">Disclaimer</div>
        <div>
          {result.disclaimer} Il presente documento è generato da un <strong>prototipo dimostrativo</strong>
          {' '}di E-STROKE, non destinato all'uso clinico reale. I pesi della scala e le regole di destinazione
          sono illustrativi e configurabili.
        </div>
      </footer>
    </div>
  );
}

function Grid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-primary-50 py-1">
          <span className="text-primary-700">{k}</span>
          <span className="font-semibold text-primary-900 text-right">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
