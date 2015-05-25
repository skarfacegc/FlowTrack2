/*jslint node: true */
'use strict';



function getLogger(mode) {

    var bunyan = require('bunyan');

    if (mode === 'dev' || !mode) {
        return bunyan.createLogger({
            name: 'FlowTrack2'
        });
    } else if (mode === 'test') {
        return bunyan.createLogger({
            name: 'FlowTrack2',
            level: 'fatal'
        });
    }
}



module.exports = getLogger;