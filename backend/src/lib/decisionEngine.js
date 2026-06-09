// E-STROKE decision engine — logica del prototipo (NON clinica).
// Calcola iStroke Score Demo a partire da 7 parametri sintomi
// e propone HUB / SPOKE / VALUTAZIONE_CLINICA secondo le regole
// fornite dal cliente nella presentazione (slide 13).

export const SYMPTOM_FIELDS = [
  { key: 'gazeDeviation',         label: 'Deviazione sguardo',            options: [0, 25, 50] },
  { key: 'aphasia',               label: 'Afasia',                         options: [0, 20, 40] },
  { key: 'neglect',               label: 'Neglect',                        options: [0, 20, 40] },
  { key: 'upperLimbMotorLeft',    label: 'Deficit motorio arto sup. Sx',   options: [0, 10, 20] },
  { key: 'upperLimbMotorRight',   label: 'Deficit motorio arto sup. Dx',   options: [0, 10, 20] },
  { key: 'lowerLimbMotorLeft',    label: 'Deficit motorio arto inf. Sx',   options: [0, 7, 15]  },
  { key: 'lowerLimbMotorRight',   label: 'Deficit motorio arto inf. Dx',   options: [0, 7, 15]  },
  { key: 'dysarthria',            label: 'Disartria',                      options: [0, 10, 20] },
  { key: 'consciousness',         label: 'Alterazione coscienza',          options: [0, 20, 40] },
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

  let riskClass;
  let lvoEstimate;
  let suggestedDestination;
  let rationale;

  if (score < 200) {
    riskClass   = 'basso';
    lvoEstimate = '≤ 40%';
    const nearHub =
      (Number.isFinite(hubTime) && hubTime <= 60) ||
      (Number.isFinite(hubDist) && hubDist <= 80);
    if (nearHub) {
      suggestedDestination = 'SPOKE';
      rationale =
        `Punteggio iStroke ${score} (< 200) compatibile con NIHSS 4-5 e probabilità LVO stimata ≤ 40%. ` +
        `Il centro HUB è raggiungibile entro 60 min o 80 km: si suggerisce trasporto al centro SPOKE di prossimità.`;
    } else {
      suggestedDestination = 'HUB';
      rationale =
        `Punteggio iStroke ${score} (< 200) ma il centro HUB dista oltre 60 min / 80 km. ` +
        `In presenza di sintomi anche moderati e logistica sfavorevole si suggerisce comunque trasporto diretto al centro HUB.`;
    }
  } else if (score < 225) {
    riskClass   = 'intermedio';
    lvoEstimate = '40-50%';
    const compatible = !Number.isFinite(hubTime) || hubTime <= 90;
    if (compatible) {
      suggestedDestination = 'HUB';
      rationale =
        `Punteggio iStroke ${score} (200-224) in fascia intermedia. ` +
        `Tempi verso HUB compatibili: si suggerisce trasporto al centro HUB per valutazione neurovascolare avanzata.`;
    } else {
      suggestedDestination = 'VALUTAZIONE_CLINICA';
      rationale =
        `Punteggio iStroke ${score} (200-224) in fascia intermedia con tempi verso HUB sfavorevoli (> 90 min). ` +
        `È necessaria una valutazione clinica congiunta con il neurologo di centrale per decidere la destinazione.`;
    }
  } else {
    riskClass   = 'alto';
    lvoEstimate = '50-60%';
    suggestedDestination = 'HUB';
    rationale =
      `Punteggio iStroke ${score} (≥ 225) compatibile con NIHSS 6-8 e probabilità LVO stimata 50-60%. ` +
      `Trasporto diretto al centro HUB per possibile trombectomia meccanica.`;
  }

  const warnings = [];
  if (Number.isFinite(onsetMin) && onsetMin > 270) {
    warnings.push(
      `Tempo dall'esordio dei sintomi superiore a 4h30 (${onsetMin} min): valutare attentamente la finestra terapeutica.`
    );
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

  return {
    score,
    riskClass,
    lvoEstimate,
    suggestedDestination,
    rationale,
    warnings,
    disclaimer: DISCLAIMER,
  };
}
