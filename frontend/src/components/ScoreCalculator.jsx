import React from 'react';
import { SYMPTOM_FIELDS } from '../lib/decisionEngine.js';

// Render di un singolo sintomo (card con descrizione + how-to + bottoni peso).
// Estratto come componente perché lo riusiamo sia nella modalità "tutti i 9 in
// scroll" (singleIndex non passato) sia nella modalità wizard (1 alla volta).
function SymptomCard({ field, selected, onSelect }) {
  return (
    <div className="card p-5 lg:p-6">
      <div className="flex items-baseline justify-between mb-2 gap-3">
        <div className="font-semibold text-primary-900 text-lg flex items-center gap-2">
          <span>{field.label}</span>
          {field.side && (
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded ${
              field.side === 'Sx' ? 'bg-accent-50 text-accent' : 'bg-warning-50 text-warning'
            }`}>
              {field.side}
            </span>
          )}
        </div>
        <div className="text-xs text-primary-700/70 whitespace-nowrap">peso: {field.options.join(' / ')}</div>
      </div>

      {field.description && (
        <p className="text-sm text-primary-700 leading-relaxed mb-2">
          {field.description}
        </p>
      )}

      {field.howTo && (
        <div className="rounded-lg bg-primary-50/60 border border-primary-50 px-3 py-2 mb-4 text-xs text-primary-700">
          <span className="font-bold uppercase tracking-wider text-primary mr-1">Come testare:</span>
          {field.howTo}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {field.options.map((opt, i) => {
          const isSelected = Number(selected) === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`px-3 py-4 min-h-[64px] rounded-lg border text-sm font-medium transition text-left ${
                isSelected
                  ? 'border-accent bg-accent text-white shadow-sm'
                  : 'border-primary-100 bg-white text-primary-900 hover:border-accent hover:bg-accent-50'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider opacity-80">
                {field.optionLabels[i]}
              </div>
              <div className="font-bold text-base mt-0.5">+{opt}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ScoreCalculator({ value, onChange, singleIndex }) {
  function setField(key, v) {
    onChange({ ...value, [key]: v });
  }

  // Modalità wizard: una sola card visibile, controllata da singleIndex.
  if (typeof singleIndex === 'number') {
    const field = SYMPTOM_FIELDS[singleIndex];
    if (!field) return null;
    return (
      <SymptomCard
        field={field}
        selected={value?.[field.key]}
        onSelect={(v) => setField(field.key, v)}
      />
    );
  }

  // Modalità classica (retro-compatibile): tutti i sintomi insieme.
  return (
    <div className="space-y-4">
      {SYMPTOM_FIELDS.map((f) => (
        <SymptomCard
          key={f.key}
          field={f}
          selected={value?.[f.key]}
          onSelect={(v) => setField(f.key, v)}
        />
      ))}
    </div>
  );
}
