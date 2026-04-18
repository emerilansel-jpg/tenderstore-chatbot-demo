// Diag v5 - find _wantsCount scoping issue
var fs = require('fs');
var path = require('path');
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  var src = fs.readFileSync(path.join(__dirname, 'chat.js'), 'utf8');
  var lines = src.split('\n');
  var report = { total: lines.length, wantsCount: [], tryBlocks: [], catchBlocks: [], edgeGuard: [], braces305_340: [] };
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (l.includes('_wantsCount')) report.wantsCount.push(i+1);
  }
  // Get brace depth changes around lines 300-345
  for (var i = 299; i < 345 && i < lines.length; i++) {
    var l = lines[i];
    var opens = (l.match(/\{/g) || []).length;
    var closes = (l.match(/\}/g) || []).length;
    var indent = l.match(/^(\s*)/)[1].length;
    var hasTry = l.includes('try');
    var hasCatch = l.includes('catch');
    var hasIf = l.includes('if (') || l.includes('if(');
    var hasReturn = l.includes('return ');
    var hasVar = l.includes('var ') || l.includes('let ') || l.includes('const ');
    report.braces305_340.push({n:i+1, ind:indent, o:opens, c:closes, try:hasTry||undefined, catch:hasCatch||undefined, if:hasIf||undefined, ret:hasReturn||undefined, v:hasVar||undefined});
  }
  res.status(200).json(report);
};
