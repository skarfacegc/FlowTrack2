/* jshint expr: true */
'use strict';


var JsonRouteHandlers = require('../../../lib/WebService/JsonRouteHandlers');
var GetLogger = require('../../../lib/GetLogger');
var logger = new GetLogger(process.env.NODE_ENV);


var es = require('elasticsearch');
var config = require('config');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);



describe('JsonRouteHandlers', function () {
    describe('Constructor', function () {
        it('should be an instance of JsonRouteHandlers', function () {
            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            expect(jsonHandler).to.be.an.instanceOf(JsonRouteHandlers);

        });

        it('should have a defined nfRetrieval property', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            expect(jsonHandler).to.have.property('nfRetrieval').that.is.not.null;
        });
    });

    describe('getFlowsForLast', function () {

        var sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
        });



        it('should call NetFlowRetrieval.getRawFlows', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows');

            jsonHandler.getFlowsForLast(1, 'second');

            expect(getRawFlowsStub).to.be.calledOnce;

        });


        it('should handle the days duration correctly', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows');

            // need a stable time
            var clock = sinon.useFakeTimers(Date.now());
            var time_to_test = Date.now() - (1 * 24 * 60 * 60 * 1000);

            jsonHandler.getFlowsForLast(1, 'days');

            expect(getRawFlowsStub).to.be.calledWith(time_to_test, Date.now());
            clock.restore();
        });

        it('should handle the hours duration correctly', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows');

            // need a stable time
            var clock = sinon.useFakeTimers(Date.now());
            var time_to_test = Date.now() - (1 * 60 * 60 * 1000);

            jsonHandler.getFlowsForLast(1, 'hours');

            expect(getRawFlowsStub).to.be.calledWith(time_to_test, Date.now());
            clock.restore();
        });

        it('should handle the minutes duration correctly', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows');

            // need a stable time
            var clock = sinon.useFakeTimers(Date.now());
            var time_to_test = Date.now() - (1 * 60 * 1000);

            jsonHandler.getFlowsForLast(1, 'minutes');

            expect(getRawFlowsStub).to.be.calledWith(time_to_test, Date.now());
            clock.restore();
        });

        it('should handle the seconds duration correctly', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows');

            // need a stable time
            var clock = sinon.useFakeTimers(Date.now());
            var time_to_test = Date.now() - (1 * 1000);

            jsonHandler.getFlowsForLast(1, 'seconds');

            expect(getRawFlowsStub).to.be.calledWith(time_to_test, Date.now());
            clock.restore();
        });


        it('should handle the callback correctly', function () {

            var jsonHandler = new JsonRouteHandlers(es, logger, config);
            var cbSpy = sandbox.spy();

            var getRawFlowsStub = sandbox.stub(jsonHandler.nfRetrieval, 'getRawFlows').yields('', 'test', '');

            jsonHandler.getFlowsForLast(1, 'seconds', cbSpy);

            expect(cbSpy).to.be.calledWith('', 'test', '');

        });


    });
});
