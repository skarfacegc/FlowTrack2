'use strict';


var EsConnect = require('./EsConnect');
var moment = require('moment');



function IndexTracking(es, logger, config) {

    var esCon = new EsConnect(es, logger, config);

    this.host = config.get('ElasticSearchConfig.elasticsearch_host');
    this.index_name = config.get('Application.index_name');
    this.config = config;
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


IndexTracking.prototype.getExpiredIndices = function (callback) {
    var indexCount = this.config.Application.index_count;
    var indexInterval = this.config.Application.index_interval;
    var indexName = this.index_name;
    var expireTime = moment().startOf('day').subtract(indexCount, indexInterval);
    var retList = [];

    this.getIndexList(function (indexList) {
        indexList.forEach(function (element, index, array) {
            var regex = indexName + '\\.(\\d\\d-\\d\\d-\\d\\d\\d\\d)';
            var re = new RegExp(regex);
            var match = re.exec(element);

            if (match !== null) {
                if (moment(match[1], 'MM-DD-YYYY').isBefore(expireTime)) {
                    retList.push(element);
                }
            }
        });
    });
    callback(retList);
};


module.exports = IndexTracking;
