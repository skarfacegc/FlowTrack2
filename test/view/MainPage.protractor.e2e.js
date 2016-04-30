'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var UiGridTest = require('../lib/UiGridTest');

var config = require('config');

var webPort = config.get('Application.webPort');

chai.use(chaiAsPromised);
var expect = chai.expect;

// Data loading / cleaup occurs in protractor.conf.js
// This is due to the way protractor parallelizes the various browser
// tests.  When delete was in here the data would get deleted
// from ES prior to the tests all completing

describe('Main Page', function() {
  var grid = new UiGridTest(by.id('mainGrid'));
  var headers = grid.getColumnHeaders('mainGrid');

  it('should have a title', function(done) {
    browser.get('http://localhost:' + webPort);

    expect(browser.getTitle()).to.eventually.equal('FlowTrack');
    done();
  });

  it('should have 5 header columns', function(done) {
    expect(headers.count()).to.eventually.equal(5);
    done();
  });

  it('should have the correct header columns', function(done) {
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
