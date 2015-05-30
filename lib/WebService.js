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

    // Setup routes
    app.use('/', this.express.static('www/html'));

    // Startup the server
    app.listen(this.port);

    this.log.info('Starting webserver on port %s', this.port);

};


module.exports = WebService;