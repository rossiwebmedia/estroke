import React from 'react';
import { IconPhone, IconAlert, IconCheck } from './icons.jsx';
import NearestHospitals from './NearestHospitals.jsx';

export default function EmergencyCallCard({ positives, total, onRestart }) {
  if (positives > 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-10">
        <div className="rounded-2xl bg-danger text-white p-6 lg:p-8 shadow-card">
          <div className="flex items-center gap-3">
            <IconAlert className="w-8 h-8" />
            <div className="text-xs uppercase tracking-widest opacity-80">Allerta</div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 leading-tight">
            Possibile ictus in corso.<br />Chiama subito il 118.
          </h2>
          <p className="mt-3 text-white/90 text-base">
            Hai segnalato {positives} sintomo{positives === 1 ? '' : 'i'} su {total} compatibili con un ictus.
            Non aspettare, non guidare la persona da sola in ospedale: chiama il 118 ora.
          </p>

          <a
            href="tel:118"
            className="mt-6 flex items-center justify-center gap-3 w-full rounded-2xl bg-white text-danger font-extrabold text-3xl px-6 py-6 shadow-card hover:scale-[1.01] active:scale-[0.99] transition"
          >
            <IconPhone className="w-9 h-9" />
            Chiama 118
          </a>

          <div className="mt-6 rounded-xl bg-white/10 p-4">
            <div className="flex items-center gap-2 text-white">
              <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-extrabold text-xl">T</span>
              <span className="font-bold">Time — il tempo conta</span>
            </div>
            <p className="text-white/90 text-sm mt-2 leading-relaxed">
              L'ictus si tratta meglio nelle prime <strong>4 ore</strong>. Ogni minuto perso significa
              circa <strong>1,9 milioni di neuroni in meno</strong>. <strong>Annota mentalmente l'orario in cui hai notato il primo sintomo</strong>:
              è l'informazione più importante per i sanitari.
            </p>
          </div>

          <NearestHospitals darkSurface />
        </div>

        <button onClick={onRestart} className="btn-secondary w-full mt-4">
          Ricomincia il controllo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 lg:py-10">
      <div className="rounded-2xl bg-warning-50 border-2 border-warning-100 text-primary-900 p-6 lg:p-8 shadow-card">
        <div className="flex items-center gap-3">
          <IconCheck className="w-8 h-8 text-warning" />
          <div className="text-xs uppercase tracking-widest text-warning">Esito</div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-extrabold mt-2 text-primary-900">
          Nessun sintomo tipico di ictus rilevato.
        </h2>
        <p className="mt-3 text-primary-700 text-base">
          Hai risposto "no" o "non so" a tutte le domande del BE-FAST. Questo non esclude completamente
          il problema: se i sintomi <strong>compaiono</strong> o <strong>peggiorano</strong>, oppure se hai
          un dubbio anche solo lieve, <strong>chiama subito il 118</strong>.
        </p>
        <a
          href="tel:118"
          className="mt-6 flex items-center justify-center gap-3 w-full rounded-xl bg-primary text-white font-bold text-xl px-6 py-5 hover:bg-primary-700 transition"
        >
          <IconPhone className="w-6 h-6" />
          In caso di dubbio: 118
        </a>

        <NearestHospitals />

        <button onClick={onRestart} className="btn-secondary w-full mt-4">
          Ricomincia il controllo
        </button>
      </div>
    </div>
  );
}
