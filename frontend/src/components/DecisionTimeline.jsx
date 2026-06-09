import React from 'react';

const STEPS = [
  { title: 'Valutazione sul posto',    desc: 'Operatore 118 / equipe di soccorso' },
  { title: 'Calcolo iStroke',           desc: 'Scala sintomi semplificata' },
  { title: 'Invio verso centro',        desc: 'HUB o SPOKE' },
  { title: 'Presa in carico',           desc: 'Imaging e trattamento' },
];

const destColor = {
  HUB: 'bg-danger text-white border-danger',
  SPOKE: 'bg-success text-white border-success',
  VALUTAZIONE_CLINICA: 'bg-warning text-white border-warning',
};

export default function DecisionTimeline({ destination }) {
  const color = destColor[destination] || 'bg-accent text-white border-accent';
  return (
    <ol className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {STEPS.map((s, i) => {
        const isDestStep = i === 2;
        const cls = isDestStep ? color : 'bg-white text-primary border-primary-100';
        const dest = destination === 'HUB' ? 'HUB' : destination === 'SPOKE' ? 'SPOKE' : 'da valutare';
        return (
          <li key={i} className={`rounded-xl border p-4 ${cls} relative`}>
            <div className={`text-[10px] uppercase tracking-widest ${isDestStep ? 'text-white/80' : 'text-primary-700/60'}`}>
              Step {i + 1}
            </div>
            <div className="font-bold mt-1">{s.title}</div>
            <div className={`text-sm mt-1 ${isDestStep ? 'text-white/85' : 'text-primary-700'}`}>
              {isDestStep ? `Trasporto verso ${dest}` : s.desc}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
