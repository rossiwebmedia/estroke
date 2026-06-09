import React from 'react';
import { SYMPTOM_FIELDS } from '../lib/decisionEngine.js';

export default function ScoreCalculator({ value, onChange }) {
  function setField(key, v) {
    onChange({ ...value, [key]: v });
  }
  return (
    <div className="space-y-4">
      {SYMPTOM_FIELDS.map((f) => (
        <div key={f.key} className="card p-4">
          <div className="flex items-baseline justify-between mb-3 gap-3">
            <div className="font-semibold text-primary-900 flex items-center gap-2">
              <span>{f.label}</span>
              {f.side && (
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  f.side === 'Sx' ? 'bg-accent-50 text-accent' : 'bg-warning-50 text-warning'
                }`}>
                  {f.side}
                </span>
              )}
            </div>
            <div className="text-xs text-primary-700/70">peso: {f.options.join(' / ')}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {f.options.map((opt, i) => {
              const selected = Number(value?.[f.key]) === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setField(f.key, opt)}
                  className={`px-3 py-3 rounded-lg border text-sm font-medium transition text-left ${
                    selected
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-primary-100 bg-white text-primary-900 hover:border-accent hover:bg-accent-50'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider opacity-80">
                    {f.optionLabels[i]}
                  </div>
                  <div className="font-bold text-base mt-0.5">+{opt}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
