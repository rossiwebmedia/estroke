import { useEffect, useState } from 'react';

const STORAGE_KEY = 'estroke_theme';

function isNightTime() {
  const h = new Date().getHours();
  return h >= 19 || h < 7;
}

function getDefaultTheme() {
  if (typeof window === 'undefined') return 'light';
  // Preferenza utente esplicita ha la priorità
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  // Altrimenti: dark se la preferenza di sistema o l'ora locale lo suggeriscono
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  if (isNightTime()) return 'dark';
  return 'light';
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState(getDefaultTheme);

  // Applica all'inizio e ogni volta che cambia
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setTheme(next) {
    setThemeState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }
  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, setTheme, toggleTheme };
}
