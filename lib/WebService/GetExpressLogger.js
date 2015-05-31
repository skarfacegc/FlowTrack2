'use strict';
var onFinished = require('on-finished');

function GetExpressLogger(logger) {

    var httpLogger = function(req, res, next) {
        req.log = logger;
        res.log = logger;

        req._startTime = new Date();

        onFinished(res, function() {
            var now = new Date();
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