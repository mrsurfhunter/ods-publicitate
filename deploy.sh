#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# ODS Publicitate — Deploy pe Coolify (Hetzner)
# Rulează de pe Mac-ul tău local unde ai coolify_key
# ═══════════════════════════════════════════════════════════════

set -e

# ── CONFIGURARE (modifică aceste valori) ──────────────────────
HETZNER_IP="PUNE_IP_SERVERULUI_HETZNER"        # ex: 168.119.xxx.xxx
SSH_KEY="$HOME/.ssh/coolify_key"                 # calea către cheia SSH Coolify
SSH_USER="root"                                   # utilizatorul SSH

# Environment variables pentru aplicație
ANTHROPIC_API_KEY="PUNE_CHEIA_ANTHROPIC"
WP_URL="https://www.oradesibiu.ro"
WP_USER="PUNE_WP_USERNAME"
WP_PASS="PUNE_WP_APP_PASSWORD"
FIRMEAPI_KEY="PUNE_CHEIA_FIRMEAPI"
DOMAIN="publicitate.oradesibiu.ro"              # domeniul pentru aplicație

# ── VERIFICĂRI ────────────────────────────────────────────────
echo "🔍 Verificare prerequisite..."

if [ ! -f "$SSH_KEY" ]; then
  echo "❌ Nu găsesc cheia SSH: $SSH_KEY"
  echo "   Verifică calea și reîncearcă."
  exit 1
fi

if [ "$HETZNER_IP" = "PUNE_IP_SERVERULUI_HETZNER" ]; then
  echo "❌ Configurează HETZNER_IP în script înainte de rulare!"
  exit 1
fi

echo "✅ Cheie SSH găsită: $SSH_KEY"
echo "🚀 Deploy pe $HETZNER_IP..."
echo ""

SSH_CMD="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new $SSH_USER@$HETZNER_IP"

# ── FUNCȚIE SSH ───────────────────────────────────────────────
run_remote() {
  $SSH_CMD "$1"
}

# ── PASUL 1: Verificare conexiune ────────────────────────────
echo "═══ Pasul 1/5: Verificare conexiune SSH..."
run_remote "echo '✅ Conectat la server: \$(hostname) — \$(uname -m)'"
echo ""

# ── PASUL 2: Pregătire director aplicație ─────────────────────
echo "═══ Pasul 2/5: Pregătire director și clone repo..."
run_remote "
  mkdir -p /opt/ods-publicitate/data
  cd /opt/ods-publicitate

  # Clone sau update repo
  if [ -d .git ]; then
    echo '📦 Repo existent, pull ultimele modificări...'
    git fetch origin
    git checkout claude/improve-sibiu-ads-app-dmZoF
    git pull origin claude/improve-sibiu-ads-app-dmZoF
  else
    echo '📦 Clone repo nou...'
    git clone -b claude/improve-sibiu-ads-app-dmZoF https://github.com/mrsurfhunter/ods-publicitate.git .
  fi

  echo '✅ Cod actualizat'
"
echo ""

# ── PASUL 3: Creare fișier .env ──────────────────────────────
echo "═══ Pasul 3/5: Configurare environment..."
$SSH_CMD "cat > /opt/ods-publicitate/.env" << ENVEOF
NODE_ENV=production
PORT=3001

# AI
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY

# WordPress (server-side only, NOT in frontend bundle)
WP_URL=$WP_URL
WP_USER=$WP_USER
WP_PASS=$WP_PASS

# CUI Lookup
FIRMEAPI_KEY=$FIRMEAPI_KEY

# CORS
CORS_ORIGIN=https://$DOMAIN
ENVEOF
echo "✅ .env creat"
echo ""

# ── PASUL 4: Build și start container Docker ──────────────────
echo "═══ Pasul 4/5: Build și deploy Docker..."
run_remote "
  cd /opt/ods-publicitate

  # Oprește container existent dacă rulează
  docker stop ods-publicitate 2>/dev/null || true
  docker rm ods-publicitate 2>/dev/null || true

  # Build imagine Docker
  echo '🔨 Building Docker image...'
  docker build -t ods-publicitate:latest .

  # Pornește container
  echo '🚀 Starting container...'
  docker run -d \\
    --name ods-publicitate \\
    --restart unless-stopped \\
    --env-file .env \\
    -p 3001:3001 \\
    -v /opt/ods-publicitate/data:/app/data \\
    ods-publicitate:latest

  echo '✅ Container pornit'
"
echo ""

# ── PASUL 5: Verificare health check ─────────────────────────
echo "═══ Pasul 5/5: Verificare aplicație..."
sleep 3
run_remote "
  echo 'Health check:'
  curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/health
  echo ''
  echo ''
  echo 'Container status:'
  docker ps --filter name=ods-publicitate --format 'table {{.Status}}\t{{.Ports}}'
"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ DEPLOY COMPLET!"
echo ""
echo "📍 Aplicația rulează pe: http://$HETZNER_IP:3001"
echo ""
echo "📋 Pași rămași (manual în Coolify UI):"
echo "   1. Adaugă proxy/domain: $DOMAIN → localhost:3001"
echo "   2. Configurează SSL (Let's Encrypt)"
echo "   3. Adaugă DNS A record: $DOMAIN → $HETZNER_IP"
echo ""
echo "   SAU dacă folosești Coolify, adaugă ca 'Existing Docker' resource"
echo "   și conectează la containerul 'ods-publicitate' pe port 3001."
echo "═══════════════════════════════════════════════════════════════"
