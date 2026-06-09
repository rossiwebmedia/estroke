import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import EvaluationTable from '../components/EvaluationTable.jsx';
import { IconPlus, IconSearch } from '../components/icons.jsx';

export default function Archive() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [destFilter, setDestFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => { reload(); }, []);
  function reload() {
    api.listEvaluations().then(setItems).catch((e) => setError(e.message));
  }
  async function onDelete(id) {
    try {
      await api.deleteEvaluation(id);
      reload();
    } catch (e) {
      alert('Errore eliminazione: ' + e.message);
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null;
    return items.filter((e) => {
      if (destFilter && e.result?.suggestedDestination !== destFilter) return false;
      if (riskFilter && e.result?.riskClass !== riskFilter) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${e.input?.patientId} ${e.input?.city}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [items, destFilter, riskFilter, q]);

  if (error) return <div className="card p-6 text-danger">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-primary-900 tracking-tight">Archivio valutazioni</h1>
          <p className="text-primary-700 mt-1">{items ? `${filtered?.length ?? 0} di ${items.length} valutazioni` : ''}</p>
        </div>
        <Link to="/evaluations/new" className="btn-primary">
          <IconPlus className="w-5 h-5" /> Nuova valutazione
        </Link>
      </div>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <div>
          <label className="label">Cerca per ID intervento o comune</label>
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary-100" />
            <input
              className="input pl-9"
              placeholder="es. INT-2026 o Catania"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Destinazione</label>
          <select className="input" value={destFilter} onChange={(e) => setDestFilter(e.target.value)}>
            <option value="">Tutte</option>
            <option value="HUB">HUB</option>
            <option value="SPOKE">SPOKE</option>
            <option value="VALUTAZIONE_CLINICA">Valutazione clinica</option>
          </select>
        </div>
        <div>
          <label className="label">Rischio</label>
          <select className="input" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="">Tutti</option>
            <option value="basso">Basso</option>
            <option value="intermedio">Intermedio</option>
            <option value="alto">Alto</option>
          </select>
        </div>
      </div>

      {filtered === null ? (
        <div className="card p-6 text-primary-700">Caricamento…</div>
      ) : (
        <EvaluationTable items={filtered} onDelete={onDelete} />
      )}
    </div>
  );
}
