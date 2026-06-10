# E-STROKE — Prototipo web

> **Early. Effective. Essential.**
> An App for Brain. An App for LIFE.

E-STROKE è un **prototipo dimostrativo** di web app per il supporto decisionale al
triage pre-ospedaliero del paziente con sospetto ictus. Aiuta operatori 118, medici HUB
e centrali operative a calcolare rapidamente uno **iStroke Score Demo** e a decidere se
indirizzare il paziente verso un centro **HUB** (trombectomia) o **SPOKE** (trombolisi
di prossimità). Include anche un **triage pubblico BE-FAST** per cittadini/familiari
che sospettano un ictus, accessibile senza login.

Il prototipo nasce dal materiale fornito dal cliente (presentazione *I-Stroke* di
Daniele Romano e Alessandro Scutiero) e ne implementa le regole decisionali della
slide 13.

> ⚠️ **Disclaimer**: prototipo dimostrativo, **non destinato all'uso clinico reale**.
> I pesi della scala e le regole di destinazione sono illustrativi e configurabili.
> La decisione finale resta in carico al personale sanitario qualificato.

---

## Avvio rapido

Requisiti: Docker + Docker Compose v2.

```bash
docker compose up --build
```

Poi apri il browser:

- **Web app**: http://localhost:3000
- **API backend**: http://localhost:4000/api/health

Per fermare e cancellare i container (i dati salvati restano nel volume `estroke_data`):

```bash
docker compose down
```

Per cancellare anche le valutazioni salvate:

```bash
docker compose down -v
```

---

## Stack

- **Frontend**: React 18 + Vite 5 + React Router 6 + Tailwind CSS 3
- **Backend**: Node.js 20 + Express 4 (ESM)
- **Persistenza**: **PostgreSQL** se `DATABASE_URL` è settato (deploy Railway), altrimenti fallback automatico a **file JSON** locale con scrittura atomica (`backend/data/evaluations.json`) — utile per dev locale senza dover installare Postgres
- **Container**: Docker multi-stage (Nginx serve il build del frontend e fa da proxy verso il backend)

Nessuna dipendenza nativa, nessuna build complicata.

---

## Credenziali demo

Nessuna password. La landing offre due percorsi:

1. **Accesso operatori** → seleziona uno dei tre ruoli:
   - `Operatore 118`
   - `Medico HUB`
   - `Centrale Operativa`
2. **Controllo rapido sintomi (BE-FAST)** → pubblico, senza login, pensato per cittadini.

Il ruolo selezionato è salvato in `localStorage` (client-side only).

---

## Ruoli e permessi (prototipo)

I tre ruoli operatore riflettono il flusso reale del triage pre-ospedaliero:

| Ruolo                | Nuova valutazione | Review HUB (conferma / correggi) | Vista "Flusso casi attivi" |
| -------------------- | :--------------: | :------------------------------: | :------------------------: |
| Operatore 118        | ✅ Sì             | ❌ No                            | ❌ No                       |
| Medico HUB           | ❌ No             | ✅ Sì                            | ❌ No                       |
| Centrale Operativa   | ❌ No             | ❌ No                            | ✅ Sì                       |

**Ciclo di vita di una valutazione**

```
[Operatore 118 crea] → status = created (In transito)
                       ↓
        [Medico HUB la apre e decide]
                       ↓
       confirm  →  status = confirmed (Confermato)
       override →  status = overridden (Corretto)
                   effectiveDestination = HUB/SPOKE scelta dal medico
```

La destinazione "ufficiale" è quella **effettiva** (`effectiveDestination`):
coincide con il suggerimento dell'algoritmo finché il Medico HUB non fa un override.
La tabella, la dashboard, il report e la timeline mostrano sempre quella effettiva,
ma la card "Review HUB" evidenzia se c'è stata una correzione.

La matrice permessi è in `frontend/src/lib/roles.js` (`PERMISSIONS` + `can(role, action)`).

> ⚠️ **Prototipo**: i permessi sono puramente client-side. Il backend valida solo
> il formato del payload e non blocca chiamate fatte con un ruolo "sbagliato": in
> produzione servirebbe vera autenticazione + ACL server-side (es. JWT con claim
> di ruolo, middleware Express che blocca `PATCH /:id/review` se l'utente non ha
> ruolo `Medico HUB`).

---

## Struttura cartelle

```
Istroke/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                    # Express app + seed iniziale
│   ├── src/
│   │   ├── routes/evaluations.js    # CRUD valutazioni
│   │   ├── lib/store.js             # persistenza JSON (write atomico)
│   │   ├── lib/decisionEngine.js    # regole iStroke + HUB/SPOKE
│   │   └── lib/seed.js              # 7 valutazioni di esempio
│   └── data/                        # volume Docker
└── frontend/
    ├── Dockerfile                   # build Vite + nginx
    ├── nginx.conf
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx                  # routing
        ├── main.jsx
        ├── index.css
        ├── lib/{api,decisionEngine}.js
        ├── components/
        │   ├── Layout, Sidebar, Header, DisclaimerBanner
        │   ├── DashboardCard, EvaluationTable
        │   ├── PatientForm, ScoreCalculator
        │   ├── ResultCard, DecisionTimeline, PrintableReport
        │   ├── BeFastQuiz, EmergencyCallCard
        │   └── icons.jsx
        └── pages/
            ├── Landing, Login, PublicTriage
            ├── Dashboard, NewEvaluation
            ├── Result, Archive, Report
```

