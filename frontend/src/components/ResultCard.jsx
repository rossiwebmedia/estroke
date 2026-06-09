import React from 'react';
import { IconHospital, IconAmbulance, IconAlert } from './icons.jsx';

const destConfig = {
  HUB: {
    label: 'Destinazione suggerita: HUB',
    sub: 'Centro neurovascolare con trombectomia',
    cardClass: 'bg-danger text-white',
    Icon: IconHospital,
  },
  SPOKE: {
    label: 'Destinazione suggerita: SPOKE',
    sub: 'Centro di prossimità con trombolisi',
    cardClass: 'bg-success text-white',
    Icon: IconAmbulance,
  },
  VALUTAZIONE_CLINICA: {
    label: 'Valutazione clinica necessaria',
    sub: 'Contattare il neurologo di centrale',
    cardClass: 'bg-warning text-white',
    Icon: IconAlert,
  },
};

export default function ResultCard({ result }) {
  if (!result) return null;
  const cfg = destConfig[result.suggestedDestination] || destConfig.VALUTAZIONE_CLINICA;
  const { Icon } = cfg;
  return (
    <div className={`rounded-2xl shadow-card p-6 lg:p-8 ${cfg.cardClass}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/15">
            <Icon className="w-9 h-9" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">Esito</div>
            <h2 className="text-2xl lg:text-3xl font-extrabold mt-1">{cfg.label}</h2>
            <div className="text-white/80 text-sm mt-1">{cfg.sub}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest opacity-80">iStroke Score Demo</div>
          <div className="text-5xl font-extrabold mt-1 leading-none">{result.score}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Stat label="Fascia rischio" value={result.riskClass} />
        <Stat label="LVO stimata" value={result.lvoEstimate} />
        <Stat label="Score" value={result.score} />
        <Stat label="Decisione" value={result.suggestedDestination.replace('_', ' ')} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-lg px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest text-white/70">{label}</div>
      <div className="font-bold text-white mt-0.5 text-base capitalize">{value}</div>
    </div>
  );
}
