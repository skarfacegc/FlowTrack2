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

    }, function(error, exists) {

        if (exists === true) {
            this.log.info('index already exists, not creating again');
        } else {
            this.log.info('creating index');

            this.client.indices.create({
                    index: this.index_name,
                    body: {
                        index: {
                            number_of_shards: this.shards,
                            number_of_replicas: this.replicas
                        },
                        properties: {
                            ipv4_src_addr: {
                                type: 'ip',
                                index: 'not_analyzed'
                            },
                            ipv4_dst_addr: {
                                type: 'ip',
                                index: 'not_analyzed'
                            },
                            ipv4_next_hop: {
                                type: 'ip',
                                index: 'not_analyzed'
                            },
                            input_snmp: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            output_snmp: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            in_pkts: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            in_bytes: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            first_switched: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            last_switched: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            ipv4_src_port: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            ipv4_dst_port: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            tcp_flags: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            protocol: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            src_tos: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            in_as: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            out_as: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            src_mask: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            dst_mask: {
                                type: 'number',
                                index: 'not_analyzed'
                            },
                            timestamp: {
                                type: 'date',
                                index: 'not_analyzed'
                            },
                        }
                    }
                },
                // istanbul ignore next
                function(error, response, status) {
                    if (error) {
                        this.log.info(error + ' ' + status + ' ' + response);
                        process.exit(1);
                    }

                    if (typeof(callback) === 'function') {
                        callback();
                    }
                });
        }
    }.bind(this));
};


// Store the actual flow
NetFlowStorage.prototype.storeFlow = function storeFlow(flow) {
    flow.timestamp = Date.now();

    this.client.index({
        index: this.index_name,
        type: 'raw_flow',
        body: {
            ipv4_src_addr: inet.aton(flow.ipv4_src_addr),
            ipv4_dst_addr: inet.aton(flow.ipv4_dst_addr),
            ipv4_next_hop: inet.aton(flow.ipv4_next_hop),
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
    });
};


module.exports = NetFlowStorage;