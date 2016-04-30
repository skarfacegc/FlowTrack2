/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */
'use strict';

var IndexTracking = require('../../lib/model/IndexTracking');
var GetLogger = require('../../lib/util/GetLogger');
var logger = new GetLogger('quiet');
var config = require('config');
var moment = require('moment');

var es = require('elasticsearch');
var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('IndexTracking', function() {
  describe('generateIndexName', function() {
    it('should generate the correct index name', function() {
      var indexTrack = new IndexTracking(es, logger, config);
      var indexID = moment().format('MM-DD-YYYY');
      var indexName = config.Application.indexName;

      var fullIndexName = indexName + '.' + indexID;

      expect(fullIndexName).to.equal(indexTrack.generateIndexName());
    });
  });

  describe('getIndexList', function() {
    it('should return a list of indicies', function() {
      var indexTrack = new IndexTracking(es, logger, config);
      var indexTestName = indexTrack.generateIndexName();
      var sandbox = sinon.sandbox.create();
      var _indicesStub = sandbox.stub(indexTrack.client.cat, 'indices')
        .yields(null, 'xxx ' + indexTestName + ' xxx');

      var callbackSpy = sinon.spy();
      indexTrack.getIndexList(callbackSpy);

      expect(callbackSpy).to.be.calledWith([indexTestName]);
      sandbox.restore();
    });
  });

  describe('getExpiredIndices', function() {
    it('should return a list of expired indices', function() {
      var indexTrack = new IndexTracking(es, logger, config);
      var retentionDays = config.Application.retentionDays;

      var testData = [
        indexTrack.indexName + '.' + moment().format('MM-DD-YYYY'),
        indexTrack.indexName + '.' + moment()
          .subtract(retentionDays, 'd').format('MM-DD-YYYY'),
        indexTrack.indexName + '.' + moment()
          .subtract(2 * retentionDays, 'd').format('MM-DD-YYYY')
      ];

      var sandbox = sinon.sandbox.create();
      var _indexStub = sandbox.stub(indexTrack, 'getIndexList')
        .yields(testData);
      var callbackSpy = sinon.spy();

      indexTrack.getExpiredIndices(callbackSpy);

      expect(callbackSpy).to.be.calledWith([
        indexTrack.indexName + '.' + moment()
        .subtract(2 * retentionDays, 'd').format('MM-DD-YYYY')
      ]);

      sandbox.restore();
    });
  });

  describe('deleteIndices', function() {
    it('should call indicies.delete with the correct args', function() {
      var sandbox = sinon.sandbox.create();

      var indexTrack = new IndexTracking(es, logger, config);
      var deleteStub = sandbox.stub(indexTrack.client.indices, 'delete')
        .yields(null, 'test response');
      var callbackSpy = sandbox.spy();

      indexTrack.deleteIndices(['a', 'b', 'c'], callbackSpy);

      expect(deleteStub).to.be.calledWith({index: 'a,b,c'});

      sandbox.restore();
    });

    it('should handle a blank to delete list gracefully', function() {
      var indexTrack = new IndexTracking(es, logger, config);
      expect(indexTrack.deleteIndices(null, function() {})).to.not.throw;
    });
  });
});
