#!/bin/bash
# TenderStore Deploy Script — cPanel VPS
# Run as root: bash deploy.sh

set -e

REPO="https://github.com/emerilansel-jpg/tenderstore-chatbot-demo.git"
APP_DIR="/home/aigrowlab/tenderstore"
PORT=3000

echo "=== TenderStore Deploy $(date) ==="

# 1. Node.js 20
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node -v)"

# 2. PM2
npm install -g pm2 2>/dev/null || true

# 3. Clone or pull
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO" "$APP_DIR" && cd "$APP_DIR"
fi

# 4. npm install
npm install --production

# 5. Check .env
if [ ! -f "$APP_DIR/.env" ]; then
  echo ""
  echo "ERROR: .env tidak ada! Buat dulu:"
  echo "  nano $APP_DIR/.env"
  echo ""
  echo "Isi dengan:"
  echo "  PORT=3000"
  echo "  GITHUB_TOKEN=ghp_xxx"
  echo "  GEMINI_API_KEY=AIzaxxx"
  echo "  OPENROUTER_API_KEY=sk-or-v1-xxx"
  exit 1
fi

# 6. PM2 start
pm2 delete tenderstore 2>/dev/null || true
pm2 start "$APP_DIR/app.js" --name tenderstore
pm2 save && pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 7. Apache proxy (.htaccess)
cat > /home/aigrowlab/public_html/.htaccess << 'HTEOF'
Options -Indexes
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
HTEOF

echo ""
echo "=== DONE ==="
echo "App: http://202.10.37.147"
echo "PM2: pm2 status | pm2 logs tenderstore"
