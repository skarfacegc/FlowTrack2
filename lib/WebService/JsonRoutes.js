/* global logger */
'use strict';

var JsonRouteHandlers = require('./JsonRouteHandlers');

//
// Define routes for JSON requests
// Handled by methods in JSON.route.handlers.js
// 

module.exports = function(app, config) {


    // Get raw flows for last duration / scale
    // 
    // Valid values for scale: days, hours, minutes, seconds
    // Default: seconds
    // 
    // example:
    //    GET /json/RawFlowsForLast/5/seconds
    //   
    // Will return raw flows for the last 5 seconds
    // 
    // calls Json.router.handler getRawFlows
    app.get('/json/rawFlowsForLast/:duration/:scale', function(req, res) {
        req.log.debug('Loading Raw Flows ...');

        var JsonHandler = new JsonRouteHandlers(res.es, res.log, config);

        var duration = req.params.duration;
        var scale = req.params.scale;

        JsonHandler.getFlowsForLast(duration, scale, function(err, response, status) {
            res.status(200).json(response);
        });
    });

};