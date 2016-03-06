'use strict';

var NetFlowRetrieval = require('../model/NetFlowRetrieval');


function JsonRouteHandlers(es, logger, config) {
    this.es = es;
    this.logger = logger;
    this.nfRetrieval = new NetFlowRetrieval(es, logger, config);
}

// Returns flows for the last duration/scale
//
// example: getFlowsForLast(1, 'second')
//    will return flows for the last one second
//
// Takes duration, scale, callback
JsonRouteHandlers.prototype.getFlowsForLast = function (duration, scale, callback) {

    var duration_seconds;
    var current = Date.now();

    // convert duration to seconds
    switch (scale) {
        case 'days':
        case 'day':
            duration_seconds = duration * 24 * 60 * 60;
            break;
        case 'hours':
        case 'hour':
            duration_seconds = duration * 60 * 60;
            break;
        case 'minutes':
        case 'minute':
            duration_seconds = duration * 60;
            break;
        case 'second':
        case 'seconds':
        case 'default':
            duration_seconds = duration;
    }

    this.nfRetrieval.getRawFlows(current - (duration_seconds * 1000), current,
      function (err, response, status) {
        callback(err, response.hits.hits, status);
    });
};

module.exports = JsonRouteHandlers;
