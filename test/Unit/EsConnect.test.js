/* jshint expr: true */
'use strict';



var GetLogger = require('../../lib/GetLogger');
var es = require('elasticsearch');
var config = require('config');
var EsConnect = require('../../lib/EsConnect');
var logger = new GetLogger(process.env.NODE_ENV);

var bunyan = require('bunyan');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);


describe('EsConnect', function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('constructor', function() {

        it('should be an instance of EsConnect', function() {
            var EsC = new EsConnect(es, logger, config);

            expect(EsC).to.be.instanceof(EsConnect);
        });

        it('should have a client property that is null', function() {
            var EsC = new EsConnect(es, logger, config);

            expect(EsC).to.have.property('client').that.equals(null);
        });
    });

    describe('connect', function() {
        it('should create a handle if one is not defined', function() {

            var esStub = sandbox.stub(es, "Client", function() {});

            var EsC = new EsConnect(es, logger, config);

            EsC.connect();

            expect(esStub).to.be.calledOnce;

        });

        it('should not create a handle if one exists', function() {

            var esStub = sandbox.stub(es, "Client", function() {});

            var EsC = new EsConnect(es, logger, config);
            EsC.client = {};

            EsC.connect();

            expect(esStub).to.not.be.called;

        });
    });
});