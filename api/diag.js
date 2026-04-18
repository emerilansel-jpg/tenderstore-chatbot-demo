var fs = require('fs');
var path = require('path');
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  var src = fs.readFileSync(path.join(__dirname, 'chat.js'), 'utf8');
  var lines = src.split('\n');
  var patterns = [
    {k:'timeout', p:/15000|timeout.*\d{4,5}/i},
    {k:'server_error', p:/server.?error|A server error/i},
    {k:'wantsCount', p:/_wantsCount/},
    {k:'count_handler', p:/berapa|jumlah|hitung|count/i},
    {k:'month_map', p:/januari|februari|maret|april|month.*map/i},
    {k:'date_filter', p:/closeDate|closingDate|_close|date.*filter|tanggal/i},
    {k:'llm_call', p:/openrouter|fetch.*api|AbortController/i},
    {k:'fallback', p:/fallback|semua provider|all.*fail/i},
    {k:'kategori_list', p:/TENDER_DATABASE|categories|kategori/i},
    {k:'m3_month', p:/m3|month.*only|bulan/i}
  ];
  var results = [];
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    var matches = [];
    for (var j = 0; j < patterns.length; j++) {
      if (patterns[j].p.test(l)) matches.push(patterns[j].k);
    }
    if (matches.length > 0) {
      var snippet = l.trim().substring(0, 100);
      snippet = snippet.replace(/sk-or-[\w-]+/g, '[KEY]').replace(/[a-f0-9]{32,}/gi, '[HASH]');
      results.push({n: i+1, m: matches, s: snippet});
    }
  }
  res.status(200).json({total_lines: lines.length, matches: results});
};
