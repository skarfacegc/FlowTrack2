'use strict';

var EsConnect = require('../../lib/model/EsConnect');
var NetFlowStorage = require('../../lib/model/NetFlowStorage');
var IndexTrack = require('../../lib/model/IndexTracking');
var async = require('async');

function TestData(es, logger, config) {
  var esConn = new EsConnect(es, logger, config);
  this.client = esConn.connect();

  this.nfStore = new NetFlowStorage(es, logger, config);
  this.indexTrack = new IndexTrack(es, logger, config);
  this.logger = logger;
  this.config = config;

  this.defaultCount = 100;
  this.defaultStep = 1000;
}

// load the test data into the database
// will load count records in the database decreasing time by step ms
// if flowRecord isn't defined we'll load data from this.getFlowRecord
// if flowRecord is a function we'll load data from that
// if flowRecord is an object we'll use that
TestData.prototype.simpleLoadData =
function(count, step, flowRecord, callback) {
  var sampleFlow = {};
  var flowsToInsert = [];
  var testData = this;

    // if flowRecord isn't defined load from the default generator
    // if flowRecord is a function invoke the function and use that
    // if flowRecord is an object use that directly
    // otherwise error!
  if (flowRecord === null || flowRecord === undefined) {
    sampleFlow = this.getFlowRecord();
  } else if (typeof (flowRecord) === 'function') {
    sampleFlow = flowRecord();
  } else if (typeof (flowRecord) === 'object') {
    sampleFlow = flowRecord;
  } else {
    this.logger.error('Invalid flow record: ' + flowRecord);
    throw new Error('Invalid flow record');
  }

  for (var i = 0; i <= count; i++) {
    sampleFlow.timestamp = Date.now() - (i * step);
    flowsToInsert.push(sampleFlow);
  }

  async.each(flowsToInsert, function(flow, cb) {
    testData.nfStore.storeFlow(flow);
    cb();
  }, function(err) {
    if (err) {
      testData.logger.error('Failed to store flow');
    } else {
      testData.nfStore.waitForNewIndex(function() {
        testData.nfStore.refreshIndices(callback);
      });
    }
  });
};

// Sample flow
TestData.prototype.getFlowRecord = function() {
  /* eslint-disable camelcase */
  var simpleFlow = {
    ipv4_src_addr: '192.168.1.1',
    ipv4_dst_addr: '192.168.1.2',
    ipv4_next_hop: 0,
    input_snmp: 1,
    output_snmp: 0,
    in_pkts: 2,
    in_bytes: 402,
    first_switched: 4294967295,
    last_switched: 4294967295,
    ipv4_src_port: 60521,
    ipv4_dst_port: 1900,
    tcp_flags: 0,
    protocol: 17,
    src_tos: 0,
    in_as: 0,
    out_as: 0,
    src_mask: 0,
    dst_mask: 0
  };
  /* eslint-enable camelcase */

  return simpleFlow;
};

// Delete all indices
TestData.prototype.deleteTestData = function(callback) {
  var indexTrack = this.indexTrack;
  indexTrack.getIndexList(function(indexList) {
    indexTrack.deleteIndices(indexList, function(err, res, status) {
      if (typeof (callback) === 'function') {
        callback(err, res, status);
      }
    });
  });
};

module.exports = TestData;
