/* jshint unused: false, expr: true*/
'use strict';


var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

// setup a fake logger
var fakeLogger = {
    info: function() {
        return;
    }
};

describe('WebService', function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('constructor', function() {
        it('should be an instance of WebService', function() {

            var WebService = require('../lib/WebService');

            var ws = new WebService({}, fakeLogger);

            expect(ws).to.be.instanceOf(WebService);
        });
    });
    describe('start', function() {
        it('should start the webserver', function() {

            var WebService = require('../lib/WebService');
            var listen_stub = sandbox.stub();

            var express_stub = function() {
                var tmpObj = {
                    use: function() {},
                    listen: listen_stub
                };
                return tmpObj;
            };

            var ws = new WebService(express_stub, fakeLogger);
            ws.start();

            expect(listen_stub).to.be.calledOnce;
        });
    });
});