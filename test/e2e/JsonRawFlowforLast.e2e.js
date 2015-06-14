/* global browser */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('rawFlowsForLast', function() {
    it('should return a valid es result', function(done) {

        browser.get('http://localhost:3000/json/rawFlowsForLast/1/second');


    });
});
