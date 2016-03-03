#!/usr/bin/env node
'use strict';

var es = require('elasticsearch');
var config = require('config');
var NetFlowStorage = require('../../lib/NetFlowStorage');
var GetLogger = require('../../lib/GetLogger');
var EsConnect = require('../../lib/EsConnect');


var SAMPLE_FLOW_COUNT = 100;


main();
function main() {
    var logger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2 - DataLoader');
    var nfStore = new NetFlowStorage(es, logger, config);

    var EsC = new EsConnect(es, logger, config);
    var client = EsC.connect();

    client.indices.delete({index: config.Application.index_name});

    nfStore.createIndex();
    loadData(nfStore);

    client.indices.refresh({
        index: config.Application.index_name,
        force: true
    }, function (err, response, status) {
        if (err) {
            console.log(err + response + status);
        }
    });

    setTimeout(process.exit(0), 5000);
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
