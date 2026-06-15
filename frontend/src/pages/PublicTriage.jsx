import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BeFastQuiz from '../components/BeFastQuiz.jsx';
import EmergencyCallCard from '../components/EmergencyCallCard.jsx';
import { IconArrowLeft, IconBrain, IconAlert, IconArrowRight, IconPhone } from '../components/icons.jsx';

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

          <ul className="mt-7 space-y-2">
            {[
              ['B', 'Equilibrio', 'perso improvvisamente'],
              ['E', 'Vista',      'calo o sdoppiamento improvviso'],
              ['F', 'Viso',       'bocca o palpebra cadente'],
              ['A', 'Braccia',    'un braccio non si solleva'],
              ['S', 'Parola',     'difficoltà a parlare'],
            ].map(([l, t, hint]) => (
              <li key={l} className="rounded-xl bg-white border border-primary-50 px-4 py-3 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-accent-50 text-accent flex items-center justify-center text-3xl font-extrabold">
                  {l}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-primary-900">{t}</div>
                  <div className="text-xs text-primary-700">{hint}</div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setPhase('quiz')}
            className="btn-primary w-full mt-8 py-5 text-xl"
          >
            Inizia il controllo <IconArrowRight />
          </button>

          <a
            href="tel:118"
            className="mt-4 w-full rounded-xl bg-danger text-white font-extrabold text-lg px-5 py-4 flex items-center justify-center gap-3 shadow-card hover:opacity-95 active:scale-[0.99] transition"
          >
            <IconPhone className="w-6 h-6" />
            Chiama subito il 118
          </a>
          <div className="text-center text-xs text-primary-700 mt-2">
            Tocca il bottone per chiamare se la situazione è già grave.
          </div>
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
