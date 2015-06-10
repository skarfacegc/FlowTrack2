/* jshint expr: true */
'use strict';

var es = require('elasticsearch');
var config = require('config');

// var EsConnect = require('../../lib/EsConnect');
var GetLogger = require('../../lib/GetLogger');
var NetFlowRetrieval = require('../../lib/NetFlowRetrieval');
var config = require('config');
var logger = new GetLogger(process.env.NODE_ENV);

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

describe('FlowRetrieval', function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });


    describe('Constructor', function() {
        it('should have a defined client property', function() {

            var nfRetrieval = new NetFlowRetrieval(es, logger, config);

            expect(nfRetrieval).to.have.property('client').that.is.not.null;
        });

    });

    describe('getRawFlows', function() {

        it('should be called with correct args', function() {

            var nfRetrieval = new NetFlowRetrieval(es, logger, config);
            var searchSpy = sandbox.spy();

            nfRetrieval.client = {
                search: searchSpy
            };

            nfRetrieval.getRawFlows(0, 1);

            expect(searchSpy).to.be.calledWith({
                "index": "flow_track2",
                "type": "raw_flow",
                "body": {
                    "query": {
                        "range": {
                            "timestamp": {
                                "gte": 0,
                                "lte": 1
                            }
                        }
                    }
                }
            });
        });
    });
});