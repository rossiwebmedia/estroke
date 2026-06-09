import React from 'react';
import { Link } from 'react-router-dom';
import { IconBrain, IconPhone, IconArrowRight } from '../components/icons.jsx';

export default function Landing() {
  return (
    <div className="min-h-full bg-gradient-to-br from-primary via-primary-700 to-accent text-white flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-5 lg:px-8 pt-8 pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <IconBrain className="w-7 h-7 text-accent-100 shrink-0" />
          <span className="font-extrabold tracking-tight text-lg whitespace-nowrap">E-STROKE</span>
        </div>
        <Link to="/login" className="text-sm text-white/80 hover:text-white whitespace-nowrap">Accesso operatori →</Link>
      </div>

      <main className="flex-1 flex items-center">
        <div className="max-w-3xl w-full mx-auto px-5 lg:px-8 py-10 lg:py-16 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            E-STROKE
          </h1>
          <div className="mt-3 text-xl lg:text-2xl font-semibold text-accent-100">
            <span className="text-white">E</span>arly. <span className="text-white">E</span>ffective. <span className="text-white">E</span>ssential.
          </div>
          <p className="mt-6 text-lg lg:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Sospetti un ictus su te stesso o su un familiare? Fai subito il
            <strong> controllo rapido BE-FAST</strong>: 5 domande in 30 secondi
            per capire se è il caso di chiamare il 118.
          </p>

          <Link
            to="/triage"
            className="group mt-9 lg:mt-12 mx-auto max-w-xl rounded-2xl bg-danger text-white p-6 lg:p-7 shadow-card hover:shadow-2xl transition flex items-center gap-5 text-left"
          >
            <div className="p-3 rounded-xl bg-white/15 shrink-0">
              <IconPhone className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-white/80">Cittadini / familiari</div>
              <div className="text-2xl lg:text-3xl font-extrabold mt-1">Controllo rapido sintomi</div>
              <div className="text-white/85 mt-1 text-sm">
                Scala <strong>BE-FAST</strong> · 5 domande · 30 secondi
              </div>
            </div>
            <IconArrowRight className="w-6 h-6 text-white/70 group-hover:text-white shrink-0" />
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent-100" />
            An App for Brain. An App for LIFE.
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 text-center text-xs text-white/60 py-5 px-4">
        <strong className="text-white/80">Prototipo dimostrativo</strong> · non destinato all'uso clinico reale.
        Regole di calcolo illustrative e configurabili.
      </footer>
    </div>
  );
}
