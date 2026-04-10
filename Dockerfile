# ── Stage 1: build React app ──────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Force install ALL deps (including devDeps) even if NODE_ENV=production is injected
RUN npm ci --include=dev

COPY . .
RUN npm run build

# ── Stage 2: production image ──────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY --from=build /app/dist ./dist

# Persistent data directory (leads + orders)
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3001

# Runtime env vars (read by server.js at startup)
ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "server.js"]
