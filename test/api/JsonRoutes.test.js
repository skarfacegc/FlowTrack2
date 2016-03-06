/* jshint expr: true */
'use strict';

var JsonRouteHandlers = require('../../lib/controller/JsonRouteHandlers');
var FlowTrack2App = require('../../lib/FlowTrack2App');
var GetLogger = require('../../lib/GetLogger');


var es = require('elasticsearch');
var config = require('config');
var express = require('express');

var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;




describe('JsonRoutes', function () {
    describe('/json/rawFlowsForlast/:duration/:scale', function () {

        it('should call getFlowsForLast and execute the callback', function (done) {

            var logger = new GetLogger('quiet', 'FlowTrack2App');
            var app = new FlowTrack2App(es, logger, config);

            request(app)
                .get('/json/rawFlowsForLast/1/second')
                .expect(function (res) {
                    var responseBody = JSON.parse(res.text);
                    expect(responseBody).to.be.an('array');
                })
                .end(done);
        });
    });
});
