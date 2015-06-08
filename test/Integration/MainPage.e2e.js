/* global browser */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('Main Page', function() {
    it('should have a title', function(){
        browser.get('http://localhost:3000');

        expect(browser.getTitle()).to.eventually.equal('FlowTrack');
    });
});