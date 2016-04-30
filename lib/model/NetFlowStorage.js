/* eslint-disable camelcase */
'use strict';

var EsConnect = require('./EsConnect');
var IndexTracking = require('./IndexTracking');

function NetFlowStorage(es, logger, config) {
  var esCon = new EsConnect(es, logger, config);

  this.host = config.get('ElasticSearchConfig.elasticSearchHost');
  this.shards = config.get('ElasticSearchConfig.elasticSearchShards');
  this.replicas = config.get('ElasticSearchConfig.elasticSearchReplicas');
  this.indexName = config.get('Application.indexName');
  this.client = esCon.connect();
  this.indexTracking = new IndexTracking(es, logger, config);
  this.log = logger;
}

NetFlowStorage.prototype.createTemplate = function(callback) {
  var log = this.log;

  this.client.indices.putTemplate({
    name: this.indexName,
    body: {
      template: this.indexName + '*',
      settings: {
        number_of_shards: this.shards,
        number_of_replicas: this.replicas
      },
      mappings: {
        raw_flow: {
          properties: {
            timestamp: {
              type: 'date',
              format: 'epoch_millis'
            },
            ipv4_dst_addr: {
              type: 'ip'
            },
            ipv4_src_addr: {
              type: 'ip'
            }
          }
        }
      }
    }
  },
  function(err) {
    if (err) {
      log.fatal('Template creation failed:' + err);
      throw new Error('Template creation failed: ' + err);
    } else if (typeof (callback) === 'function') {
      return callback();
    }
  });
};

// Store the actual flow
NetFlowStorage.prototype.storeFlow = function storeFlow(flow, demo) {
  flow.timestamp = Date.now();
  var storageObj = this;
  var indexName = this.indexTracking.generateIndexName();

  if (process.env.NODE_ENV === 'demo' || demo === true) {
    flow.ipv4_src_addr =
      flow.ipv4_src_addr.replace(/\d+.\d+.\d+.(\d+)/, '10.0.0.$1');
    flow.ipv4_dst_addr =
      flow.ipv4_dst_addr.replace(/\d+.\d+.\d+.(\d+)/, '10.1.0.$1');
    flow.ipv4_next_hop =
      flow.ipv4_next_hop.replace(/\d+.\d+.\d+.(\d+)/, '10.2.0.$1');
  }

  this.client.index({
    index: indexName,
    type: 'raw_flow',
    body: {
      ipv4_src_addr: flow.ipv4_src_addr,
      ipv4_dst_addr: flow.ipv4_dst_addr,
      ipv4_next_hop: flow.ipv4_next_hop,
      input_snmp: flow.input_snmp,
      output_snmp: flow.output_snmp,
      in_pkts: flow.in_pkts,
      in_bytes: flow.in_bytes,
      first_switched: flow.first_switched,
      last_switched: flow.last_switched,
      ipv4_src_port: flow.ipv4_src_port,
      ipv4_dst_port: flow.ipv4_dst_port,
      tcp_flags: flow.tcp_flags,
      protocol: flow.protocol,
      src_tos: flow.src_tos,
      in_as: flow.in_as,
      out_as: flow.out_as,
      src_mask: flow.src_mask,
      dst_mask: flow.dst_mask,
      timestamp: flow.timestamp
    }
  },
    function(err) {
      if (err) {
        storageObj.log.error(err);
      }
    });
};

// Refresh indices (make new documents searchable, blocks until complete)
NetFlowStorage.prototype.refreshIndices = function(callback) {
  var indexNamePattern = this.indexName + '*';
  var storageObj = this;
  this.client.indices.refresh({index: indexNamePattern},
    function(err, res, status) {
      if (err) {
        storageObj.log.error('refreshIndices failed: ' + err);
      }
      if (typeof (callback) === 'function') {
        callback(err, res, status);
      }
    });
};

// wait for cluster status to go green (make sure the )
NetFlowStorage.prototype.waitForNewIndex = function(callback) {
  var indexNamePattern = this.indexName + '*';
  var storageObj = this;
  this.client.cluster.health({
    waitForStatus: 'green',
    timeout: '30s',
    index: indexNamePattern
  }, function(err, res, status) {
    if (err) {
      storageObj.log.error('Index never went green, continuing anyway');
    }
    if (typeof (callback) === 'function') {
      callback(err, res, status);
    }
  });
};

module.exports = NetFlowStorage;
