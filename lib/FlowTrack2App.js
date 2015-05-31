'use strict';

var express = require('express');
var ExpressLogger = require('./WebService/GetExpressLogger');
var app = express();




function FlowTrack2App(logger, config) {


    app.use(new ExpressLogger(logger));

    // Setup routes
    app.use('/', express.static('www/html'));

    return app;

}



module.exports = FlowTrack2App;