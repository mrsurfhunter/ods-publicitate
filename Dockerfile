# ── Stage 1: build React app ──────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Force install ALL deps (including devDeps) even if NODE_ENV=production is injected
RUN npm ci --include=dev

# Build-time env vars (embedded in JS bundle at build time)
ARG VITE_WP_URL=https://www.oradesibiu.ro
ARG VITE_WP_USER=
ARG VITE_WP_PASS=

COPY . .
RUN npm run build

# ── Stage 2: production image ──────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY --from=build /app/dist ./dist

# Persistent lead data directory
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3001

# Runtime env vars (read by server.js at startup)
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