---

## Endpoint API

Base URL: `http://localhost:4000` (oppure `/api` dietro Nginx).

| Metodo | Path                       | Descrizione                                       |
| ------ | -------------------------- | ------------------------------------------------- |
| `GET`  | `/api/health`              | Health check (`{ status: "ok", time }`)            |
| `GET`  | `/api/evaluations`         | Elenco valutazioni (ordinate per data desc)        |
| `POST` | `/api/evaluations`         | Crea una nuova valutazione (ricalcola lo score)    |
| `GET`  | `/api/evaluations/:id`     | Dettaglio singola valutazione                      |
| `PATCH`| `/api/evaluations/:id/review` | Review del Medico HUB: conferma o override     |
| `DELETE`| `/api/evaluations/:id`    | Elimina una valutazione                            |

Esempio `PATCH .../review` (override):

```json
{ "action": "override", "overrideTo": "SPOKE", "notes": "Sintomi attenuati al triage", "by": "Medico HUB" }
```

Esempio `POST` body:

```json
{
  "patientId": "INT-2026-0150",
  "age": 72, "sex": "M", "city": "Catania",
  "onsetMinutes": 45, "lastSeenWell": "2026-05-26T14:30",
  "hubTimeMin": 35, "hubDistanceKm": 28,
  "spokeTimeMin": 12, "spokeDistanceKm": 8,
  "symptoms": {
    "gazeDeviation": 25, "aphasia": 20, "neglect": 0,
    "upperLimbMotor": 20, "lowerLimbMotor": 15,
    "dysarthria": 10, "consciousness": 0
  },
  "operatorRole": "Operatore 118"
}
```

Risposta: `201 Created` con `{ id, createdAt, input, result }` dove `result` contiene
`score`, `riskClass`, `lvoEstimate`, `suggestedDestination`, `rationale`, `warnings`, `disclaimer`.

---

## Regole decisionali (motore demo)

Implementate in `backend/src/lib/decisionEngine.js` (copia client-side in
`frontend/src/lib/decisionEngine.js` per l'anteprima live durante il form).

Pesi della scala iStroke Demo (9 parametri, somma massima 260):

| Parametro                              | Valori possibili |
| -------------------------------------- | ---------------- |
| Deviazione sguardo                     | 0 / 25 / 50      |
| Afasia                                 | 0 / 20 / 40      |
| Neglect                                | 0 / 20 / 40      |
| Deficit motorio arto superiore **Sx**  | 0 / 10 / 20      |
| Deficit motorio arto superiore **Dx**  | 0 / 10 / 20      |
| Deficit motorio arto inferiore **Sx**  | 0 / 7 / 15       |
| Deficit motorio arto inferiore **Dx**  | 0 / 7 / 15       |
| Disartria                              | 0 / 10 / 20      |
| Alterazione coscienza                  | 0 / 20 / 40      |

> Gli arti sono valutati separatamente Sx/Dx. I pesi sono dimezzati rispetto al singolo
> campo "arto superiore/inferiore" della versione precedente, così la somma massima
> rimane 260 e le soglie 200/225 non cambiano. Un deficit unilaterale severo
> (es. plegia Sx) pesa quanto un deficit bilaterale moderato (es. paresi Sx + paresi Dx).
> Aggiunto inoltre un warning per **deficit nettamente asimmetrico** (segno di
> lateralizzazione ischemica).

Destinazione suggerita:

- **score < 200**, rischio basso, LVO ≤ 40%
  - se HUB ≤ 60 min **oppure** ≤ 80 km → **SPOKE**
  - altrimenti → **HUB**
- **200 ≤ score < 225**, rischio intermedio, LVO 40-50%
  - se HUB ≤ 90 min → **HUB**
  - altrimenti → **VALUTAZIONE_CLINICA**
- **score ≥ 225**, rischio alto, LVO 50-60% → **HUB**

Warning automatici: esordio > 4h30, "ultima volta visto bene" non specificato, deficit motorio severo + deviazione sguardo.

> Per modificare le soglie o i pesi basta editare `backend/src/lib/decisionEngine.js`
> (e la versione gemella `frontend/src/lib/decisionEngine.js` se vuoi che l'anteprima
> live resti coerente). Niente migrazioni database, niente rebuild complicate.

---

## Triage pubblico BE-FAST

Accessibile da `/triage` o dalla CTA rossa in landing. **Senza login. Senza salvare nulla.**
Cinque domande in linguaggio semplice (BE-FAST: Balance, Eyes, Face, Arms, Speech) con
risposte Sì / No / Non so. Esito:

- **≥ 1 sintomo positivo** → schermata rossa con bottone gigante `tel:118` (chiama
  direttamente da mobile) e box informativo sul fattore Time.
- **Nessun sintomo** → schermata gialla con invito a chiamare comunque il 118 in caso di
  dubbio o peggioramento.

In entrambe le schermate viene mostrato un riquadro **"Ospedali nelle vicinanze"** che,
dopo opt-in dell'utente (geolocalizzazione del browser o inserimento manuale del
comune), elenca i 5 ospedali con stroke unit più vicini con **distanza (km in linea
d'aria)** e **tempo stimato di percorrenza**, più un link a Google Maps. Il dataset è
client-side (`frontend/src/data/hospitals.js`, modificabile a mano) e copre i principali
HUB/SPOKE di **Sicilia** e **Campania**: nessun dato viene inviato al server, la posizione resta nel
browser. Le stime sono dichiaratamente indicative — la priorità rimane la chiamata al 118.

---

## Flusso utente

1. Apri http://localhost:3000 → **Landing** con due CTA.
2. Clic su *Avvia valutazione* → **Login ruolo**.
3. **Dashboard** con KPI e ultime valutazioni (già popolate da 7 casi seed).
4. *Nuova valutazione* → form a 3 step (Paziente → Scala sintomi → Logistica + Note operatore) con anteprima live dello score.
5. Submit → **Pagina risultato** con destinazione, motivazione, timeline.
6. *Stampa report* → vista A4 e dialog di stampa del browser.
7. **Archivio** → filtri HUB/SPOKE/rischio + ricerca + eliminazione.

---

## Deploy online (GitHub + Railway)

L'app è pronta per essere messa online come **singolo servizio** (un solo container che
serve sia API che frontend) tramite il `Dockerfile` di root + il `railway.toml`.

