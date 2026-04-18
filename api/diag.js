// Diagnostic endpoint
const fs = require('fs');
const path = require('path');
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const chatPath = path.join(__dirname, 'chat.js');
    const src = fs.readFileSync(chatPath, 'utf8');
    const lines = src.split('\n');
    const report = { totalLines: lines.length, fixes: {} };
    for (let i = 300; i < 350 && i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.includes('try')) report.fixes['try_' + (i+1)] = l.substring(0,60);
      if (l.includes('catch')) report.fixes['catch_' + (i+1)] = l.substring(0,60);
      if (l.includes('!message')) report.fixes['edge_' + (i+1)] = l.substring(0,80);
    }
    for (let i = 590; i < 650 && i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.includes('m3')) report.fixes['m3_' + (i+1)] = l.substring(0,80);
      if (l.includes('entry.match')) report.fixes['ematch_' + (i+1)] = l.substring(0,80);
      if (l.includes('cls.match')) report.fixes['cmatch_' + (i+1)] = l.substring(0,80);
    }
    try {
      const chatModule = require('./chat');
      report.moduleLoads = true;
    } catch(e) {
      report.moduleLoads = false;
      report.moduleError = e.message;
      report.moduleStack = (e.stack||'').split('\n').slice(0,5).join(' | ');
    }
    res.status(200).json(report);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
