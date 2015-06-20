/* global browser */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var UiGridTest = require('./UiGridTest');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Main Page', function() {
    it('should have a title', function() {
        browser.get('http://localhost:3000');

        expect(browser.getTitle()).to.eventually.equal('FlowTrack');
    });

    it('should have 5 header columns', function() {
        var grid = new UiGridTest('mainGrid');
        var headers = grid.getColumnHeaders('mainGrid');
        expect(headers.count()).to.eventually.equal(5);
    });
});