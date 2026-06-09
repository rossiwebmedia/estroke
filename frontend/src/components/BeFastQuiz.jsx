import React, { useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconCheck } from './icons.jsx';

const QUESTIONS = [
  {
    letter: 'B',
    title: 'Equilibrio',
    question: 'La persona ha perso improvvisamente l\'equilibrio o ha difficoltà a stare in piedi?',
    hint: 'Vertigini intense improvvise, incapacità di camminare, cadute.',
    color: 'bg-accent',
  },
  {
    letter: 'E',
    title: 'Vista',
    question: 'Ha avuto un calo improvviso della vista, anche solo in un occhio, o vede doppio?',
    hint: 'Visione offuscata o assente in un occhio, immagini doppie.',
    color: 'bg-accent',
  },
  {
    letter: 'F',
    title: 'Viso',
    question: 'Quando sorride, un lato del viso resta immobile o cadente?',
    hint: 'Bocca storta, palpebra che cade, asimmetria del sorriso.',
    color: 'bg-accent',
  },
  {
    letter: 'A',
    title: 'Braccia',
    question: 'Riesce ad alzare entrambe le braccia? Una scende o non si muove?',
    hint: 'Chiedile di alzare le braccia per 10 secondi a occhi chiusi.',
    color: 'bg-accent',
  },
  {
    letter: 'S',
    title: 'Parola',
    question: 'Parla in modo confuso, biascica le parole o non riesce a parlare?',
    hint: 'Difficoltà a ripetere una frase semplice, parole assenti.',
    color: 'bg-accent',
  },
];

export default function BeFastQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = ((step) / total) * 100;

  function answer(value) {
    const next = { ...answers, [q.letter]: value };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      const positives = Object.values(next).filter((v) => v === 'yes').length;
      onComplete({ answers: next, positives, total });
    }
  }

  function back() {
    if (step === 0) return;
    setStep(step - 1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 lg:py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-primary-700 mb-2">
          <span className="font-semibold">Domanda {step + 1} di {total}</span>
          <span>BE-FAST</span>
        </div>
        <div className="h-2 bg-primary-50 rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 rounded-2xl ${q.color} text-white flex items-center justify-center text-3xl font-extrabold shadow-card`}>
            {q.letter}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary-700">{q.letter} — {q.title}</div>
            <div className="font-bold text-primary-900 text-lg mt-0.5">Controllo {q.title.toLowerCase()}</div>
          </div>
        </div>

        <p className="text-xl lg:text-2xl font-semibold text-primary-900 leading-snug">
          {q.question}
        </p>
        <p className="text-sm text-primary-700 mt-3">{q.hint}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
          <button
            onClick={() => answer('yes')}
            className="rounded-xl px-5 py-5 text-lg font-bold bg-danger text-white hover:opacity-95 transition shadow-card"
          >
            Sì
          </button>
          <button
            onClick={() => answer('no')}
            className="rounded-xl px-5 py-5 text-lg font-bold bg-success text-white hover:opacity-95 transition shadow-card"
          >
            No
          </button>
          <button
            onClick={() => answer('unknown')}
            className="rounded-xl px-5 py-5 text-lg font-bold bg-white text-primary border border-primary-100 hover:bg-primary-50 transition"
          >
            Non so
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="btn-ghost text-sm disabled:opacity-40"
          >
            <IconArrowLeft /> Indietro
          </button>
          <div className="text-xs text-primary-700">
            {Object.keys(answers).length}/{total} risposte
          </div>
        </div>
      </div>
    </div>
  );
}
