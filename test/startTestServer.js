#!/usr/bin/env node

'use strict';

//
// Populate the ES database with some dummy data
// Start the webserver for e2e tests
//
// don't need the netflow collector
//

require('config');
var http = require('http');
var es = require('elasticsearch');
var config = require('config');
var NetFlowStorage = require('../lib/model/NetFlowStorage');
var GetLogger = require('../lib/GetLogger');
var FlowTrack2App = require('../lib/FlowTrack2App');

var SAMPLE_FLOW_COUNT = 100;

main();

function main() {

    // Always want this to be test
    var logger = new GetLogger('test', 'FlowTrack2');
    var expressLogger = new GetLogger('test', 'FlowTrack2App');

    var nfStore = new NetFlowStorage(es, logger, config);
    var app = new FlowTrack2App(es, expressLogger, config);

    nfStore.createIndex(function () {
        loadData(nfStore);
    });


    http.createServer(app).listen(config.get('Application.web_port'));
}



// load the test data into the database
function loadData(nfStore) {

    for (var i = 0; i <= SAMPLE_FLOW_COUNT; i += 1) {
        var flow = getFlowRecord();
        flow.timestamp = Date.now();
        nfStore.storeFlow(flow);
    }
}

function getFlowRecord() {

    var simpleFlow = {
        "ipv4_src_addr": '192.168.1.1',
        "ipv4_dst_addr": '192.168.1.2',
        "ipv4_next_hop": 0,
        "input_snmp": 1,
        "output_snmp": 0,
        "in_pkts": 2,
        "in_bytes": 402,
        "first_switched": 4294967295,
        "last_switched": 4294967295,
        "ipv4_src_port": 60521,
        "ipv4_dst_port": 1900,
        "tcp_flags": 0,
        "protocol": 17,
        "src_tos": 0,
        "in_as": 0,
        "out_as": 0,
        "src_mask": 0,
        "dst_mask": 0
    };

    return simpleFlow;
}
