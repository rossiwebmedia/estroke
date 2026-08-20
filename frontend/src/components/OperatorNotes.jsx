import React from 'react';
import VoiceInputButton from './VoiceInputButton.jsx';

const MAX = 1000;

// Commento libero dell'operatore, con dettatura vocale.
// Estratto come componente perché ora è raggiungibile da più step del wizard
// (richiesta cliente rev. 2: "se fosse possibile scrivere commenti anche per
// l'operatore") — prima era disponibile solo nello step Logistica.
export default function OperatorNotes({ value = '', onChange, title = 'Commenti dell\'operatore' }) {
  function append(text) {
    const prev = value || '';
    const sep = prev && !prev.endsWith(' ') ? ' ' : '';
    onChange((prev + sep + text).slice(0, MAX));
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label className="label">{title} (opzionale)</label>
          <div className="text-xs text-primary-700/80 -mt-1 mb-2">
            Visibili al Medico HUB e riportati sul report stampabile.
          </div>
        </div>
        <VoiceInputButton onAppend={append} />
      </div>
      <textarea
        className="input min-h-[100px]"
        maxLength={MAX}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Es. paziente collaborante, deficit emisoma sx, PA 170/95, parente presente sul posto…"
      />
      <div className="text-[11px] text-primary-700/70 mt-1.5 text-right">
        {value.length}/{MAX}
      </div>
    </div>
  );
}
