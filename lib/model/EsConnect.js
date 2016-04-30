'use strict';

function EsConnect(es, logger, config) {
  this.es = es;
  this.logger = logger;
  this.host = config.get('ElasticSearchConfig.elasticSearchHost');
  this.client = null;
}

EsConnect.prototype.connect = function() {
  if (this.client === null) {
    this.logger.debug('Connecting to es @ ' + this.host);

    this.client = new this.es.Client({
      host: this.host
    });
  }
  return this.client;
};

module.exports = EsConnect;
