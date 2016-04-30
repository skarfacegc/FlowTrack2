/* eslint-disable max-nested-callbacks */
'use strict';

var FlowTrack2App = require('../../lib/controller/FlowTrack2App');
var GetLogger = require('../../lib/util/GetLogger');
var TestData = require('../lib/TestData');

var es = require('elasticsearch');
var config = require('config');

var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('JsonRoutes', function() {
  describe('/json/rawFlowsForlast/:duration/:scale', function() {
    it('should return a valid flow record', function(done) {
      this.timeout(0); // up the test timeout a bit
      var logger = new GetLogger('quiet', 'FlowTrack2App');
      var app = new FlowTrack2App(es, logger, config);
      var testData = new TestData(es, logger, config);

      testData.simpleLoadData(100, 2000, null, function() {
        request(app)
        .get('/json/rawFlowsForLast/10/minutes')
                .expect(function(res) {
                  var responseBody = JSON.parse(res.text);

                  // reset timestamp to 0 so we can test everthing else
                  /* eslint-disable camelcase */
                  responseBody[0]._source.timestamp = 0;
                  expect(responseBody[0]._source).to.deep.equal({
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
                    dst_mask: 0,
                    timestamp: 0
                  });
                })
                .end(function(err) {
                  testData.deleteTestData();
                  done(err);
                });
                /* eslint-enable camelcase */
      });
    });
  });
});
