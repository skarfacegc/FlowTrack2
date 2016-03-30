/*jslint node: true */
'use strict';

var EsConnect = require('./EsConnect');
var inet = require('inet');


function NetFlowStorage(es, logger, config) {
    var esCon = new EsConnect(es, logger, config);

    this.host = config.get('ElasticSearchConfig.elasticsearch_host');
    this.shards = config.get('ElasticSearchConfig.elasticsearch_shards');
    this.replicas = config.get('ElasticSearchConfig.elasticsearch_replicas');
    this.index_name = config.get('Application.index_name');
    this.client = esCon.connect();
    this.log = logger;

}

// setup our index
NetFlowStorage.prototype.createIndex = function createIndex(callback) {

    this.client.indices.exists({
        index: this.index_name

    }, function (error, exists) {

        if (exists === true) {
            this.log.info('index already exists, not creating again');
        } else {
            var storageObj = this;
            this.log.info('creating index');


            this.client.indices.create({
                    index: this.index_name,
                    body: {
                        index: {
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
                // istanbul ignore next
                function (error, response, status) {
                    if (error) {
                        storageObj.log.info(error + ' ' + status + ' ' + response);
                        throw new Error('index creation failed: ' + error);
                    }

                    if (typeof (callback) === 'function') {
                        return callback();
                    }
                });
        }
    }.bind(this));
};


// Store the actual flow
NetFlowStorage.prototype.storeFlow = function storeFlow(flow) {
    flow.timestamp = Date.now();
    var storageObj = this;
    this.client.index({
        index: this.index_name,
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
    }, function (error, response, status) {
        if (error) {
            storageObj.log.info(error + ' ' + status + ' ' + response);
        }
    });
};


module.exports = NetFlowStorage;
