import React from 'react';
import { IconPhone, IconHospital, IconAlert } from './icons.jsx';
import { CENTRALE_OPERATIVA, USING_TEST_NUMBERS, neurologistFor, telHref } from '../data/contacts.js';
import { OPERATOR_NETWORK } from '../data/hospitals.js';

// Chiamata diretta dal caso (richiesta cliente rev. 2):
// una volta che l'app ha proposto l'ospedale di riferimento, l'operatore deve
// poter chiamare con un tap la Centrale Operativa e/o il neurologo del centro.
//
// L'ospedale mostrato è quello coerente con la destinazione EFFETTIVA:
// se il Medico HUB corregge SPOKE → HUB, il bottone chiama il neurologo dell'HUB.
export default function CallActions({ evaluation }) {
  const input = evaluation?.input || {};
  const destination = evaluation?.effectiveDestination || evaluation?.result?.suggestedDestination;

  // Per VALUTAZIONE_CLINICA non c'è un centro deciso: si chiama la centrale.
  const isHub = destination === 'HUB';
  const storedId   = isHub ? input.hubHospitalId   : input.spokeHospitalId;
  const storedName = isHub ? input.hubHospitalName : input.spokeHospitalName;

  // Fallback: se la valutazione è stata creata senza geolocalizzazione, proponiamo
  // il primo centro della rete del tipo giusto invece di lasciare il vuoto.
  const fromNetwork = OPERATOR_NETWORK.find((h) => h.type === (isHub ? 'HUB' : 'SPOKE'));
  const hospitalId   = storedId   || (destination === 'VALUTAZIONE_CLINICA' ? '' : fromNetwork?.id   || '');
  const hospitalName = storedName || (destination === 'VALUTAZIONE_CLINICA' ? '' : fromNetwork?.name || '');
  const isGuess = !storedName && !!hospitalName;

  const neurologist = neurologistFor(hospitalId);

  return (
    <div className="card p-5 border-accent-50">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-700 font-bold">
            Chiamata diretta
          </div>
          <h2 className="text-lg font-bold text-primary-900 mt-1">
            Allerta il centro ricevente
          </h2>
        </div>
        {hospitalName && (
          <div className="flex items-center gap-2 text-sm bg-primary-50 rounded-lg px-3 py-2 text-primary-900">
            <IconHospital className="w-4 h-4 text-accent shrink-0" />
            <span>
              <span className="text-primary-700">Riferimento {destination}: </span>
              <strong>{hospitalName}</strong>
            </span>
          </div>
        )}
      </div>

      {destination === 'VALUTAZIONE_CLINICA' && (
        <div className="mt-3 text-sm bg-warning-50 border border-warning-100 rounded-lg p-3 text-primary-900">
          Destinazione ancora da definire: contatta la Centrale Operativa per la
          valutazione congiunta con il neurologo.
        </div>
      )}

      {isGuess && (
        <div className="mt-3 text-xs text-primary-700 bg-primary-50/60 border border-primary-50 rounded-lg p-2.5">
          Centro non registrato al momento della creazione (geolocalizzazione non
          disponibile): mostrato il centro {isHub ? 'HUB' : 'SPOKE'} predefinito della rete.
          Verifica con la Centrale prima di chiamare.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <a
          href={telHref(CENTRALE_OPERATIVA.number)}
          className="btn bg-danger text-white hover:opacity-90 min-h-[56px] text-base"
        >
          <IconPhone className="w-5 h-5" />
          Chiama la Centrale
        </a>
        {destination !== 'VALUTAZIONE_CLINICA' && (
          <a
            href={telHref(neurologist.number)}
            className="btn bg-accent text-white hover:opacity-90 min-h-[56px] text-base"
          >
            <IconPhone className="w-5 h-5" />
            Chiama il neurologo
          </a>
        )}
      </div>

      <div className="mt-3 text-xs text-primary-700 space-y-0.5">
        <div>
          <span className="font-semibold">{CENTRALE_OPERATIVA.label}:</span>{' '}
          <span className="font-mono">{CENTRALE_OPERATIVA.number}</span>
        </div>
        {destination !== 'VALUTAZIONE_CLINICA' && (
          <div>
            <span className="font-semibold">{neurologist.label}:</span>{' '}
            <span className="font-mono">{neurologist.number}</span>
          </div>
        )}
      </div>

      {USING_TEST_NUMBERS && (
        <div className="mt-3 flex items-start gap-2 text-xs text-warning bg-warning-50 border border-warning-100 rounded-lg p-2.5">
          <IconAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Numeri di prova.</strong> Tutti i tasti chiamano lo stesso recapito
            di test. I numeri reali di centrale e reperibili neurovascolari si
            impostano in <span className="font-mono">frontend/src/data/contacts.js</span>.
          </span>
        </div>
      )}
    </div>
  );
}
