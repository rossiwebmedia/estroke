import { Router } from 'express';
import { nanoid } from 'nanoid';
import { store } from '../lib/store.js';
import { decisionEngine, SYMPTOM_FIELDS } from '../lib/decisionEngine.js';

const router = Router();

function sanitizeNumber(v, { min = 0, max = 1e6 } = {}) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

function validateInput(body) {
  const errors = [];
  if (!body || typeof body !== 'object') {
    return { errors: ['Body mancante o non valido.'] };
  }
  const out = {};

  out.patientId = String(body.patientId || '').trim().slice(0, 64) || `AUTO-${nanoid(6)}`;
  out.age       = sanitizeNumber(body.age, { min: 0, max: 130 });
  if (out.age === null) errors.push('Età non valida.');
  out.sex       = ['M', 'F', 'X'].includes(body.sex) ? body.sex : 'X';
  out.city      = String(body.city || '').trim().slice(0, 80);

  out.onsetMinutes  = sanitizeNumber(body.onsetMinutes,  { min: 0, max: 60 * 48 });
  out.lastSeenWell  = body.lastSeenWell ? String(body.lastSeenWell).slice(0, 25) : '';

  out.hubTimeMin     = sanitizeNumber(body.hubTimeMin,     { min: 0, max: 600 });
  out.hubDistanceKm  = sanitizeNumber(body.hubDistanceKm,  { min: 0, max: 1000 });
  out.spokeTimeMin   = sanitizeNumber(body.spokeTimeMin,   { min: 0, max: 600 });
  out.spokeDistanceKm= sanitizeNumber(body.spokeDistanceKm,{ min: 0, max: 1000 });
  if (out.hubTimeMin === null)    errors.push('Tempo HUB non valido.');
  if (out.hubDistanceKm === null) errors.push('Distanza HUB non valida.');

  const symptoms = {};
  for (const f of SYMPTOM_FIELDS) {
    const raw = body.symptoms?.[f.key];
    const n = Number(raw);
    symptoms[f.key] = f.options.includes(n) ? n : 0;
  }
  out.symptoms = symptoms;

  out.operatorRole = ['Operatore 118', 'Medico HUB', 'Centrale Operativa']
    .includes(body.operatorRole) ? body.operatorRole : 'Operatore 118';

  // Note libere dell'operatore al momento della creazione (max 1000 char).
  out.notes = body.notes ? String(body.notes).trim().slice(0, 1000) : '';

  return { input: out, errors };
}

router.get('/', async (_req, res) => {
  const list = await store.readAll();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { input, errors } = validateInput(req.body);
  if (errors.length) {
    return res.status(400).json({ error: 'Validazione fallita', details: errors });
  }
  const result = decisionEngine(input);
  const entry = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    result,
    status: 'created',
    effectiveDestination: result.suggestedDestination,
  };
  await store.create(entry);
  res.status(201).json(entry);
});

router.get('/:id', async (req, res) => {
  const e = await store.getById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Valutazione non trovata.' });
  res.json(e);
});

// Transito dell'ambulanza: l'Operatore 118 marca la partenza e l'arrivo al centro.
// Body: { action: 'start_transit' | 'mark_arrived', by?: string }
router.patch('/:id/transit', async (req, res) => {
  const e = await store.getById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Valutazione non trovata.' });

  const action = req.body?.action;
  if (!['start_transit', 'mark_arrived'].includes(action)) {
    return res.status(400).json({ error: 'Azione non valida: usare "start_transit" o "mark_arrived".' });
  }
  const by = ['Operatore 118','Medico HUB','Centrale Operativa'].includes(req.body?.by)
    ? req.body.by : 'Operatore 118';

  const currentTimeline = e.transitTimeline || {};
  const nowIso = new Date().toISOString();
  const patch = { transitTimeline: { ...currentTimeline } };

  if (action === 'start_transit') {
    if (e.status !== 'created') {
      return res.status(409).json({ error: `Impossibile iniziare il transito da stato "${e.status}".` });
    }
    patch.status = 'in_transit';
    patch.transitTimeline.dispatchedAt = nowIso;
    patch.transitTimeline.dispatchedBy = by;
  } else {
    if (!['created', 'in_transit'].includes(e.status)) {
      return res.status(409).json({ error: `Impossibile marcare arrivo da stato "${e.status}".` });
    }
    if (!patch.transitTimeline.dispatchedAt) patch.transitTimeline.dispatchedAt = nowIso;
    patch.status = 'arrived';
    patch.transitTimeline.arrivedAt = nowIso;
    patch.transitTimeline.arrivedBy = by;
  }

  const updated = await store.update(req.params.id, patch);
  res.json(updated);
});

// Review da parte del Medico HUB: conferma o override della destinazione.
// Body: { action: 'confirm' | 'override', overrideTo?: 'HUB'|'SPOKE', notes?: string, by?: string }
router.patch('/:id/review', async (req, res) => {
  const e = await store.getById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Valutazione non trovata.' });

  const body = req.body || {};
  const action = body.action;
  if (!['confirm', 'override'].includes(action)) {
    return res.status(400).json({ error: 'Azione non valida: usare "confirm" o "override".' });
  }
  const notes = body.notes ? String(body.notes).slice(0, 500) : undefined;
  const by    = ['Operatore 118','Medico HUB','Centrale Operativa'].includes(body.by) ? body.by : 'Medico HUB';

  const patch = {
    status: action === 'confirm' ? 'confirmed' : 'overridden',
    hubReview: {
      by,
      reviewedAt: new Date().toISOString(),
      action,
      ...(notes ? { notes } : {}),
    },
  };

  if (action === 'override') {
    if (!['HUB', 'SPOKE'].includes(body.overrideTo)) {
      return res.status(400).json({ error: 'overrideTo deve essere "HUB" o "SPOKE".' });
    }
    patch.effectiveDestination = body.overrideTo;
    patch.hubReview.overrideTo = body.overrideTo;
  } else {
    // confirm: l'effective rimane il suggerito originario
    patch.effectiveDestination = e.result?.suggestedDestination;
  }

  const updated = await store.update(req.params.id, patch);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const ok = await store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Valutazione non trovata.' });
  res.status(204).end();
});

export default router;
