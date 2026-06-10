import { useEffect, useRef } from 'react';
import { ACTIVE_STATUSES } from './roles.js';

// Hook che notifica il Medico HUB quando arriva un nuovo caso in attesa.
// Effetti: title bell, beep (oscillator API), Notification API se autorizzata.

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880; // A5
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close(), 600);
  } catch { /* no AudioContext */ }
}

export function useNewCaseAlerts(evaluations, { role, hubName = 'HUB' }) {
  const prevCountRef = useRef(null);
  const baseTitleRef = useRef(typeof document !== 'undefined' ? document.title : 'E-STROKE');

  useEffect(() => {
    if (role !== 'Medico HUB' || !Array.isArray(evaluations)) return;

    const activeForHub = evaluations.filter((e) =>
      ACTIVE_STATUSES.includes(e.status || 'created') &&
      (e.effectiveDestination || e.result?.suggestedDestination) === 'HUB'
    );
    const count = activeForHub.length;
    const prev = prevCountRef.current;
    prevCountRef.current = count;

    if (prev == null) return; // primo tick: solo init
    const delta = count - prev;
    if (delta > 0) {
      // Tutto fa scattare solo se l'utente è fuori focus dalla tab
      const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
      // 1) Title bell
      if (hidden) {
        document.title = `🔔 (${delta} nuovo) Caso in arrivo · E-STROKE`;
      }
      // 2) Beep
      playBeep();
      // 3) Notification API (best-effort)
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification('E-STROKE · Nuovo caso in arrivo', {
            body: `${delta} nuovo${delta === 1 ? '' : 'i'} paziente${delta === 1 ? '' : 'i'} verso ${hubName}.`,
            tag: 'estroke-newcase',
            silent: false,
          });
        } catch { /* ignore */ }
      }
    }

    // Reset del title quando l'utente torna sulla tab
    function onFocus() { document.title = baseTitleRef.current; }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [evaluations, role, hubName]);
}

// Helper esposto al chiamante per chiedere il permesso una volta sola.
export async function ensureNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch { return 'default'; }
}
