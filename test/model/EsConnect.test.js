/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */
'use strict';

var GetLogger = require('../../lib/util/GetLogger');
var es = require('elasticsearch');
var config = require('config');
var EsConnect = require('../../lib/model/EsConnect');
var logger = new GetLogger(process.env.NODE_ENV);

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

describe('EsConnect', function() {
  describe('constructor', function() {
    it('should be an instance of EsConnect', function() {
      var EsC = new EsConnect(es, logger, config);

      expect(EsC).to.be.instanceof(EsConnect);
    });

    it('should have a client property that is null', function() {
      var EsC = new EsConnect(es, logger, config);

      expect(EsC).to.have.property('client').that.equals(null);
    });
  });

  describe('connect', function() {
    it('should create a handle if one is not defined', function() {
      var sandbox = sinon.sandbox.create();
      var esStub = sandbox.stub(es, 'Client', function() {});

      var EsC = new EsConnect(es, logger, config);

      EsC.connect();

      expect(esStub).to.be.calledOnce;
      sandbox.restore();
    });

    it('should not create a handle if one exists', function() {
      var sandbox = sinon.sandbox.create();
      var esStub = sandbox.stub(es, 'Client', function() {});

      var EsC = new EsConnect(es, logger, config);
      EsC.client = {};

      EsC.connect();

      expect(esStub).to.not.be.called;
      sandbox.restore();
    });
  });
});
