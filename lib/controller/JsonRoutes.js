'use strict';

//
// Define routes for JSON requests
// Handled by methods in JSON.route.handlers.js
//

module.exports = function(app, config, jsonHandler) {
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
    var duration = req.params.duration;
    var scale = req.params.scale;

    // istanbul ignore next
    if (typeof (req.log) === 'object') {
      req.log.debug('Loading Raw Flows ...');
    }

    jsonHandler.getFlowsForLast(duration, scale,
        function(err, response) {
          if (err) {
            console.log(err);
          }
          res.status(200).json(response);
        }
    );
  });
};
