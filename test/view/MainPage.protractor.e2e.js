/* global browser, by */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var UiGridTest = require('../lib/UiGridTest');

var es = require('elasticsearch');
var GetLogger = require('../../lib/util/GetLogger');
var TestData = require('../lib/TestData');
var config = require('config');

var web_port = config.get('Application.web_port');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Main Page', function () {
    var logger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2 view test');
    var testData = new TestData(es, logger, config);

    before(function (done) {
        testData.simpleLoadData(100, 1000, null, done);
    });

    after(function () {
        testData.deleteTestData();
    });


    var grid = new UiGridTest(by.id('mainGrid'));
    var headers = grid.getColumnHeaders('mainGrid');

    it('should have a title', function (done) {
        browser.get('http://localhost:' + web_port);

        expect(browser.getTitle()).to.eventually.equal('FlowTrack');
        done();
    });

    it('should have 5 header columns', function (done) {
        expect(headers.count()).to.eventually.equal(5);
        done();
    });

    it('should have the correct header columns', function (done) {
        var headersToTest = [
            'Src Address\n ',
            'Dst Address\n ',
            'Packets\n ',
            'Bytes\n ',
            'Time\n '
        ];

        expect(headers.getText()).to.eventually.deep.equal(headersToTest);
        done();
    });
});
