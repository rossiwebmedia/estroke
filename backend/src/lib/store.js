// Persistenza con due back-end intercambiabili:
//   - Postgres se è presente DATABASE_URL (deploy Railway)
//   - File JSON con scrittura atomica altrimenti (dev locale via docker-compose)
//
// Entrambi espongono la stessa API (readAll, getById, create, update, remove,
// count, filePath/info) così il resto del backend non sa quale è attivo.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const HAS_DB = !!process.env.DATABASE_URL;

// ============================================================================
// JSON store (fallback / dev locale)
// ============================================================================
const DATA_FILE = process.env.ESTROKE_DATA_FILE
  || path.resolve(process.cwd(), 'data', 'evaluations.json');

async function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, '[]', 'utf8'); }
}

async function readRaw() {
  await ensureFile();
  const txt = await fs.readFile(DATA_FILE, 'utf8');
  try {
    const data = JSON.parse(txt);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function writeAtomic(list) {
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

const jsonStore = {
  kind: 'json',
  filePath: DATA_FILE,
  async init() { await ensureFile(); },
  async readAll() {
    const list = await readRaw();
    return [...list].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  },
  async getById(id) {
    const list = await readRaw();
    return list.find((e) => e.id === id) || null;
  },
  async create(entry) {
    const list = await readRaw();
    list.push(entry);
    await writeAtomic(list);
    return entry;
  },
  async update(id, patch) {
    const list = await readRaw();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch };
    list[idx] = updated;
    await writeAtomic(list);
    return updated;
  },
  async remove(id) {
    const list = await readRaw();
    const next = list.filter((e) => e.id !== id);
    const removed = next.length !== list.length;
    if (removed) await writeAtomic(next);
    return removed;
  },
  async count() {
    const list = await readRaw();
    return list.length;
  },
};

// ============================================================================
// Postgres store
// ============================================================================
let pool;

async function initPg() {
  const { Pool } = pg;
  // Railway Postgres usa internal networking senza TLS; in caso di connect string
  // pubblica abilita comunque SSL accettando self-signed.
  const ssl = process.env.PGSSLMODE === 'require'
    || /sslmode=require/.test(process.env.DATABASE_URL || '')
    ? { rejectUnauthorized: false }
    : false;

  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id         TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      data       JSONB NOT NULL
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS evaluations_created_at_idx ON evaluations (created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS evaluations_status_idx     ON evaluations ((data->>'status'));`);
}

// Le entry sono salvate come JSONB completo per riusare la stessa shape del JSON
// store, ma id e createdAt restano colonne dedicate per indicizzazione/ordering.
const pgStore = {
  kind: 'postgres',
  filePath: null,
  async init() { await initPg(); },
  async readAll() {
    const r = await pool.query('SELECT data FROM evaluations ORDER BY created_at DESC');
    return r.rows.map((row) => row.data);
  },
  async getById(id) {
    const r = await pool.query('SELECT data FROM evaluations WHERE id = $1', [id]);
    return r.rows[0]?.data || null;
  },
  async create(entry) {
    await pool.query(
      'INSERT INTO evaluations (id, created_at, data) VALUES ($1, $2, $3)',
      [entry.id, entry.createdAt, entry]
    );
    return entry;
  },
  async update(id, patch) {
    const current = await this.getById(id);
    if (!current) return null;
    const updated = { ...current, ...patch };
    await pool.query('UPDATE evaluations SET data = $1 WHERE id = $2', [updated, id]);
    return updated;
  },
  async remove(id) {
    const r = await pool.query('DELETE FROM evaluations WHERE id = $1', [id]);
    return r.rowCount > 0;
  },
  async count() {
    const r = await pool.query('SELECT COUNT(*)::int AS n FROM evaluations');
    return r.rows[0].n;
  },
};

// ============================================================================
// Export
// ============================================================================
export const store = HAS_DB ? pgStore : jsonStore;
await store.init();
console.log(`[store] back-end attivo: ${store.kind}${store.filePath ? ' (' + store.filePath + ')' : ''}`);
