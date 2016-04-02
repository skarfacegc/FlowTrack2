/* jshint unused: false, expr: true*/
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




describe('IndexTracking', function () {
    describe('generateIndexName', function () {
        it('should generate the correct index name', function () {

            var indexTrack = new IndexTracking(es, logger, config);
            var indexID = moment().format('MM-DD-YYYY');
            var indexName = config.Application.index_name;

            var fullIndexName = indexName + '.' + indexID;

            expect(fullIndexName).to.equal(indexTrack.generateIndexName());
        });
    });

    describe('getIndexList', function () {
        it('should return a list of indicies', function () {
            var indexTrack = new IndexTracking(es, logger, config);

            var sandbox = sinon.sandbox.create();
            var indicesStub = sandbox.stub(indexTrack.client.cat, 'indices')
              .yields(null, 'xxx ' + indexTrack.index_name + ' xxx');

            var callbackSpy = sinon.spy();
            indexTrack.getIndexList(callbackSpy);

            expect(callbackSpy).to.be.calledWith([indexTrack.index_name]);

        });
    });

    describe('expireIndices', function () {
        it('should delete the expired indices', function () {
            // var indexTrack = new IndexTracking(es, logger, config);
            // var sandbox = sinon.sandbox.create();
            //
            // sandbox.stub(indexTrack.client, )
            return true;
        });
    });
});
