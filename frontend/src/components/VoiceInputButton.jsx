import React, { useEffect, useRef, useState } from 'react';
import { IconMic, IconCheck } from './icons.jsx';

// Bottone microfono per dettare le note operatore.
// Feature-detection: si nasconde se l'API non è disponibile (Firefox desktop, Safari iOS old, ecc.).

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export default function VoiceInputButton({ onAppend }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recRef = useRef(null);

  useEffect(() => () => {
    if (recRef.current) {
      try { recRef.current.stop(); } catch {}
    }
  }, []);

  if (!SpeechRecognitionImpl) return null;

  function start() {
    setError(null);
    try {
      const rec = new SpeechRecognitionImpl();
      rec.lang = 'it-IT';
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (ev) => {
        const last = ev.results[ev.results.length - 1];
        if (last?.isFinal) {
          const transcript = last[0]?.transcript?.trim();
          if (transcript) onAppend(transcript);
        }
      };
      rec.onerror = (e) => setError(e.error || 'errore microfono');
      rec.onend = () => setListening(false);
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch (e) {
      setError(e.message || 'impossibile avviare il microfono');
    }
  }

  function stop() {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={listening ? stop : start}
        className={`w-14 h-14 rounded-full shadow-card flex items-center justify-center transition ${
          listening
            ? 'bg-danger text-white animate-pulse'
            : 'bg-accent text-white hover:opacity-90'
        }`}
        aria-label={listening ? 'Ferma dettatura' : 'Avvia dettatura vocale'}
        title={listening ? 'Ferma dettatura' : 'Dettatura vocale (it-IT)'}
      >
        {listening ? <IconCheck className="w-5 h-5" /> : <IconMic className="w-5 h-5" />}
      </button>
      {error && <div className="text-[10px] text-danger">{error}</div>}
    </div>
  );
}
