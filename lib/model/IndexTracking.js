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


// Get the list of indicies
IndexTracking.prototype.getIndexList = function (callback) {
    var regex = '\\s+(' + this.index_name + '\.\\S*)\\s+';
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
    var retentionDays = this.config.Application.retention_days;
    var indexName = this.index_name;
    var expireTime = moment().startOf('d').subtract(retentionDays, 'd');
    var retList = [];

    this.getIndexList(function (indexList) {
        indexList.forEach(function (element, index, array) {
            var regex = indexName + '\\.(\\d\\d-\\d\\d-\\d\\d\\d\\d)';
            var re = new RegExp(regex);
            var match = re.exec(element);

            if (match !== null) {
                if (moment(match[1], 'MM-DD-YYYY').isBefore(expireTime)) {
                    retList.push(indexName + '.' + match[1]);
                }
            }
        });
        callback(retList);
    });

};


IndexTracking.prototype.deleteIndices = function (indexList, callback) {
    var indexString = indexList.join(',');
    var indexTrack = this;

    this.client.indices.delete({index: indexString}, function (error, response, status) {
        if (error) {
            indexTrack.log.error('failed to delete index: ' + error);
        } else {
            indexTrack.log.info('Deleted: ' + indexString);
        }
        if (typeof (callback) === 'function') {
            callback(error, response, status);
        }
    });
};


module.exports = IndexTracking;
