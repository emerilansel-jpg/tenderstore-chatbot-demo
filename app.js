/**
 * AITenderIndonesia Chatbot — Express Server Wrapper
 * Wraps Vercel serverless API routes for cPanel / VPS deployment
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static files ──────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

// ── API routes — auto-wrap all Vercel handlers ────────────────────────────
const apiHandlers = [
  'auth',
  'chat',
  'diag',
  'health-check',
  'load-tenders',
  'manage-users',
  'parse-tenders',
  'save-prospect',
  'save-tenders',
  'stats',
  'test',
];

for (const name of apiHandlers) {
  try {
    const _mod = require(`./api/${name}`); const handler = typeof _mod === "function" ? _mod : (_mod && _mod.default) || _mod;
    app.all(`/api/${name}`, async (req, res) => {
      try {
        await handler(req, res);
      } catch (err) {
        console.error(`[/api/${name}] Error:`, err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: err.message });
        }
      }
    });
    console.log(`✅ Loaded /api/${name}`);
  } catch (err) {
    console.warn(`⚠️  Skipped /api/${name}: ${err.message}`);
  }
}

// ── Fallback — serve index.html ───────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────

// === STARTUP_CHECK — fail fast on env misconfig ===
function startupCheck(){
  const required = ['GEMINI_API_KEY','OPENROUTER_API_KEY'];
  const missing = required.filter(k => !process.env[k] || process.env[k].includes('PLACEHOLDER'));
  if (missing.length) console.warn('\u26A0\uFE0F Missing/placeholder env vars:', missing.join(','));
  const repo = process.env.GITHUB_REPO || '';
  if (repo && !repo.includes('/')) console.warn('\u26A0\uFE0F GITHUB_REPO should be "owner/repo" format. Got:', repo);
  console.log('\u2705 Startup check done. Env:', {repo: repo||'(default)', llmKeys: required.filter(k=>process.env[k]&&!process.env[k].includes('PLACE')).length+'/3'});
}
startupCheck();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 AITenderIndonesia running on port ${PORT}`);
});
