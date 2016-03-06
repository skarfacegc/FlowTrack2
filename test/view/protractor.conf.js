/* globals browser,element, by */
'use strict';

var fs = require('fs');

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

    onComplete: function () {
        browser.driver.executeScript("return __coverage__flowTrack2__").
        then(function (coverage) {
            fs.writeFileSync('coverage/coverage-www.json', JSON.stringify(coverage));
        });
    }
};
