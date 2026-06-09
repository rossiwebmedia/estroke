// Persistenza JSON locale con scrittura atomica.
// Volutamente semplice: niente lock, ma rename atomico (POSIX) evita
// file corrotti se il container si arresta a metà write.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_FILE = process.env.ESTROKE_DATA_FILE
  || path.resolve(process.cwd(), 'data', 'evaluations.json');

async function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readRaw() {
  await ensureFile();
  const txt = await fs.readFile(DATA_FILE, 'utf8');
  try {
    const data = JSON.parse(txt);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeAtomic(list) {
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

export const store = {
  async readAll() {
    const list = await readRaw();
    // più recenti per primi
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
  async remove(id) {
    const list = await readRaw();
    const next = list.filter((e) => e.id !== id);
    const removed = next.length !== list.length;
    if (removed) await writeAtomic(next);
    return removed;
  },
  // Merge superficiale + write atomico. Ritorna l'entry aggiornata o null.
  async update(id, patch) {
    const list = await readRaw();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch };
    list[idx] = updated;
    await writeAtomic(list);
    return updated;
  },
  async count() {
    const list = await readRaw();
    return list.length;
  },
  get filePath() {
    return DATA_FILE;
  },
};
