// Diagnostic v2 - returns ONLY line numbers, no code content
const fs = require('fs');
const path = require('path');
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const src = fs.readFileSync(path.join(__dirname, 'chat.js'), 'utf8');
    const lines = src.split('\n');
    const r2 = { total: lines.length, patterns: {} };
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.includes('try {') || l.includes('try{')) r2.patterns['try_L'+(i+1)] = 1;
      if (l.includes('catch(') || l.includes('catch (')) r2.patterns['catch_L'+(i+1)] = 1;
      if (l.includes('_countErr')) r2.patterns['countErr_L'+(i+1)] = 1;
      if (l.includes('!message')) r2.patterns['noMsg_L'+(i+1)] = 1;
      if (l.includes('Edge case')) r2.patterns['edgeComment_L'+(i+1)] = 1;
      if (l.includes('entry.match')) r2.patterns['eMatch_L'+(i+1)] = l.includes('[\\s\\-]') ? 'FIXED' : 'OLD';
      if (l.includes('cls.match')) r2.patterns['cMatch_L'+(i+1)] = l.includes('[\\s\\-]') ? 'FIXED' : 'OLD';
      if (l.includes('m3') && l.includes('match')) r2.patterns['m3_L'+(i+1)] = 1;
      if (l.includes('_wantsCount')) r2.patterns['wantsCount_L'+(i+1)] = 1;
      if (l.includes('filterWords')) r2.patterns['filterW_L'+(i+1)] = 1;
    }
    try {
      delete require.cache[require.resolve('./chat')];
      require('./chat');
      r2.moduleOK = true;
    } catch(e) {
      r2.moduleOK = false;
      r2.errType = e.constructor.name;
      r2.errLine = (e.stack||'').match(/chat\.js:(\d+)/);
      r2.errLine = r2.errLine ? r2.errLine[1] : 'unknown';
    }
    res.status(200).json(r2);
  } catch(e) {
    res.status(500).json({ err: e.constructor.name });
  }
};
