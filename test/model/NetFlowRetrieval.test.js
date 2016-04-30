/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */
'use strict';

var es = require('elasticsearch');
var config = require('config');

var GetLogger = require('../../lib/util/GetLogger');
var NetFlowRetrieval = require('../../lib/model/NetFlowRetrieval');
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
        index: config.get('Application.indexName') + '*',
        type: 'raw_flow',
        body: {
          from: 0,
          size: 50,
          query: {
            range: {
              timestamp: {
                gte: 0,
                lte: 1
              }
            }
          }
        }
      });
    });

    it('should correctly handle the callback', function() {
      var nfRetrieval = new NetFlowRetrieval(es, logger, config);

      var _searchStub = sandbox.stub(nfRetrieval.client, 'search')
                              .yields('err', 'response', 'status');

      var callbackSpy = sandbox.spy();

      nfRetrieval.getRawFlows(0, 1, callbackSpy);

      expect(callbackSpy).to.be.calledWith('err', 'response', 'status');
    });
  });
});
