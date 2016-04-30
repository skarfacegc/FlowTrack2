#!/usr/bin/env node

'use strict';

var cluster = require('cluster');
var netflow = require('node-netflowv9');
var es = require('elasticsearch');
var http = require('http');
var config = require('config');
var moment = require('moment');
var npid = require('npid');

var NetFlowStorage = require('../lib/model/NetFlowStorage');
var GetLogger = require('../lib/util/GetLogger');
var FlowTrack2App = require('../lib/controller/FlowTrack2App');
var IndexTracking = require('../lib/model/IndexTracking');

var logger = new GetLogger(process.env.NODE_ENV);
var numCPUs = require('os').cpus().length;

main();
/**
 * main - Start the application server and the netflow collectors
 */
function main() {
  // Setup our logger instances
  var logger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2');
  var expressLogger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2App');

  var nfStore = new NetFlowStorage(es, logger, config);
  var app = new FlowTrack2App(es, expressLogger, config);
  var indexTrack = new IndexTracking(es, logger, config);

  if (cluster.isMaster) {
    var pidFile = './logs/flowTrack' +
        (process.env.NODE_ENV ? '-' + process.env.NODE_ENV : '') + '.pid';

    // force overwrite if needed
    var pid = npid.create(pidFile, true);

    // Try to ensure that we cleanup when the server exits
    pid.removeOnExit();
    process.on('SIGINT', process.exit);
    process.on('SIGTERM', process.exit);

    // Setup, then fork the flow collection workers
    nfStore.createTemplate();

    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Kick off the periodic job to check for expired indices
    setInterval(function() {
      logger.info('Checking for expired indices');
      indexTrack.getExpiredIndices(function(indexList) {
        indexTrack.deleteIndices(indexList);
      });
    }, moment.duration(5, 'minutes').valueOf());

    // Now start the webservice
    startWebServer(config.get('Application.webPort'), app);
  } else if (config.get('Application.disableCollector') === 0) {
    // Setup the worker
    netflow(function(flow) {
      logger.info('%s\t flows', flow.flows.length);
      for (var i = 0; i < flow.flows.length; i++) {
        nfStore.storeFlow(flow.flows[i]);
      }
    }).listen(config.get('Application.netflowPort'));
  }
}

/**
 * startWebServer - Description
 *
 * @param {int} port port number for the server
 * @param {object} app  the application object
 *
 */
function startWebServer(port, app) {
  http.createServer(app).listen(port);
  logger.info('Listening on: ' + port);
  logger.info('environment: ' + process.env.NODE_ENV);
}
