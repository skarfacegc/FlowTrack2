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
    // TODO externalize this
    app.get('/', function(req, res) {
        res.send('Hello World');
    });

    // Startup the server
    var server = app.listen(this.port);

    this.log.info('Starting webserver on port %s', server.address().port);

};


module.exports = WebService;