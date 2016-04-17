/*jslint node: true */
'use strict';

var EsConnect = require('./EsConnect');
var IndexTracking = require('./IndexTracking');
var inet = require('inet');


function NetFlowStorage(es, logger, config) {
    var esCon = new EsConnect(es, logger, config);

    this.host = config.get('ElasticSearchConfig.elasticsearch_host');
    this.shards = config.get('ElasticSearchConfig.elasticsearch_shards');
    this.replicas = config.get('ElasticSearchConfig.elasticsearch_replicas');
    this.index_name = config.get('Application.index_name');
    this.client = esCon.connect();
    this.indexTracking = new IndexTracking(es, logger, config);
    this.log = logger;

}

NetFlowStorage.prototype.createTemplate = function (callback) {

    var log = this.log;

    this.client.indices.putTemplate({
        name: this.index_name,
        body: {
            template: this.index_name + '*',
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
    function (err, res, status) {
        if (err) {
            log.error('Template creation failed:' + err);
            throw new Error('Template creation failed: ' + err);
        } else {
            if (typeof (callback) === 'function') {
                return callback();
            }
        }
    });
};



// Store the actual flow
NetFlowStorage.prototype.storeFlow = function storeFlow(flow) {
    flow.timestamp = Date.now();
    var storageObj = this;
    var indexName = this.indexTracking.generateIndexName();

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
    // istanbul ignore next
    function (err, res, status) {
        if (err) {
            storageObj.log.error(err);
        }
    });
};


// Refresh indices (make new documents searchable, blocks until complete)
NetFlowStorage.prototype.refreshIndices = function (callback) {
    var indexNamePattern = this.index_name + '*';

    this.client.indices.refresh({index: indexNamePattern}, function (err, res, status) {
        if (err) {
            throw 'Refresh of ' + indexNamePattern + 'failed: ' + err;
        }else {
            if (typeof (callback) === 'function') {
                callback(err, res, status);
            }
        }
    });
};

// wait for cluster status to go green (make sure the )
NetFlowStorage.prototype.waitForNewIndex = function (callback) {
    var indexNamePattern = this.index_name + '*';
    var storageObj = this;
    this.client.cluster.health({
        // waitForStatus: 'green',
        // timeout: '30s',
        index: indexNamePattern
    }, function (err, res, status) {
        if (err) {
            storageObj.log.error('Index never went green, continuing anyway');
        }
        if (typeof (callback) === 'function') {
            callback(err, res, status);
        }
    });
};


module.exports = NetFlowStorage;
