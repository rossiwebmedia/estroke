import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api, getRole } from '../lib/api.js';
import { can } from '../lib/roles.js';
import ResultCard from '../components/ResultCard.jsx';
import DecisionTimeline from '../components/DecisionTimeline.jsx';
import HubReviewActions from '../components/HubReviewActions.jsx';
import { IconPrinter, IconPlus, IconCheck } from '../components/icons.jsx';

export default function Result() {
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const justCreated = location.state?.justCreated;
  const role = getRole();

  useEffect(() => {
    api.getEvaluation(id).then(setEvaluation).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="card p-6 text-danger">{error}</div>;
  if (!evaluation) return <div className="card p-6 text-primary-700">Caricamento…</div>;

  const { input, result, createdAt, status = 'created', effectiveDestination } = evaluation;
  // Mostra come "esito ufficiale" la destinazione effettiva (che è quella suggerita
  // dall'algoritmo finché il Medico HUB non corregge).
  const displayedResult = {
    ...result,
    suggestedDestination: effectiveDestination || result.suggestedDestination,
  };

  return (
    <div className="space-y-6">
      {justCreated && (
        <div className="card border-success-100 bg-success-50 text-success p-3 flex items-center gap-2 text-sm">
          <IconCheck className="w-5 h-5" />
          Valutazione salvata nell'archivio.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-700">Esito valutazione</div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-primary-900 tracking-tight mt-1">
            {input.patientId}
          </h1>
          <div className="text-primary-700 text-sm mt-1">
            {new Date(createdAt).toLocaleString('it-IT')} · {input.operatorRole}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to={`/evaluations/${id}/report`} className="btn-secondary">
            <IconPrinter className="w-5 h-5" /> Stampa report
          </Link>
          {can(role, 'canCreate') && (
            <button onClick={() => navigate('/evaluations/new')} className="btn-primary">
              <IconPlus className="w-5 h-5" /> Nuova valutazione
            </button>
          )}
        </div>
      </div>

      <ResultCard result={displayedResult} />

      <HubReviewActions
        evaluation={evaluation}
        onUpdated={(updated) => setEvaluation(updated)}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm uppercase tracking-widest text-primary-700 font-bold mb-2">Motivazione</h2>
          <p className="text-primary-900 leading-relaxed">{result.rationale}</p>
          {result.warnings?.length > 0 && (
            <div className="mt-4 bg-warning-50 border border-warning-100 rounded-lg p-3 space-y-1.5 text-sm text-primary-900">
              <div className="font-bold text-warning uppercase text-xs tracking-widest">Avvertenze</div>
              {result.warnings.map((w, i) => <div key={i}>• {w}</div>)}
            </div>
          )}
          {input.notes && (
            <div className="mt-4 bg-primary-50/60 border border-primary-50 rounded-lg p-3 text-sm text-primary-900">
              <div className="font-bold text-primary-700 uppercase text-xs tracking-widest mb-1">
                Note dell'operatore ({input.operatorRole})
              </div>
              <div className="whitespace-pre-wrap">{input.notes}</div>
            </div>
          )}
          <div className="mt-4 text-xs text-primary-700/70 italic">{result.disclaimer}</div>
        </div>
        <div className="card p-5">
          <h2 className="text-sm uppercase tracking-widest text-primary-700 font-bold mb-3">Tempi e distanze</h2>
          <Row label="Tempo HUB"    value={`${input.hubTimeMin ?? '—'} min`} />
          <Row label="Distanza HUB" value={`${input.hubDistanceKm ?? '—'} km`} />
          <Row label="Tempo SPOKE"  value={`${input.spokeTimeMin ?? '—'} min`} />
          <Row label="Distanza SPOKE" value={`${input.spokeDistanceKm ?? '—'} km`} />
          <hr className="my-3 border-primary-50" />
          <Row label="Esordio sintomi" value={input.onsetMinutes != null ? `${input.onsetMinutes} min fa` : '—'} />
          <Row label="Ultima volta visto bene" value={input.lastSeenWell || '—'} />
        </div>
      </div>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-primary-700 font-bold mb-3">Percorso suggerito</h2>
        <DecisionTimeline destination={effectiveDestination || result.suggestedDestination} />
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-primary-700">{label}</span>
      <span className="font-semibold text-primary-900">{value}</span>
    </div>
  );
}
