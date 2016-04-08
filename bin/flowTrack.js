#!/usr/bin/env node

/*jslint node: true */
'use strict';

var cluster = require('cluster');
var netflow = require('node-netflowv9');
var es = require('elasticsearch');
var http = require('http');
var config = require('config');

var NetFlowStorage = require('../lib/model/NetFlowStorage');
var GetLogger = require('../lib/util/GetLogger');
var FlowTrack2App = require('../lib/controller/FlowTrack2App');

var numCPUs = require('os').cpus().length;


main();
function main() {



    // Setup our logger instances
    var logger = new GetLogger(process.env.NODE_ENV,'FlowTrack2');
    var expressLogger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2App');

    var nfStore = new NetFlowStorage(es, logger, config);
    var app = new FlowTrack2App(es, expressLogger, config);

    //FIXME: issue:45  should log pid here
    if (cluster.isMaster) {

        // Setup, then fork the flow collection workers
        nfStore.createTemplate();

        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        // Now start the webservice
        startWebServer(config.get('Application.web_port'), app);

    } else {
        if (config.get('Application.disable_collector') === 0) {
            // Setup the worker
            netflow(function (flow) {

                logger.info('%s\t flows', flow.flows.length);
                for (var i = 0; i < flow.flows.length; i++) {
                    nfStore.storeFlow(flow.flows[i]);
                }
            }).listen(config.get('Application.netflow_port'));
        }
    }
}



function startWebServer(port, app) {
    var logger = new GetLogger(process.env.NODE_ENV);
    http.createServer(app).listen(port);
    logger.info('Listening on: ' + port);
    logger.info('environment: ' + process.env.NODE_ENV);
}
