'use strict';


var EsConnect = require('./EsConnect');
var moment = require('moment');



function IndexTracking(es, logger, config) {

    var esCon = new EsConnect(es, logger, config);

    this.host = config.get('ElasticSearchConfig.elasticsearch_host');
    this.index_name = config.get('Application.index_name');
    this.client = esCon.connect();
    this.log = logger;
}

// Generate today's index id
IndexTracking.prototype.generateIndexName = function () {
    var todayID = moment().format('MM-DD-YYYY');

    return this.index_name + '.' + todayID;
}


module.exports = IndexTracking;
