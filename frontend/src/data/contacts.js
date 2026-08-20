// ============================================================================
// Contatti telefonici per la chiamata diretta dall'app (richiesta cliente, rev. 2)
// ============================================================================
//
// ⚠️  NUMERI DI PROVA — DA SOSTITUIRE PRIMA DELLA DEMO REALE
//
// Tutti i numeri qui sotto puntano allo stesso recapito di test fornito dal
// cliente. Quando arriveranno i numeri veri basta modificare QUESTO file:
// nessun altro punto del codice contiene numeri di telefono.
//
//   - CENTRALE_OPERATIVA → numero della centrale 118 di riferimento
//   - NEUROLOGIST_BY_HOSPITAL → reperibile neurovascolare di ciascun centro,
//     indicizzato per id ospedale (vedi frontend/src/data/hospitals.js)
//   - NEUROLOGIST_FALLBACK → usato quando l'ospedale non è in tabella
//
// Formato: stringa in formato internazionale, con spazi per la leggibilità.
// `telHref()` la normalizza per l'attributo href="tel:".

const TEST_NUMBER = '+39 333 919 2985';

export const CENTRALE_OPERATIVA = {
  label: 'Centrale Operativa 118',
  number: TEST_NUMBER,
};

export const NEUROLOGIST_FALLBACK = {
  label: 'Neurologo di riferimento',
  number: TEST_NUMBER,
};

export const NEUROLOGIST_BY_HOSPITAL = {
  'sa-ruggi':  { label: 'Neurologo HUB · Ruggi d\'Aragona',   number: TEST_NUMBER },
  'sa-nocera': { label: 'Neurologo HUB · Umberto I Nocera',   number: TEST_NUMBER },
  'sa-polla':  { label: 'Neurologo SPOKE · Luigi Curto Polla', number: TEST_NUMBER },
  'sa-vallo':  { label: 'Neurologo SPOKE · San Luca Vallo',    number: TEST_NUMBER },
};

// true quando i numeri sono ancora quelli di prova: serve per mostrare
// l'avviso "numero di prova" accanto ai bottoni di chiamata.
export const USING_TEST_NUMBERS = true;

// Normalizza per href="tel:" — via spazi, punti e parentesi.
export function telHref(number) {
  return `tel:${String(number || '').replace(/[^\d+]/g, '')}`;
}

// Ritorna il contatto del neurologo per un dato id ospedale.
export function neurologistFor(hospitalId) {
  return NEUROLOGIST_BY_HOSPITAL[hospitalId] || NEUROLOGIST_FALLBACK;
}
