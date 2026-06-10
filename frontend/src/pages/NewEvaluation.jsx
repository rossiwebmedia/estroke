import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm.jsx';
import ScoreCalculator from '../components/ScoreCalculator.jsx';
import EvaluationSummary from '../components/EvaluationSummary.jsx';
import { SYMPTOM_FIELDS, decisionEngine } from '../lib/decisionEngine.js';
import { api, getRole } from '../lib/api.js';
import { can } from '../lib/roles.js';
import { IconArrowLeft, IconArrowRight, IconCheck } from '../components/icons.jsx';

// Ordine step: prima la valutazione clinica (paziente + sintomi),
// poi la logistica HUB/SPOKE.
const STEPS = ['Paziente', 'Scala sintomi', 'Logistica', 'Riepilogo'];

const emptySymptoms = Object.fromEntries(SYMPTOM_FIELDS.map((f) => [f.key, 0]));

const initial = {
  patientId: '',
  age: '',
  sex: 'M',
  city: '',
  onsetMinutes: '',
  lastSeenWell: '',
  hubTimeMin: '',
  hubDistanceKm: '',
  spokeTimeMin: '',
  spokeDistanceKm: '',
  symptoms: emptySymptoms,
  notes: '',
};

const destBadge = {
  HUB: 'bg-danger text-white',
  SPOKE: 'bg-success text-white',
  VALUTAZIONE_CLINICA: 'bg-warning text-white',
};

