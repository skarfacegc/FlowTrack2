'use strict';
var morgan = require('morgan');

function GetExpressLogger(logger) {

    var httpLog = morgan('dev', {
        stream: {
            write: function(str) {
                logger.info(str);
            }
        }
    });

    return httpLog;
}

module.exports = GetExpressLogger;