'use strict';
var onFinished = require('on-finished');

function GetExpressLogger(logger) {

    var httpLogger = function(req, res, next) {
        req.log = logger;
        res.log = logger;

        req._startTime = Date.now();

        onFinished(res, function() {
            var now = Date.now();
            var elapsed = now - req._startTime;

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

module.exports = GetExpressLogger;