// Versione client-side identica al backend.
// Serve solo per l'anteprima live dello score nel form: il backend
// ricalcola comunque tutto al POST (single source of truth).

export const SYMPTOM_FIELDS = [
  {
    key: 'gazeDeviation', label: 'Deviazione sguardo', options: [0, 25, 50],
    optionLabels: ['Assente', 'Lieve / parziale', 'Forzata / completa'],
    description: 'Gli occhi del paziente sono deviati verso un lato? Chiedi di seguire il tuo dito da sinistra a destra: se gli occhi non superano la linea mediana c\'è deviazione forzata.',
    howTo: 'Test: muovi un dito davanti al paziente in orizzontale, osserva se entrambi gli occhi lo seguono.',
  },
  {
    key: 'aphasia', label: 'Afasia', options: [0, 20, 40],
    optionLabels: ['Assente', 'Moderata', 'Severa / globale'],
    description: 'Il paziente fatica a comprendere o a produrre il linguaggio? Verifica sia la comprensione che la produzione.',
    howTo: 'Test: mostra un oggetto comune (penna, chiave) e chiedi di nominarlo. Poi chiedi di ripetere una frase semplice come "il cielo è azzurro".',
  },
  {
    key: 'neglect', label: 'Neglect', options: [0, 20, 40],
    optionLabels: ['Assente', 'Parziale', 'Completo'],
    description: 'Il paziente ignora uno dei due lati del corpo o dello spazio? Tipico nei pazienti con ictus emisferico destro che non sentono il lato sinistro.',
    howTo: 'Test: tocca contemporaneamente entrambi i lati del corpo (mani o guance) e chiedi se sente uno o due tocchi. Mostra oggetti a sinistra e a destra contemporaneamente.',
  },
  {
    key: 'upperLimbMotorLeft', label: 'Deficit motorio arto sup.', side: 'Sx', options: [0, 10, 20],
    optionLabels: ['Assente', 'Paresi', 'Plegia'],
    description: 'Il braccio sinistro è debole o non si muove? Tieni in considerazione il lato che il paziente racconta come affetto.',
    howTo: 'Test: chiedi al paziente di sollevare il braccio sinistro a 90° (in piedi) o 45° (sdraiato) e mantenerlo per 10 secondi. Paresi = scende, plegia = non si solleva.',
  },
  {
    key: 'upperLimbMotorRight', label: 'Deficit motorio arto sup.', side: 'Dx', options: [0, 10, 20],
    optionLabels: ['Assente', 'Paresi', 'Plegia'],
    description: 'Il braccio destro è debole o non si muove? Confronta con il lato controlaterale per identificare la lateralizzazione.',
    howTo: 'Test: chiedi al paziente di sollevare il braccio destro a 90° (in piedi) o 45° (sdraiato) e mantenerlo per 10 secondi. Paresi = scende, plegia = non si solleva.',
  },
  {
    key: 'lowerLimbMotorLeft', label: 'Deficit motorio arto inf.', side: 'Sx', options: [0, 7, 15],
    optionLabels: ['Assente', 'Paresi', 'Plegia'],
    description: 'La gamba sinistra è debole o non si muove? Il deficit motorio inferiore è meno comune di quello superiore ma più grave.',
    howTo: 'Test: con paziente sdraiato, chiedi di sollevare la gamba sinistra tesa a 30° e mantenerla per 5 secondi. Osserva se cade o non riesce a sollevarla.',
  },
  {
    key: 'lowerLimbMotorRight', label: 'Deficit motorio arto inf.', side: 'Dx', options: [0, 7, 15],
    optionLabels: ['Assente', 'Paresi', 'Plegia'],
    description: 'La gamba destra è debole o non si muove? Confronta con il lato controlaterale.',
    howTo: 'Test: con paziente sdraiato, chiedi di sollevare la gamba destra tesa a 30° e mantenerla per 5 secondi. Osserva se cade o non riesce a sollevarla.',
  },
  {
    key: 'dysarthria', label: 'Disartria', options: [0, 10, 20],
    optionLabels: ['Assente', 'Lieve', 'Severa / anartria'],
    description: 'Il linguaggio è impastato o biascicato? La disartria riguarda l\'articolazione, non il contenuto (a differenza dell\'afasia).',
    howTo: 'Test: fai ripetere una frase con consonanti complesse, es. "trentatré trentini entrarono a Trento". Lieve = comprensibile ma articolato male, severa = parole incomprensibili.',
  },
  {
    key: 'consciousness', label: 'Alterazione coscienza', options: [0, 20, 40],
    optionLabels: ['Vigile', 'Sopore', 'Coma / stupor'],
    description: 'Qual è il livello di coscienza? Vigile = risponde e cooperante, sopore = risponde solo a stimoli energici, coma = nessuna risposta.',
    howTo: 'Test: parlare al paziente con voce normale. Se non risponde, prova con voce alta. Se ancora niente, applica uno stimolo doloroso (pizzicotto al trapezio).',
  },
];

