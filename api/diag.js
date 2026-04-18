// Diag v4 - catch async errors + unhandled rejections
module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  var msg = (req.query && req.query.m) || 'berapa kategori tender?';
  var responded = false;
  var rejErr = null;
  function onReject(reason) { rejErr = reason; }
  process.on('unhandledRejection', onReject);
  try {
    delete require.cache[require.resolve('./chat')];
    var handler = require('./chat');
    var result = null;
    var mockReq = { method: 'POST', body: { message: msg } };
    var mockRes = {
      setHeader: function(){},
      status: function(c) { result = result || {}; result.s = c; return this; },
      json: function(d) { result = result || {}; result.ok = true; result.hasReply = !!(d&&d.reply); result.replySnip = (d&&d.reply||'').substring(0,80); return this; },
      end: function() { return this; }
    };
    var ret = handler(mockReq, mockRes);
    if (ret && typeof ret.then === 'function') {
      ret.then(function() {
        process.removeListener('unhandledRejection', onReject);
        if (!responded) { responded = true; res.status(200).json({ async: true, result: result, rejection: rejErr ? rejErr.message||String(rejErr) : null, msg: msg }); }
      }).catch(function(e) {
        process.removeListener('unhandledRejection', onReject);
        var lm = (e.stack||'').match(/chat\.js:(\d+):(\d+)/);
        if (!responded) { responded = true; res.status(200).json({ asyncCrash: true, type: e.constructor.name, errMsg: e.message.substring(0,200), line: lm?lm[1]:'?', col: lm?lm[2]:'?', msg: msg }); }
      });
    } else {
      setTimeout(function() {
        process.removeListener('unhandledRejection', onReject);
        if (!responded) { responded = true; res.status(200).json({ sync: true, result: result, rejection: rejErr ? rejErr.message||String(rejErr) : null, msg: msg }); }
      }, 3000);
    }
  } catch(e) {
    process.removeListener('unhandledRejection', onReject);
    var lm2 = (e.stack||'').match(/chat\.js:(\d+):(\d+)/);
    if (!responded) { responded = true; res.status(200).json({ syncCrash: true, type: e.constructor.name, errMsg: e.message.substring(0,200), line: lm2?lm2[1]:'?', col: lm2?lm2[2]:'?', msg: msg }); }
  }
};
