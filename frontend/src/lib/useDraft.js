import { useEffect, useRef } from 'react';

const PREFIX = 'estroke_draft_';

// Hook che salva automaticamente il valore in localStorage con un debounce.
// All'init non fa nulla automaticamente — il caller deve chiamare loadDraft()
// quando l'utente conferma di voler riprendere la bozza.
//
// Pattern previsto:
//   const { saveNow, loadDraft, clearDraft, hasDraft } = useDraft('new-evaluation', data, setData);
export function useDraft(key, value, setValue) {
  const fullKey = PREFIX + key;
  const debounceRef = useRef(null);

  // Salva ogni volta che value cambia, con debounce 500ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(fullKey, JSON.stringify({
          savedAt: Date.now(),
          value,
        }));
      } catch { /* localStorage piena o disattivata: ignora */ }
    }, 500);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [value, fullKey]);

  function readDraft() {
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function hasDraft() {
    return !!readDraft();
  }

  function loadDraft() {
    const d = readDraft();
    if (d?.value) setValue(d.value);
  }

  function clearDraft() {
    try { localStorage.removeItem(fullKey); } catch {}
  }

  function draftAge() {
    const d = readDraft();
    if (!d?.savedAt) return null;
    return Math.floor((Date.now() - d.savedAt) / 60000); // min
  }

  return { loadDraft, clearDraft, hasDraft, draftAge };
}
