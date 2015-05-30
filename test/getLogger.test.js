/* jshint unused: false, expr: true*/
'use strict';



var bunyan = require('bunyan');
var chai = require('chai');
var expect = chai.expect;
var getLogger = require('../lib/getLogger');


describe('getLogger', function() {

    it('should return a bunyan object', function() {
        var logger = getLogger();

        expect(logger).to.be.instanceof(bunyan);

    });

    it('should be configured to only log fatals under test', function() {
        var logger = getLogger('test');

        expect(logger).to.have.property('_level').that.equals(60);
    });

    it('should be configured to only log debug under dev', function() {
        var logger = getLogger('dev');

        expect(logger).to.have.property('_level').that.equals(20);
    });

    it('should be configured to only log info by default', function() {
        var logger = getLogger();

        expect(logger).to.have.property('_level').that.equals(30);
    });


});