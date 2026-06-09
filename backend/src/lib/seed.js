// Popolazione iniziale dell'archivio: solo se il file è vuoto.
// 7 casi di esempio coprono SPOKE / HUB / valutazione clinica
// con comuni siciliani plausibili e logistica realistica.

import { nanoid } from 'nanoid';
import { decisionEngine } from './decisionEngine.js';

const DAY = 24 * 60 * 60 * 1000;

const SEEDS = [
  {
    patientId: 'INT-2026-0142',
    age: 72, sex: 'M', city: 'Catania',
    onsetMinutes: 45,
    lastSeenWell: new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 25, hubDistanceKm: 18, spokeTimeMin: 10, spokeDistanceKm: 6,
    symptoms: { gazeDeviation: 0, aphasia: 20, neglect: 0,
      upperLimbMotorLeft: 20, upperLimbMotorRight: 0,
      lowerLimbMotorLeft: 15, lowerLimbMotorRight: 0,
      dysarthria: 10, consciousness: 0 },
    notes: 'Paziente collaborante, afasia lieve, deficit emisoma sinistro. Familiare presente sul posto.',
    operatorRole: 'Operatore 118',
    ageOffsetDays: 0.05,
  },
  {
    patientId: 'INT-2026-0141',
    age: 68, sex: 'F', city: 'Enna',
    onsetMinutes: 90,
    lastSeenWell: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 95, hubDistanceKm: 110, spokeTimeMin: 30, spokeDistanceKm: 25,
    symptoms: { gazeDeviation: 25, aphasia: 40, neglect: 20,
      upperLimbMotorLeft: 20, upperLimbMotorRight: 20,
      lowerLimbMotorLeft: 15, lowerLimbMotorRight: 15,
      dysarthria: 20, consciousness: 20 },
    notes: 'Esordio noto, deficit bilaterale. PA 180/100, FC 92 ritmica. Cannula 18G in vena.',
    operatorRole: 'Operatore 118',
    ageOffsetDays: 0.4,
  },
  {
    patientId: 'INT-2026-0139',
    age: 81, sex: 'M', city: 'Palermo',
    onsetMinutes: 180,
    lastSeenWell: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 20, hubDistanceKm: 12, spokeTimeMin: 15, spokeDistanceKm: 8,
    symptoms: { gazeDeviation: 50, aphasia: 40, neglect: 40,
      upperLimbMotorLeft: 20, upperLimbMotorRight: 20,
      lowerLimbMotorLeft: 15, lowerLimbMotorRight: 15,
      dysarthria: 20, consciousness: 20 },
    notes: 'Quadro severo, deficit globale. Caregiver riferisce esordio improvviso 3h fa.',
    operatorRole: 'Operatore 118',
    ageOffsetDays: 1.2,
  },
  {
    patientId: 'INT-2026-0136',
    age: 59, sex: 'F', city: 'Messina',
    onsetMinutes: 30,
    lastSeenWell: new Date(Date.now() - 45 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 40, hubDistanceKm: 30, spokeTimeMin: 12, spokeDistanceKm: 7,
    symptoms: { gazeDeviation: 0, aphasia: 0, neglect: 0,
      upperLimbMotorLeft: 0, upperLimbMotorRight: 20,
      lowerLimbMotorLeft: 0, lowerLimbMotorRight: 0,
      dysarthria: 10, consciousness: 0 },
    notes: 'Deficit emisoma destro al solo arto superiore, esordio recente.',
    operatorRole: 'Operatore 118',
    ageOffsetDays: 2.1,
  },
  {
    patientId: 'INT-2026-0133',
    age: 76, sex: 'M', city: 'Agrigento',
    onsetMinutes: 120,
    lastSeenWell: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 110, hubDistanceKm: 130, spokeTimeMin: 25, spokeDistanceKm: 20,
    symptoms: { gazeDeviation: 25, aphasia: 20, neglect: 20,
      upperLimbMotorLeft: 20, upperLimbMotorRight: 0,
      lowerLimbMotorLeft: 15, lowerLimbMotorRight: 0,
      dysarthria: 10, consciousness: 0 },
    operatorRole: 'Operatore 118',
    ageOffsetDays: 3.5,
  },
  {
    patientId: 'INT-2026-0130',
    age: 64, sex: 'F', city: 'Ragusa',
    onsetMinutes: 60,
    lastSeenWell: new Date(Date.now() - 90 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 75, hubDistanceKm: 70, spokeTimeMin: 18, spokeDistanceKm: 14,
    symptoms: { gazeDeviation: 25, aphasia: 20, neglect: 20,
      upperLimbMotorLeft: 20, upperLimbMotorRight: 20,
      lowerLimbMotorLeft: 15, lowerLimbMotorRight: 15,
      dysarthria: 20, consciousness: 20 },
    operatorRole: 'Operatore 118',
    ageOffsetDays: 4.8,
  },
  {
    patientId: 'INT-2026-0128',
    age: 70, sex: 'M', city: 'Siracusa',
    onsetMinutes: 75,
    lastSeenWell: new Date(Date.now() - 100 * 60 * 1000).toISOString().slice(0, 16),
    hubTimeMin: 55, hubDistanceKm: 60, spokeTimeMin: 15, spokeDistanceKm: 10,
    symptoms: { gazeDeviation: 0, aphasia: 20, neglect: 0,
      upperLimbMotorLeft: 0, upperLimbMotorRight: 20,
      lowerLimbMotorLeft: 0, lowerLimbMotorRight: 15,
      dysarthria: 10, consciousness: 0 },
    notes: 'Lateralizzazione destra. Paziente vigile e cooperante.',
    operatorRole: 'Operatore 118',
    ageOffsetDays: 6.0,
  },
];

// Mix di stati per i 7 seed: i primi 2 ancora attivi (in transito) così la
// Centrale Operativa vede subito casi nel flusso; gli altri review-ati per
// popolare l'archivio con esempi di "Confermato" e "Corretto".
const STATUS_MIX = ['created', 'created', 'confirmed', 'overridden', 'confirmed', 'confirmed', 'created'];

export async function ensureSeed(store) {
  const existing = await store.count();
  if (existing > 0) return { seeded: false, count: existing };

  let n = 0;
  for (let i = 0; i < SEEDS.length; i++) {
    const s = SEEDS[i];
    const { ageOffsetDays, ...input } = s;
    const result = decisionEngine(input);
    const createdAt = new Date(Date.now() - ageOffsetDays * DAY).toISOString();
    const status = STATUS_MIX[i] || 'created';

    const entry = {
      id: nanoid(10),
      createdAt,
      input,
      result,
      status,
      effectiveDestination: result.suggestedDestination,
    };

    if (status === 'confirmed') {
      entry.hubReview = {
        by: 'Medico HUB',
        reviewedAt: new Date(Date.now() - (ageOffsetDays * DAY) + 20 * 60 * 1000).toISOString(),
        action: 'confirm',
      };
    } else if (status === 'overridden') {
      // Inverti la destinazione originale per dare visibilità all'override.
      const newDest = result.suggestedDestination === 'HUB' ? 'SPOKE' : 'HUB';
      entry.effectiveDestination = newDest;
      entry.hubReview = {
        by: 'Medico HUB',
        reviewedAt: new Date(Date.now() - (ageOffsetDays * DAY) + 25 * 60 * 1000).toISOString(),
        action: 'override',
        overrideTo: newDest,
        notes: 'Override clinico: rivalutazione dei sintomi al triage di accettazione.',
      };
    }

    await store.create(entry);
    n++;
  }
  return { seeded: true, count: n };
}
