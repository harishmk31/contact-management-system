FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend files
COPY config ./config
COPY controllers ./controllers
COPY models ./models
COPY routes ./routes
COPY server.js ./

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy frontend source
COPY frontend ./frontend

# Build React frontend
RUN cd frontend && npm run build

# Start Express server
CMD ["npm", "start"]