/*jslint node: true */
'use strict';


function NetFlowStorage(elasticsearch) {
    this.host = 'localhost:9200';
    this.shards = '4';
    this.replicas = '0';
    this.index_name = 'flow_track2';
    this.client = null;
    this.es = elasticsearch;

}

// setup our index
NetFlowStorage.prototype.createIndex = function createIndex() {

    this.connect();

    this.client.indices.exists({
        index: 'flow_track2'

    }, function(error, exists) {

        if (exists === true) {
            console.log('index already exists, not creating again');
        } else {
            console.log('creating index');

            this.client.indices.create({
                    index: 'flow_track2',
                    body: {
                        index: {
                            number_of_shards: this.shards,
                            number_of_replicas: this.replicas
                        }
                    }
                },
                // istanbul ignore next
                function(error, response, status) {
                    if (error) {
                        console.log(error + ' ' + status + ' ' + response);
                        process.exit(1);
                    }

                });
        }
    }.bind(this));
};


// Store the actual flow
NetFlowStorage.prototype.storeFlow = function storeFlow(flow) {
    flow.timestamp = Date.now();

    this.connect();

    this.client.index({
        index: 'flow_track2',
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
    });
};


NetFlowStorage.prototype.connect = function connect() {

    if (this.client === null) {

        this.client = new this.es.Client({
            host: this.host
        });
    }
    return this.client;
};

module.exports = NetFlowStorage;