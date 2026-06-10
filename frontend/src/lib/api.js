const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.details = data.details;
    throw err;
  }
  return data;
}

export const api = {
  health:        () => request('/health'),
  listEvaluations: () => request('/evaluations'),
  getEvaluation: (id) => request(`/evaluations/${id}`),
  createEvaluation: (body) => request('/evaluations', { method: 'POST', body: JSON.stringify(body) }),
  deleteEvaluation: (id) => request(`/evaluations/${id}`, { method: 'DELETE' }),
  reviewEvaluation: (id, body) => request(`/evaluations/${id}/review`, { method: 'PATCH', body: JSON.stringify(body) }),
  transitEvaluation: (id, body) => request(`/evaluations/${id}/transit`, { method: 'PATCH', body: JSON.stringify(body) }),
};

export function getRole() {
  try { return localStorage.getItem('estroke_role') || null; } catch { return null; }
}
export function setRole(role) {
  try { localStorage.setItem('estroke_role', role); } catch {}
}
export function clearRole() {
  try { localStorage.removeItem('estroke_role'); } catch {}
}
