import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, getRole } from '../lib/api.js';
import { can } from '../lib/roles.js';
import DashboardCard from '../components/DashboardCard.jsx';
import EvaluationTable from '../components/EvaluationTable.jsx';
import { IconChart, IconHospital, IconAmbulance, IconClock, IconPlus, IconAlert } from '../components/icons.jsx';

export default function Dashboard() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const role = getRole();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.listEvaluations().then(setItems).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      // ripulisce lo state per evitare riapparizioni al refresh
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="card p-6 text-danger">
        Errore nel caricamento: {error}
      </div>
    );
  }
  if (!items) return <Skeleton />;

  const total = items.length;
  const hub   = items.filter((e) => (e.effectiveDestination || e.result?.suggestedDestination) === 'HUB').length;
  const spoke = items.filter((e) => (e.effectiveDestination || e.result?.suggestedDestination) === 'SPOKE').length;
  const avgHub = (() => {
    const vals = items.map((e) => Number(e.input?.hubTimeMin)).filter(Number.isFinite);
    if (!vals.length) return '—';
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) + ' min';
  })();

  const activeCases = items.filter((e) => (e.status || 'created') === 'created');

  return (
    <div className="space-y-6">
      {toast && (
        <div className="card border-warning-100 bg-warning-50 text-primary-900 p-3 flex items-center gap-2 text-sm">
          <IconAlert className="w-5 h-5 text-warning" />
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-primary-900">Dashboard</h1>
          <p className="text-primary-700 mt-1">
            {role ? `Vista per ${role}. ` : ''}Riepilogo delle valutazioni di triage pre-ospedaliero.
          </p>
        </div>
        {can(role, 'canCreate') && (
          <Link to="/evaluations/new" className="btn-primary">
            <IconPlus className="w-5 h-5" /> Nuova valutazione
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard label="Valutazioni totali" value={total} icon={IconChart}     color="primary" />
        <DashboardCard label="Indirizzate a HUB"   value={hub}   icon={IconHospital}  color="danger" sub="Centralizzazione LVO" />
        <DashboardCard label="Indirizzate a SPOKE" value={spoke} icon={IconAmbulance} color="success" sub="Trattamento di prossimità" />
        <DashboardCard label="Tempo medio HUB"     value={avgHub} icon={IconClock}    color="neutral" sub="Media stimata sui casi salvati" />
      </div>

      {can(role, 'seesFlowPanel') && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-primary-900">Flusso casi attivi</h2>
              <p className="text-sm text-primary-700">
                {activeCases.length} caso{activeCases.length === 1 ? '' : 'i'} in transito, in attesa di review del Medico HUB.
              </p>
            </div>
          </div>
          <EvaluationTable items={activeCases} />
        </section>
      )}

      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-lg font-bold text-primary-900">Ultime valutazioni</h2>
          <Link to="/archive" className="text-sm text-accent hover:underline">Vedi tutto →</Link>
        </div>
        <EvaluationTable items={items.slice(0, 5)} />
      </section>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-primary-50 rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => <div key={i} className="h-28 bg-primary-50 rounded-2xl animate-pulse" />)}
      </div>
      <div className="h-64 bg-primary-50 rounded-2xl animate-pulse" />
    </div>
  );
}
