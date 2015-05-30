/*jslint node: true */
'use strict';



function GetLogger(mode) {
    var bunyan = require('bunyan');

    if (mode === 'dev') {
        return bunyan.createLogger({
            name: 'FlowTrack2',
            level: 'debug'
        });
    } else if (mode === 'test') {
        return bunyan.createLogger({
            name: 'FlowTrack2',
            level: 'fatal'
        });
    } else {
        return bunyan.createLogger({
            name: 'FlowTrack2'
        });
    }
}



module.exports = GetLogger;