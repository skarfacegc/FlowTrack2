/* global browser */
'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

//FIXME:0 issue:40  THis should actually query something
describe('rawFlowsForLast', function () {
    it('should return a valid es result', function (done) {
        // This can't be done in protractor (which only does angular)
        // need to use something else
        done();
    });
});
