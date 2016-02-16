/* global browser, by */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var UiGridTest = require('./UiGridTest');
var config = require('config');

var web_port = config.get('Application.web_port');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Main Page', function () {

    var grid = new UiGridTest(by.id('mainGrid'));
    var headers = grid.getColumnHeaders('mainGrid');

    it('should have a title', function () {
        browser.get('http://localhost:' + web_port);

        expect(browser.getTitle()).to.eventually.equal('FlowTrack');
    });

    it('should have 5 header columns', function () {
        expect(headers.count()).to.eventually.equal(5);
    });

    it('should have the correct header columns', function () {
        var headersToTest = [
            'Src Address\n ',
            'Dst Address\n ',
            'Packets\n ',
            'Bytes\n ',
            'Time\n '
        ];

        expect(headers.getText()).to.eventually.deep.equal(headersToTest);
    });
});
