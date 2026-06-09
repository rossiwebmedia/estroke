import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BeFastQuiz from '../components/BeFastQuiz.jsx';
import EmergencyCallCard from '../components/EmergencyCallCard.jsx';
import { IconArrowLeft, IconBrain, IconAlert, IconArrowRight } from '../components/icons.jsx';

export default function PublicTriage() {
  // phase: 'intro' | 'quiz' | 'result'
  const [phase, setPhase] = useState('intro');
  const [outcome, setOutcome] = useState(null);

  function restart() {
    setOutcome(null);
    setPhase('intro');
  }

  return (
    <div className="min-h-full bg-surface">
      <header className="bg-white border-b border-primary-50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary">
          <IconArrowLeft /> Home
        </Link>
        <div className="flex items-center gap-2 text-primary">
          <IconBrain className="w-5 h-5 text-accent" />
          <span className="font-extrabold tracking-tight">E-STROKE</span>
        </div>
      </header>

      {phase === 'intro' && (
        <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
          <div className="rounded-2xl bg-warning-50 border border-warning-100 p-4 flex items-start gap-3 text-sm text-primary-900 mb-6">
            <IconAlert className="w-5 h-5 text-warning mt-0.5" />
            <div>
              Questo strumento <strong>non sostituisce una diagnosi medica</strong>.
              Se hai un dubbio, <strong>chiama subito il 118</strong>.
            </div>
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold text-primary-900 tracking-tight leading-tight">
            Stai sospettando un ictus?
          </h1>
          <p className="text-primary-700 mt-3 text-lg">
            Rispondi a <strong>5 domande in 30 secondi</strong> usando la scala internazionale
            <strong> BE-FAST</strong>. Non viene salvato nessun dato personale.
          </p>

          <div className="grid grid-cols-5 gap-2 mt-7">
            {[
              ['B', 'Equilibrio'],
              ['E', 'Vista'],
              ['F', 'Viso'],
              ['A', 'Braccia'],
              ['S', 'Parola'],
            ].map(([l, t]) => (
              <div key={l} className="rounded-xl bg-white border border-primary-50 p-3 text-center shadow-card">
                <div className="text-2xl font-extrabold text-accent">{l}</div>
                <div className="text-[11px] uppercase tracking-wider text-primary-700 mt-1">{t}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('quiz')}
            className="btn-primary w-full mt-8 py-5 text-xl"
          >
            Inizia il controllo <IconArrowRight />
          </button>

          <a
            href="tel:118"
            className="block text-center mt-4 text-danger font-bold underline underline-offset-2"
          >
            Se la situazione è già grave, chiama subito il 118
          </a>
        </div>
      )}

      {phase === 'quiz' && (
        <BeFastQuiz
          onComplete={(res) => {
            setOutcome(res);
            setPhase('result');
          }}
        />
      )}

      {phase === 'result' && outcome && (
        <EmergencyCallCard
          positives={outcome.positives}
          total={outcome.total}
          onRestart={restart}
        />
      )}

      <footer className="text-center text-xs text-primary-700/70 py-6 px-4 border-t border-primary-50 mt-8">
        <strong>Prototipo dimostrativo</strong> · non sostituisce diagnosi o cure mediche.
      </footer>
    </div>
  );
}
