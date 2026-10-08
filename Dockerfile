FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY routes ./routes
COPY server.js ./

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend

RUN cd frontend && npm run build

CMD ["npm", "start"]