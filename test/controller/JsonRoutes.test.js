/* jshint expr: true */
'use strict';

var JsonRouteHandlers = require('../../lib/controller/JsonRouteHandlers');
var FlowTrack2App = require('../../lib/controller/FlowTrack2App');
var GetLogger = require('../../lib/util/GetLogger');


var es = require('elasticsearch');
var config = require('config');
var express = require('express');

var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;




describe('JsonRoutes', function () {
    describe('/json/rawFlowsForlast/:duration/:scale', function () {

        it('should return a valid flow record', function (done) {

            var logger = new GetLogger('quiet', 'FlowTrack2App');
            var app = new FlowTrack2App(es, logger, config);

            request(app)
                .get('/json/rawFlowsForLast/10/minutes')
                .expect(function (res) {
                    var responseBody = JSON.parse(res.text);

                    // reset timestamp to 0 so we can test everthing else
                    responseBody[0]._source.timestamp = 0;
                    expect(responseBody[0]._source).to.deep.equal({
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
                        "dst_mask": 0,
                        "timestamp": 0
                    });
                })
                .end(done);
        });
    });
});
