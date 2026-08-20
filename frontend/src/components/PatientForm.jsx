import React from 'react';
import QuickChipLastSeen from './QuickChipLastSeen.jsx';
import { ANTICOAGULANT_LABELS } from '../lib/decisionEngine.js';

// Gruppo di bottoni grandi (touch target 56px) per una scelta a 3 opzioni.
// Preferito al <select> dove le opzioni sono poche: un tap invece di due.
function ChoiceGroup({ label, hint, options, value, onSelect, tone = 'accent' }) {
  const activeClass = tone === 'warning'
    ? 'border-warning bg-warning text-white'
    : 'border-accent bg-accent text-white';
  return (
    <div>
      <label className="label">{label}</label>
      {hint && <div className="text-xs text-primary-700/80 -mt-1 mb-2">{hint}</div>}
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ key, text }) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`min-h-[56px] rounded-xl border px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? `${activeClass} shadow-sm`
                  : 'border-primary-100 bg-white text-primary-900 hover:border-accent hover:bg-accent-50'
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PatientForm({ value, onChange, step }) {
  function set(field, v) {
    onChange({ ...value, [field]: v });
  }
  function setMany(patch) {
    onChange({ ...value, ...patch });
  }

  // Compat: accetta sia gli interi storici (0, 1) che le nuove stringhe semantiche.
  const isPatient   = step === 0 || step === 'patient';
  const isLogistics = step === 1 || step === 'logistics';

  if (isPatient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">ID paziente / Codice intervento</label>
          <input
            className="input"
            value={value.patientId}
            onChange={(e) => set('patientId', e.target.value)}
            placeholder="es. INT-2026-0143"
          />
        </div>
        <div>
          <label className="label">Età (anni)</label>
          <input
            className="input"
            type="number" min="0" max="130"
            value={value.age}
            onChange={(e) => set('age', e.target.value)}
            placeholder="es. 72"
          />
        </div>
        <div>
          <label className="label">Sesso</label>
          <select
            className="input"
            value={value.sex}
            onChange={(e) => set('sex', e.target.value)}
          >
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="X">Non specificato</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Comune / luogo dell'intervento</label>
          <input
            className="input"
            value={value.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="es. Catania"
          />
        </div>
        <div className="md:col-span-2">
          <QuickChipLastSeen
            value={value.lastSeenWell}
            onsetMinutes={value.onsetMinutes}
            onChange={setMany}
          />
        </div>

        <div className="md:col-span-2 border-t border-primary-50 pt-4 mt-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-3">
            Anamnesi rapida
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Paziente in terapia anticoagulante</label>
              <select
                className="input"
                value={value.anticoagulant || 'NON_NOTO'}
                onChange={(e) => set('anticoagulant', e.target.value)}
              >
                <option value="NO">{ANTICOAGULANT_LABELS.NO}</option>
                <option value="NAO">{ANTICOAGULANT_LABELS.NAO}</option>
                <option value="TAO">{ANTICOAGULANT_LABELS.TAO}</option>
                <option value="NON_NOTO">{ANTICOAGULANT_LABELS.NON_NOTO}</option>
              </select>
              <div className="text-xs text-primary-700/80 mt-1.5">
                NAO = nuovi anticoagulanti orali · TAO = terapia anticoagulante orale (dicumarolici).
                Se in terapia, la decisione mostrerà un'avvertenza sulla trombolisi.
              </div>
            </div>

            <ChoiceGroup
              label="Paziente autonomo"
              hint="Autonomia nelle attività quotidiane prima dell'evento."
              value={value.autonomous || 'NON_NOTO'}
              onSelect={(v) => set('autonomous', v)}
              options={[
                { key: 'SI',       text: 'Sì' },
                { key: 'NO',       text: 'No' },
                { key: 'NON_NOTO', text: 'Non noto' },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isLogistics) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-3">Centro HUB</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tempo stimato verso HUB (minuti)</label>
              <input className="input" type="number" min="0" value={value.hubTimeMin}
                onChange={(e) => set('hubTimeMin', e.target.value)} placeholder="es. 35" />
            </div>
            <div>
              <label className="label">Distanza stimata verso HUB (km)</label>
              <input className="input" type="number" min="0" value={value.hubDistanceKm}
                onChange={(e) => set('hubDistanceKm', e.target.value)} placeholder="es. 28" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-3">Centro SPOKE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tempo stimato verso SPOKE (minuti)</label>
              <input className="input" type="number" min="0" value={value.spokeTimeMin}
                onChange={(e) => set('spokeTimeMin', e.target.value)} placeholder="es. 12" />
            </div>
            <div>
              <label className="label">Distanza stimata verso SPOKE (km)</label>
              <input className="input" type="number" min="0" value={value.spokeDistanceKm}
                onChange={(e) => set('spokeDistanceKm', e.target.value)} placeholder="es. 8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
