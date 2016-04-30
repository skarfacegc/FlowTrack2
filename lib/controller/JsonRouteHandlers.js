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
JsonRouteHandlers.prototype.getFlowsForLast =
  function(duration, scale, callback) {
    var durationSeconds;
    var current = Date.now();

    // convert duration to seconds
    switch (scale) {
      case 'days':
      case 'day':
        durationSeconds = duration * 24 * 60 * 60;
        break;
      case 'hours':
      case 'hour':
        durationSeconds = duration * 60 * 60;
        break;
      case 'minutes':
      case 'minute':
        durationSeconds = duration * 60;
        break;
      case 'second':
      case 'seconds':
      default:
        durationSeconds = duration;
    }

    this.nfRetrieval.getRawFlows(current - (durationSeconds * 1000), current,
      function(err, response, status) {
        callback(err, response.hits.hits, status);
      });
  };

module.exports = JsonRouteHandlers;