export default function NewEvaluation() {
  const [step, setStep] = useState(0);
  // Sub-step interno alla "Scala sintomi": indice del sintomo corrente (0..8).
  const [symptomStep, setSymptomStep] = useState(0);
  const [data, setData] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Guard di accesso: solo Operatore 118 può creare valutazioni.
  useEffect(() => {
    if (!can(getRole(), 'canCreate')) {
      navigate('/dashboard', {
        replace: true,
        state: { toast: 'La creazione di nuove valutazioni è riservata all\'Operatore 118.' },
      });
    }
  }, [navigate]);

  // Anteprima live (stesso engine del backend)
  const preview = useMemo(() => decisionEngine({
    ...data,
    hubTimeMin: Number(data.hubTimeMin),
    hubDistanceKm: Number(data.hubDistanceKm),
    onsetMinutes: Number(data.onsetMinutes),
  }), [data]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        ...data,
        age: Number(data.age),
        onsetMinutes: data.onsetMinutes === '' ? null : Number(data.onsetMinutes),
        hubTimeMin: Number(data.hubTimeMin),
        hubDistanceKm: Number(data.hubDistanceKm),
        spokeTimeMin: data.spokeTimeMin === '' ? null : Number(data.spokeTimeMin),
        spokeDistanceKm: data.spokeDistanceKm === '' ? null : Number(data.spokeDistanceKm),
        operatorRole: getRole() || 'Operatore 118',
        notes: data.notes?.trim() || '',
      };
      const created = await api.createEvaluation(body);
      navigate(`/evaluations/${created.id}`, { state: { justCreated: true } });
    } catch (e) {
      setError(e.message + (e.details ? `\n${e.details.join(' ')}` : ''));
    } finally {
      setSubmitting(false);
    }
  }

  const TOTAL_SYMPTOMS = SYMPTOM_FIELDS.length;

  function next() {
    // Dentro la Scala sintomi navighiamo un sintomo alla volta.
    if (step === 1 && symptomStep < TOTAL_SYMPTOMS - 1) {
      setSymptomStep(symptomStep + 1);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setSymptomStep(0); // entrando di nuovo nei sintomi, parti da 0
      return;
    }
    submit();
  }
  function back() {
    // Indietro dentro la Scala sintomi
    if (step === 1 && symptomStep > 0) {
      setSymptomStep(symptomStep - 1);
      return;
    }
    if (step > 0) {
      // se torno indietro dalla Logistica, riprendo l'ultimo sintomo
      const prev = step - 1;
      setStep(prev);
      if (prev === 1) setSymptomStep(TOTAL_SYMPTOMS - 1);
    }
  }

  const canProceed = (() => {
    if (step === 0) return data.age !== '' && Number(data.age) >= 0;
    if (step === 1) return true; // sintomi: tutti i campi hanno default 0
    if (step === 2) return data.hubTimeMin !== '' && data.hubDistanceKm !== '';
    return true;
  })();

  const isLastStep =
    step === STEPS.length - 1 ||
    // anche l'ultima schermata della Scala sintomi NON è l'ultima dell'intero form
    false;

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold text-primary-900 tracking-tight">Nuova valutazione</h1>
      <p className="text-primary-700 mt-1">Compila i 4 step. Il punteggio si aggiorna in tempo reale.</p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div className="space-y-4">
          <Stepper step={step} />
          {step === 0 && (
            <div className="card p-5 lg:p-6">
              <PatientForm value={data} onChange={setData} step="patient" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <SymptomProgress current={symptomStep} total={TOTAL_SYMPTOMS} />
              <ScoreCalculator
                value={data.symptoms}
                onChange={(symptoms) => setData({ ...data, symptoms })}
                singleIndex={symptomStep}
              />
            </div>
          )}

          {step === 2 && (
            <div className="card p-5 lg:p-6">
              <PatientForm value={data} onChange={setData} step="logistics" />
            </div>
          )}

          {step === 3 && (
            <EvaluationSummary
              data={data}
              onEditPaziente={()  => { setStep(0); setSymptomStep(0); }}
              onEditSintomi={()   => { setStep(1); setSymptomStep(0); }}
              onEditLogistica={() => { setStep(2); }}
            />
          )}

          {step === 2 && (
            <div className="card p-5">
              <label className="label">Note dell'operatore (opzionale)</label>
              <textarea
                className="input min-h-[100px]"
                maxLength={1000}
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
                placeholder="Es. paziente collaborante, deficit emisoma sx, PA 170/95, parente presente sul posto…"
              />
              <div className="text-[11px] text-primary-700/70 mt-1.5 text-right">
                {data.notes.length}/1000
              </div>
            </div>
          )}

          {error && <div className="card p-4 text-danger border-danger-100 whitespace-pre-wrap">{error}</div>}
          <div className="flex justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 0 && symptomStep === 0}
              className="btn-secondary disabled:opacity-40"
            >
              <IconArrowLeft /> Indietro
            </button>
            <button onClick={next} disabled={!canProceed || submitting} className="btn-primary disabled:opacity-60">
              {step === STEPS.length - 1 ? (
                submitting ? 'Salvataggio…' : (<><IconCheck /> Salva valutazione</>)
              ) : step === 1 && symptomStep < TOTAL_SYMPTOMS - 1 ? (
                <>Sintomo successivo <IconArrowRight /></>
              ) : step === 1 && symptomStep === TOTAL_SYMPTOMS - 1 ? (
                <>Vai alla logistica <IconArrowRight /></>
              ) : step === 2 ? (
                <>Vai al riepilogo <IconArrowRight /></>
              ) : (
                <>Avanti <IconArrowRight /></>
              )}
            </button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-4 h-fit space-y-4">
          <div className="card p-5">
            <div className="text-xs uppercase tracking-widest text-primary-700">Anteprima live</div>
            <div className="mt-2 text-5xl font-extrabold text-primary-900">{preview.score}</div>
            <div className="text-sm text-primary-700">iStroke Score Demo</div>

            <div className="mt-4">
              <div className="text-xs uppercase tracking-widest text-primary-700">Suggerimento</div>
              <span className={`badge mt-1 px-3 py-1.5 text-sm ${destBadge[preview.suggestedDestination]}`}>
                {preview.suggestedDestination.replace('_', ' ')}
              </span>
              <div className="mt-2 text-sm text-primary-700 capitalize">
                Rischio: <strong>{preview.riskClass}</strong>
              </div>
              <div className="text-sm text-primary-700">LVO stimata: <strong>{preview.lvoEstimate}</strong></div>
            </div>

            {preview.warnings.length > 0 && (
              <ul className="mt-3 text-xs text-warning bg-warning-50 rounded-lg p-3 space-y-1">
                {preview.warnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            )}
          </div>
          <div className="text-[11px] text-primary-700/70 leading-snug">
            Calcolo simulato e modificabile in <span className="font-mono">backend/src/lib/decisionEngine.js</span>.
            Non costituisce diagnosi medica.
          </div>
        </aside>
      </div>
    </div>
  );
}

function SymptomProgress({ current, total }) {
  const field = SYMPTOM_FIELDS[current];
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="card p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="text-xs uppercase tracking-widest text-primary-700 font-bold">
          Sintomo {current + 1} di {total}
        </div>
        <div className="text-xs text-primary-700/70 truncate">
          {field?.label}{field?.side ? ` · ${field.side}` : ''}
        </div>
      </div>
      <div className="h-2 bg-primary-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <ol className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {STEPS.map((s, i) => {
        const state = i < step ? 'done' : i === step ? 'active' : 'todo';
        return (
          <li key={s} className={`rounded-xl px-4 py-3 border ${
            state === 'active' ? 'bg-accent text-white border-accent' :
            state === 'done'   ? 'bg-success text-white border-success' :
                                 'bg-white text-primary-700 border-primary-100'
          }`}>
            <div className="text-[10px] uppercase tracking-widest opacity-80">Step {i + 1}</div>
            <div className="font-bold mt-0.5">{s}</div>
          </li>
        );
      })}
    </ol>
  );
}
