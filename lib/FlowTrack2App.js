'use strict';

var express = require('express');
var app = express();




function FlowTrack2App() {

    // Setup routes
    app.use('/', express.static('www/html'));

    return app;

}



module.exports = FlowTrack2App;