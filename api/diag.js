// Diag v3
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  var msg = (req.query && req.query.m) || 'berapa kategori tender?';
  try {
    delete require.cache[require.resolve('./chat')];
    var handler = require('./chat');
    var result = null;
    var mockReq = { method: 'POST', body: { message: msg } };
    var mockRes = {
      setHeader: function(){},
      status: function(c) { result = result || {}; result.s = c; return this; },
      json: function(d) { result = result || {}; result.ok = true; result.replyLen = (d.reply||'').length; return this; },
      end: function() { return this; }
    };
    handler(mockReq, mockRes);
    setTimeout(function() {
      res.status(200).json({ handlerResult: result || 'pending-async', msg: msg });
    }, 200);
  } catch(e) {
    var lm = (e.stack||'').match(/chat\.js:(\d+):(\d+)/);
    res.status(200).json({
      crashed: true,
      type: e.constructor.name,
      msg: msg,
      errMsg: e.message.substring(0, 200),
      line: lm ? lm[1] : 'unknown',
      col: lm ? lm[2] : 'unknown'
    });
  }
};