### 1. Pubblica su GitHub

```bash
# nella cartella del progetto
git init -b main          # già fatto se hai clonato questo repo
git add .
git commit -m "Initial commit"

# Crea un nuovo repo vuoto su https://github.com/new (es. "estroke")
git remote add origin git@github.com:<tuo-utente>/estroke.git
git push -u origin main
```

### 2. Deploy su Railway

1. Vai su https://railway.app → **New Project** → **Deploy from GitHub repo**.
2. Autorizza Railway ad accedere al tuo account GitHub e seleziona il repo `estroke`.
3. Railway rileva automaticamente il `Dockerfile` di root (forzato anche dal `railway.toml`)
   e avvia il build. Non servono env var: il container espone `PORT` (iniettato da Railway)
   e all'avvio popola in automatico il seed di 7 valutazioni.
4. Quando il deploy è verde, vai su **Settings → Networking → Generate Domain**: Railway
   ti assegna una URL pubblica tipo `https://estroke-production.up.railway.app`.
5. (Opzionale, **consigliato**) **Persistenza dati**: Settings → **Volumes** → New Volume,
   mount path `/app/data`. Senza volume il file `evaluations.json` viene ricreato ad ogni
   redeploy (il seed si ripopola), accettabile per una demo ma le valutazioni utente vanno perse.

### 3. Aggiornamenti

Ogni `git push` su `main` triggera un nuovo deploy su Railway. Per testare in locale
prima del push, puoi simulare il container di Railway con:

```bash
docker build -t estroke-prod -f Dockerfile .
docker run --rm -p 9090:8080 estroke-prod
# apri http://localhost:9090
```

### Note

- Il `docker-compose.yml` di root resta usabile per lo **sviluppo locale**: in quella
  modalità backend e frontend girano in due container separati, il frontend è servito
  da Nginx con hot-proxy verso il backend. È la modalità ideale per modificare il
  codice perché `docker compose up --build` ricarica solo i layer cambiati.
- Il `Dockerfile` di root è invece dedicato al **deploy single-service**: builda il
  frontend, copia `dist/` dentro `backend/public/` e fa servire tutto ad Express
  (`backend/server.js` rileva la cartella `public/` e attiva static + SPA fallback).
- Endpoint pubblici dopo il deploy:
  - `GET  https://<tuo-dominio>/api/health` → health check
  - `GET  https://<tuo-dominio>/`           → landing
  - `GET  https://<tuo-dominio>/triage`     → triage pubblico BE-FAST
  - `GET  https://<tuo-dominio>/login`      → accesso operatori

---

## Sviluppo locale (senza Docker)

```bash
# backend
cd backend
npm install
npm run dev          # http://localhost:4000

# frontend
cd frontend
npm install
npm run dev          # http://localhost:5173 (proxy /api → :4000)
```

---

## Note di sicurezza

- Tutti gli input sono validati e sanitizzati lato backend; il body è limitato a 256 kB.
- Lo score viene **ricalcolato dal backend** al `POST`: il client non può iniettare un punteggio arbitrario.
- Nessun dato del triage BE-FAST pubblico viene inviato al server o salvato.

---

## Licenza & uso

Prototipo realizzato per finalità dimostrative e commerciali interne al progetto E-STROKE.
Da non distribuire come strumento medico. La presentazione clinica del progetto rimane di proprietà
di Daniele Romano e Alessandro Scutiero.
