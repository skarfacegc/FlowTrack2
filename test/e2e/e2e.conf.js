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


    capabilities: {
        browserName: 'chrome'
    },

    onComplete: function() {
        browser.driver.executeScript("return __coverage__flowTrack2__").
        then(function(coverage) {
            fs.writeFileSync('coverage/coverage-www.json', JSON.stringify(coverage));
        });
    }
};