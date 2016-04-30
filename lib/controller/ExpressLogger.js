'use strict';
var onFinished = require('on-finished');

function ExpressLogger(logger) {
  var httpLogger = function(req, res, next) {
    req.log = logger;
    res.log = logger;

    req.startTime = Date.now();

    onFinished(res, function() {
      var now = Date.now();
      var elapsed = now - req.startTime;

      logger.info(
          'IP ' + req.ip + ' ' +
          req.method + ' ' + req.url + ' ' +
          res.statusCode + ' ' +
          'took ' + elapsed + 'ms'
      );
    });

    next();
  };

  return httpLogger;
}

module.exports = ExpressLogger;
