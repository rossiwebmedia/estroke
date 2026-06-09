import React from 'react';

export default function PatientForm({ value, onChange, step }) {
  function set(field, v) {
    onChange({ ...value, [field]: v });
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
        <div>
          <label className="label">Tempo dall'esordio dei sintomi (minuti)</label>
          <input
            className="input"
            type="number" min="0"
            value={value.onsetMinutes}
            onChange={(e) => set('onsetMinutes', e.target.value)}
            placeholder="es. 45"
          />
        </div>
        <div>
          <label className="label">Ultima volta visto bene</label>
          <input
            className="input"
            type="datetime-local"
            value={value.lastSeenWell}
            onChange={(e) => set('lastSeenWell', e.target.value)}
          />
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
