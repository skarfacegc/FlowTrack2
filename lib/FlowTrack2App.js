'use strict';

var express = require('express');
var ExpressLogger = require('./WebService/ExpressLogger');
var app = express();




function FlowTrack2App(logger, config) {


    app.use(new ExpressLogger(logger));

    // Setup routes
    app.use('/', express.static('www/html'));

    app.use('/bower_components', express.static('www/bower_components'));

    return app;

}



module.exports = FlowTrack2App;