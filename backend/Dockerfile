FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000
ENV ESTROKE_DATA_FILE=/app/data/evaluations.json

EXPOSE 4000
CMD ["node", "server.js"]
