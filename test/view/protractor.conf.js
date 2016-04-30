/* eslint quote-props: ["error","as-needed"] */
'use strict';

var fs = require('fs');
var GetLogger = require('../../lib/util/GetLogger');
var es = require('elasticsearch');
var config = require('config');
var TestData = require('../lib/TestData');

// cleaup test data

// conf.js
exports.config = {

  allScriptsTimeout: 60000,
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'mocha',
  mochaOpts: {
    timeout: 60000 // ms
  },

  multiCapabilities: [{
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'FlowTrack2 Build'

  }, {
    browserName: 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'FlowTrack2 Build'
  }, {
    browserName: 'internet explorer',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'FlowTrack2 Build'
  }],

  beforeLaunch: function() {
    var logger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2 View Test');
    var testData = new TestData(es, logger, config);
    testData.simpleLoadData(100, 1000);
  },

  onComplete: function() {
    browser.driver.executeScript('return __coverage__flowTrack2__')
        .then(function(coverage) {
          fs.writeFileSync('coverage/coverage-www.json',
            JSON.stringify(coverage));
        });
  },

  afterLaunch: function() {
    return new Promise(function(resolve, reject) {
      var logger = new GetLogger(process.env.NODE_ENV, 'FlowTrack2 View Test');
      var testData = new TestData(es, logger, config);
      testData.deleteTestData(function(err, res) {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
};
