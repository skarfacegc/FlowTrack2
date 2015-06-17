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
    specs: ['*.e2e.js']
};