/*jslint node: true */
'use strict';


function WebService(express, logger) {
    this.express = express;
    this.log = logger;
    this.port = 3000; // TODO make this into a config file

}

// setup our index
WebService.prototype.start = function start() {

    var app = this.express();
    var StaticRoutes = require('./WebService/StaticRoutes');

    // Setup routes
    app.use('/', StaticRoutes);

    // Startup the server
    app.listen(this.port);

    this.log.info('Starting webserver on port %s', this.port);

};


module.exports = WebService;