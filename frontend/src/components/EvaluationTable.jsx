import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconTrash, IconArrowRight } from './icons.jsx';
import { STATUS_LABEL } from '../lib/roles.js';

const destBadge = {
  HUB: 'bg-danger-50 text-danger',
  SPOKE: 'bg-success-50 text-success',
  VALUTAZIONE_CLINICA: 'bg-warning-50 text-warning',
};
const destLabel = {
  HUB: 'HUB',
  SPOKE: 'SPOKE',
  VALUTAZIONE_CLINICA: 'Valutazione clinica',
};
const riskBadge = {
  basso: 'bg-success-50 text-success',
  intermedio: 'bg-warning-50 text-warning',
  alto: 'bg-danger-50 text-danger',
};
const statusBadge = {
  accent:  'bg-accent-50 text-accent',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
};

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function EvaluationTable({ items, onDelete }) {
  const navigate = useNavigate();
  if (!items?.length) {
    return (
      <div className="card p-8 text-center text-primary-700/70">
        Nessuna valutazione da mostrare.
      </div>
    );
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-50 text-primary-700 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">ID intervento</th>
              <th className="px-4 py-3 font-semibold">Data</th>
              <th className="px-4 py-3 font-semibold">Paziente</th>
              <th className="px-4 py-3 font-semibold">iStroke</th>
              <th className="px-4 py-3 font-semibold">Rischio</th>
              <th className="px-4 py-3 font-semibold">Destinazione</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 font-semibold text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr
                key={e.id}
                className="border-t border-primary-50 hover:bg-primary-50/40 cursor-pointer"
                onClick={() => navigate(`/evaluations/${e.id}`)}
              >
                <td className="px-4 py-3 font-mono text-primary-900">{e.input?.patientId}</td>
                <td className="px-4 py-3 text-primary-700">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-3 text-primary-700">
                  {e.input?.age ?? '—'} {e.input?.sex ? `· ${e.input.sex}` : ''} {e.input?.city ? `· ${e.input.city}` : ''}
                </td>
                <td className="px-4 py-3 font-bold text-primary-900">{e.result?.score}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${riskBadge[e.result?.riskClass] || 'bg-primary-50 text-primary'}`}>
                    {e.result?.riskClass}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${destBadge[e.effectiveDestination || e.result?.suggestedDestination] || 'bg-primary-50 text-primary'}`}>
                    {destLabel[e.effectiveDestination || e.result?.suggestedDestination] || e.result?.suggestedDestination}
                  </span>
                  {e.status === 'overridden' && e.effectiveDestination !== e.result?.suggestedDestination && (
                    <div className="text-[10px] text-warning mt-0.5">override (da {destLabel[e.result?.suggestedDestination]})</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {(() => {
                    const st = STATUS_LABEL[e.status || 'created'];
                    return (
                      <span className={`badge ${statusBadge[st.tone]}`}>{st.text}</span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onDelete && (
                      <button
                        className="p-2 rounded-lg text-primary-700 hover:bg-danger-50 hover:text-danger"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (confirm(`Eliminare la valutazione ${e.input?.patientId}?`)) onDelete(e.id);
                        }}
                        aria-label="Elimina"
                      >
                        <IconTrash />
                      </button>
                    )}
                    <span className="text-primary-100"><IconArrowRight /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
