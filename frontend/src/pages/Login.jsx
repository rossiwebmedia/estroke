import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconAmbulance, IconHospital, IconList, IconArrowLeft } from '../components/icons.jsx';
import { setRole } from '../lib/api.js';

const ROLES = [
  { name: 'Operatore 118',     desc: 'Equipaggio sul territorio. Compila il triage sul posto.', Icon: IconAmbulance, color: 'bg-accent text-white' },
  { name: 'Medico HUB',         desc: 'Riceve il paziente in centro HUB. Conferma indicazione.', Icon: IconHospital, color: 'bg-primary text-white' },
  { name: 'Centrale Operativa', desc: 'Coordina trasporto e destinazione.',                       Icon: IconList,     color: 'bg-success text-white' },
];

export default function Login() {
  const navigate = useNavigate();
  function choose(name) {
    setRole(name);
    navigate('/dashboard', { replace: true });
  }
  return (
    <div className="min-h-full bg-gradient-to-br from-primary via-primary-700 to-accent text-white">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 pt-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
          <IconArrowLeft /> Torna alla home
        </Link>
      </div>
      <main className="max-w-4xl mx-auto px-5 lg:px-8 pt-10 pb-16">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Seleziona il tuo ruolo</h1>
        <p className="text-white/80 mt-2">Demo: nessuna password, la sessione resta locale al tuo browser.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {ROLES.map(({ name, desc, Icon, color }) => (
            <button
              key={name}
              onClick={() => choose(name)}
              className="text-left rounded-2xl bg-white text-primary p-6 shadow-card hover:shadow-2xl transition"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-lg mt-4">{name}</div>
              <div className="text-sm text-primary-700 mt-1">{desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-10 text-xs text-white/60">
          Prototipo dimostrativo · non destinato all'uso clinico reale.
        </div>
      </main>
    </div>
  );
}
