'use strict';

//
// Methods to retrieve flows
//

var EsConnect = require('./EsConnect');

//
// FlowRetrieval constructor
//
// Takes: es module, logger, config
//
function NetFlowRetrieval(es, logger, config) {
  var EsC = new EsConnect(es, logger, config);

  this.es = es;
  this.client = EsC.connect();
  this.logger = logger;
  this.config = config;
  this.indexName = config.get('Application.indexName');
}

NetFlowRetrieval.prototype.getRawFlows =
function(startTime, endTime, callback) {
  this.client.search({
    index: this.indexName + '*',
    type: 'raw_flow',
    body: {
      from: 0,
      size: 50,
      query: {
        range: {
          timestamp: {
            gte: startTime,
            lte: endTime
          }
        }
      }
    }
  },
  function(err, response, status) {
    callback(err, response, status);
  });
};

module.exports = NetFlowRetrieval;
