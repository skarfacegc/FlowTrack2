/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */
'use strict';

var bunyan = require('bunyan');
var chai = require('chai');
var expect = chai.expect;
var GetLogger = require('../../lib/util/GetLogger');

describe('GetLogger', function() {
  it('should return a bunyan object', function() {
    var logger = new GetLogger();

    expect(logger).to.be.instanceof(bunyan);
  });

  it('should be configured to only log fatals under modelTest', function() {
    var logger = new GetLogger('modelTest');
    expect(logger).to.have.property('_level').that.equals(60);
  });

  it('should be configured to only log fatals under viewTest', function() {
    var logger = new GetLogger('viewTest');
    expect(logger).to.have.property('_level').that.equals(60);
  });

  it('should be configured to only log debug under dev', function() {
    var logger = new GetLogger('dev');

    expect(logger).to.have.property('_level').that.equals(20);
  });

  it('should be configured to only log info by default', function() {
    var logger = new GetLogger();

    expect(logger).to.have.property('_level').that.equals(30);
  });

  it('should set a default name', function() {
    var logger = new GetLogger();

    expect(logger).to.have.property('fields').to.have.property('name')
      .that.equals('FlowTrack2');
  });

  it('should allow passing a name', function() {
    var logger = new GetLogger('test', 'TestName');

    expect(logger).to.have.property('fields').to.have.property('name')
      .that.equals('TestName');
  });
});
