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
};

IndexTracking.prototype.getIndexList = function (callback) {
    var regex = '\\s+(' + this.index_name + ')\\s+';
    var re = new RegExp(regex, 'g');
    var retList = [];
    var match;

    return this.client.cat.indices({v: true}, function (error, response, status) {
      //istanbul ignore if
      if (error) {
          this.log.error('failed loading indexes: ' + error);
      } else {
          while ((match = re.exec(response)) !== null) {
              retList.push(match[1]);
          }
      }
      callback(retList);
  });
};


module.exports = IndexTracking;
