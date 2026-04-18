var fs = require('fs');
var path = require('path');
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  var src = fs.readFileSync(path.join(__dirname, 'chat.js'), 'utf8');
  var lines = src.split('\n');
  var depth = 0;
  var report = [];
  for (var i = 229; i < 315 && i < lines.length; i++) {
    var l = lines[i];
    var opens = (l.match(/\{/g) || []).length;
    var closes = (l.match(/\}/g) || []).length;
    depth += opens - closes;
    var info = {n:i+1, d:depth};
    if (l.includes('_wantsCount')) info.wc = l.includes('let ')?'let':l.includes('var ')?'var':l.includes('const ')?'const':'use';
    if (l.includes('try')) info.t = 1;
    if (l.includes('catch')) info.ct = 1;
    if (opens > 0 || closes > 0 || info.wc || info.t || info.ct) report.push(info);
  }
  res.status(200).json(report);
};
