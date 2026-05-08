#!/bin/bash
# ============================================================
# AITenderIndonesia — Deploy Script (cPanel VPS)
# Run sebagai root di server baru
# Usage: bash deploy.sh
# ============================================================

set -e

REPO="https://github.com/emerilansel-jpg/tenderstore-chatbot-demo.git"
APP_DIR="/home/aigrowlab/tenderstore"
APP_PORT=3000

echo "========================================"
echo "  AITenderIndonesia Deploy — $(date)"
echo "========================================"

# 1. Install Node.js 20 LTS (jika belum ada)
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "✅ Node.js $(node -v) already installed"
fi

# 2. Install PM2 (jika belum ada)
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
else
  echo "✅ PM2 already installed"
fi

# 3. Clone / pull repo
if [ -d "$APP_DIR/.git" ]; then
  echo "🔄 Pulling latest from GitHub..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "📥 Cloning repo..."
  mkdir -p "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 5. Install dependencies
echo "📦 Installing npm packages..."
cd "$APP_DIR" && npm install --production

# 6. Setup .env
if [ ! -f "$APP_DIR/.env" ]; then
  echo "⚠️  File .env belum ada — membuat placeholder..."
  printf 'PORT=3000\nGITHUB_TOKEN=PASTE_YOUR_GITHUB_TOKEN_HERE\nGITHUB_REPO=emerilansel-jpg/tenderstore-chatbot-demo\nGEMINI_API_KEY=PASTE_YOUR_GEMINI_KEY_HERE\nOPENROUTER_API_KEY=PASTE_YOUR_OPENROUTER_KEY_HERE\n' > "$APP_DIR/.env"
  echo "   ⚠️  Edit .env dengan key asli setelah deploy:"
  echo "   nano $APP_DIR/.env"
fi

# 7. Start / restart dengan PM2
echo "🚀 Starting AITenderIndonesia with PM2..."
pm2 delete tenderstore 2>/dev/null || true
pm2 start "$APP_DIR/app.js" --name tenderstore --env production
pm2 save
pm2 startup 2>/dev/null || true

# 8. Setup .htaccess proxy (Apache → Node.js)
HTACCESS="/home/aigrowlab/public_html/.htaccess"
echo "⚙️  Writing .htaccess proxy..."
mkdir -p /home/aigrowlab/public_html
printf 'Options -Indexes\nRewriteEngine On\n\nRewriteCond %%{REQUEST_FILENAME} !-f\nRewriteCond %%{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]\n' > "$HTACCESS"

echo ""
echo "========================================"
echo "✅ Deploy selesai!"
echo "   App berjalan di: http://127.0.0.1:$APP_PORT"
echo "   Edit .env: nano $APP_DIR/.env"
echo "   PM2 status: pm2 status"
echo "   Logs: pm2 logs tenderstore"
echo "========================================"
