// Matrice permessi per i tre ruoli operatore.
// Prototipo: tutta la logica è client-side e cosmetica — in produzione
// servirebbe vera autenticazione + ACL server-side. Documentato nel README.

export const ROLES = ['Operatore 118', 'Medico HUB', 'Centrale Operativa'];

export const PERMISSIONS = {
  'Operatore 118':      { canCreate: true,  canReview: false, seesFlowPanel: false },
  'Medico HUB':         { canCreate: false, canReview: true,  seesFlowPanel: false },
  'Centrale Operativa': { canCreate: false, canReview: false, seesFlowPanel: true  },
};

export function can(role, action) {
  return !!PERMISSIONS[role]?.[action];
}

// Etichette UI per gli stati di una valutazione.
export const STATUS_LABEL = {
  created:     { text: 'In attesa di partenza', tone: 'accent',  icon: '📝' },
  in_transit:  { text: 'Ambulanza in viaggio',  tone: 'accent',  icon: '🚑' },
  arrived:     { text: 'Arrivato al centro',    tone: 'accent',  icon: '🏥' },
  confirmed:   { text: 'Confermato',            tone: 'success', icon: '✅' },
  overridden:  { text: 'Corretto',              tone: 'warning', icon: '⚠️' },
};

// Quali stati sono considerati "attivi" (caso ancora in corso, non chiuso dal Medico HUB).
export const ACTIVE_STATUSES = ['created', 'in_transit', 'arrived'];
