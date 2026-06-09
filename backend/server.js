import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import evaluationsRouter from './src/routes/evaluations.js';
import { store } from './src/lib/store.js';
import { ensureSeed } from './src/lib/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PORT       = Number(process.env.PORT) || 4000;
// Cartella con il build del frontend (se presente, cioè in deploy single-service).
const PUBLIC_DIR = path.resolve(__dirname, 'public');

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'estroke-backend', time: new Date().toISOString() });
});

app.use('/api/evaluations', evaluationsRouter);

// 404 esplicito per /api non matchato (prima del fallback SPA così non viene
// inghiottito dal sendFile di index.html).
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint non trovato' });
});

// Single-service mode: se è presente il build del frontend, servilo come SPA.
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR, { index: false, maxAge: '7d' }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
  console.log(`[static] Frontend statici serviti da ${PUBLIC_DIR}`);
} else {
  // Backend-only mode (dev locale via docker-compose, dove il frontend gira su Nginx).
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
  });
}

const seedResult = await ensureSeed(store);
if (seedResult.seeded) {
  console.log(`[seed] Popolate ${seedResult.count} valutazioni di esempio in ${store.filePath}`);
} else {
  console.log(`[seed] Archivio esistente con ${seedResult.count} valutazioni (${store.filePath})`);
}

app.listen(PORT, () => {
  console.log(`E-STROKE in ascolto su http://0.0.0.0:${PORT}`);
});