const DISCLAIMER = 'La decisione finale resta in carico al personale sanitario qualificato.';

function calcScore(symptoms = {}) {
  return SYMPTOM_FIELDS.reduce((sum, f) => {
    const v = Number(symptoms[f.key]);
    return sum + (Number.isFinite(v) ? v : 0);
  }, 0);
}

export function decisionEngine(input = {}) {
  const symptoms = input.symptoms || {};
  const score = calcScore(symptoms);

  const hubTime  = Number(input.hubTimeMin);
  const hubDist  = Number(input.hubDistanceKm);
  const onsetMin = Number(input.onsetMinutes);

  let riskClass, lvoEstimate, suggestedDestination, rationale;

  if (score < 200) {
    riskClass = 'basso';
    lvoEstimate = '≤ 40%';
    const nearHub =
      (Number.isFinite(hubTime) && hubTime <= 60) ||
      (Number.isFinite(hubDist) && hubDist <= 80);
    if (nearHub) {
      suggestedDestination = 'SPOKE';
      rationale = `Punteggio iStroke ${score} (< 200) compatibile con NIHSS 4-5 e probabilità LVO stimata ≤ 40%. Il centro HUB è raggiungibile entro 60 min o 80 km: si suggerisce trasporto al centro SPOKE di prossimità.`;
    } else {
      suggestedDestination = 'HUB';
      rationale = `Punteggio iStroke ${score} (< 200) ma il centro HUB dista oltre 60 min / 80 km. In presenza di sintomi anche moderati e logistica sfavorevole si suggerisce comunque trasporto diretto al centro HUB.`;
    }
  } else if (score < 225) {
    riskClass = 'intermedio';
    lvoEstimate = '40-50%';
    const compatible = !Number.isFinite(hubTime) || hubTime <= 90;
    if (compatible) {
      suggestedDestination = 'HUB';
      rationale = `Punteggio iStroke ${score} (200-224) in fascia intermedia. Tempi verso HUB compatibili: si suggerisce trasporto al centro HUB per valutazione neurovascolare avanzata.`;
    } else {
      suggestedDestination = 'VALUTAZIONE_CLINICA';
      rationale = `Punteggio iStroke ${score} (200-224) in fascia intermedia con tempi verso HUB sfavorevoli (> 90 min). È necessaria una valutazione clinica congiunta con il neurologo di centrale per decidere la destinazione.`;
    }
  } else {
    riskClass = 'alto';
    lvoEstimate = '50-60%';
    suggestedDestination = 'HUB';
    rationale = `Punteggio iStroke ${score} (≥ 225) compatibile con NIHSS 6-8 e probabilità LVO stimata 50-60%. Trasporto diretto al centro HUB per possibile trombectomia meccanica.`;
  }

  const warnings = [];
  if (Number.isFinite(onsetMin) && onsetMin > 270) {
    warnings.push(`Tempo dall'esordio dei sintomi superiore a 4h30 (${onsetMin} min): valutare attentamente la finestra terapeutica.`);
  }
  if (!input.lastSeenWell) {
    warnings.push('Orario "ultima volta visto bene" non specificato: dato critico per la finestra trombolitica.');
  }
  const motor =
    Number(symptoms.upperLimbMotorLeft  || 0) + Number(symptoms.upperLimbMotorRight || 0) +
    Number(symptoms.lowerLimbMotorLeft  || 0) + Number(symptoms.lowerLimbMotorRight || 0);
  if (motor >= 60 && Number(symptoms.gazeDeviation) >= 25) {
    warnings.push('Deficit motorio severo associato a deviazione dello sguardo: forte sospetto di occlusione di grosso vaso.');
  }
  const upperAsymmetry = Math.abs(Number(symptoms.upperLimbMotorLeft || 0) - Number(symptoms.upperLimbMotorRight || 0));
  const lowerAsymmetry = Math.abs(Number(symptoms.lowerLimbMotorLeft || 0) - Number(symptoms.lowerLimbMotorRight || 0));
  if (upperAsymmetry >= 20 || lowerAsymmetry >= 15) {
    warnings.push('Deficit motorio nettamente asimmetrico (lateralizzazione): coerente con quadro ischemico focale.');
  }

  return { score, riskClass, lvoEstimate, suggestedDestination, rationale, warnings, disclaimer: DISCLAIMER };
}
