import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import PrintableReport from '../components/PrintableReport.jsx';
import { IconPrinter, IconArrowLeft } from '../components/icons.jsx';

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getEvaluation(id).then((e) => {
      setEvaluation(e);
      // breve delay per permettere il rendering prima del print()
      setTimeout(() => { try { window.print(); } catch {} }, 250);
    }).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="p-6 text-danger">{error}</div>;
  if (!evaluation) return <div className="p-6 text-primary-700">Caricamento report…</div>;

  return (
    <div className="min-h-screen bg-surface print:bg-white">
      <div className="no-print bg-white border-b border-primary-50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
          <IconArrowLeft /> Torna indietro
        </button>
        <button onClick={() => window.print()} className="btn-primary">
          <IconPrinter className="w-5 h-5" /> Stampa
        </button>
      </div>
      <div className="py-6 print:py-0">
        <PrintableReport evaluation={evaluation} />
      </div>
    </div>
  );
}
