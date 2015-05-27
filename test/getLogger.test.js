/* jshint unused: false, expr: true*/
'use strict';



var bunyan = require('bunyan');
var chai = require('chai');
var expect = chai.expect;



describe('getLogger', function() {

    it('should return a bunyan object', function() {
        var getLogger = require('../lib/getLogger');
        var logger = getLogger();

        expect(logger).to.be.instanceof(bunyan);

    });

    it('should be configured to only log fatals under test', function() {
        var getLogger = require('../lib/getLogger');
        var logger = getLogger('test');

        expect(logger).to.have.property('_level').that.equals(60);
    });

    it('should be configured to only log debug under dev', function() {
        var getLogger = require('../lib/getLogger');
        var logger = getLogger('dev');

        expect(logger).to.have.property('_level').that.equals(20);
    });

    it('should be configured to only log info by default', function() {
        var getLogger = require('../lib/getLogger');
        var logger = getLogger();

        expect(logger).to.have.property('_level').that.equals(30);
    });


});