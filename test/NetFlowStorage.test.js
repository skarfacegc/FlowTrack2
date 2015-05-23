/* jshint unused: false, -W079: false, expr: true */
/* Don't complain about unused or W079 squash the redef warnings on should */
'use strict';

var NetFlowStorage = require('../lib/NetFlowStorage');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);



describe('NetFlowStorage', function() {
    describe('constructor', function() {

        it('should be an instance of NetFlowStorage', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.be.instanceof(NetFlowStorage);
        });

        it('should have a host', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.have.property('host');
        });

        it('should have shards', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.have.property('shards');
        });

        it('should have a replica', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.have.property('replicas');

        });

        it('should have an index name', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.have.property('index_name');
        });

        it('should have a valid elastic search object', function() {
            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            expect(nfStore).to.have.property('es').that.deep.equals(es);

        });

    });

    describe('createIndex', function() {

        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('creates an index if one does not exist', function() {

            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            var myCreateSpy = sinon.spy();
            var stub = sandbox.stub(es, 'Client', function() {
                var tmpObj = {
                    indices: {
                        exists: function(index_name, cb) {
                            cb(null, false);
                        },
                        create: myCreateSpy
                    }
                };
                return tmpObj;
            });

            nfStore.createIndex();

            expect(myCreateSpy).to.be.calledOnce;
        });

        it('does not create an index if one exists', function() {

            var es = require('elasticsearch');
            var nfStore = new NetFlowStorage(es);

            var myCreateSpy = sinon.spy();
            var stub = sandbox.stub(es, 'Client', function() {
                var tmpObj = {
                    indices: {
                        exists: function(index_name, cb) {
                            cb(null, true);
                        },
                        create: myCreateSpy
                    }
                };
                return tmpObj;
            });

            nfStore.createIndex();

            expect(myCreateSpy).to.not.be.called;
        });
    });

});