/*jslint node: true */
'use strict';
var es = require('elasticsearch');
var cluster = require('cluster');
var netflow = require('node-netflowv9');
var numCPUs = require('os').cpus().length;
var NetFlowStorage = require('./lib/NetFlowStorage.js');



main();

function main() {

    var nfStore = new NetFlowStorage();

    // parent process
    if (cluster.isMaster) {
        nfStore.createIndex();
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        // Workers    
    } else {

        var client = new es.Client({
            host: 'localhost:9200'
        });

        netflow(function(flow) {

            console.log('%s\t flows', flow.flows.length);
            for (var i = 0; i < flow.flows.length; i++) {
                nfStore.storeFlow(flow.flows[i], client);
            }
        }).listen(2055);
    }
}