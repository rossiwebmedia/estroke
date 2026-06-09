# Single-service image: builda il frontend e lo bundle dentro il backend Express.
# Pensata per deploy "una sola URL" su Railway / Render / Fly.io.
# Per lo sviluppo locale usa invece `docker compose up --build` (due servizi).

# ----- Stage 1: build del frontend -----
FROM node:20-alpine AS frontend

WORKDIR /app
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ----- Stage 2: backend Express che serve API + frontend statici -----
FROM node:20-alpine

WORKDIR /app
COPY backend/package.json ./
RUN npm install --omit=dev

COPY backend/server.js ./
COPY backend/src       ./src
COPY --from=frontend /app/dist ./public

ENV NODE_ENV=production
# Railway / Render iniettano PORT; fallback 8080 per altri provider.
ENV PORT=8080
# Path del file JSON con le valutazioni: montare qui un volume persistente
# se si vuole conservare lo storico tra redeploy.
ENV ESTROKE_DATA_FILE=/app/data/evaluations.json

EXPOSE 8080
CMD ["node", "server.js"]
