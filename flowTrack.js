var es = require("elasticsearch");
var cluster = require("cluster");
var netflow = require('node-netflowv9');
var numCPUs = require('os').cpus().length;



main();

function main() {

    // parent process
    if (cluster.isMaster) {
        createIndex();
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

    // Workers    
    } else {

        var client = new es.Client({
            host: 'localhost:9200'
        });



        netflow(function(flow) {

            console.log("%s\t flows", flow.flows.length);
            for (var i = 0; i < flow.flows.length; i++) {
                storeFlow(flow.flows[i], client);
            };

        }).listen(2055);
    }
}



// setup our index
function createIndex() {
    // Create our index if it's not already there
    var client = new es.Client({
        host: 'localhost:9200'
    });

    client.indices.exists({
        index: 'flow_track2'
    }, function(error, exists) {
        if (exists === true) {
            console.log("index already exists, not creating again");
            client.close();
        } else {
            console.log("creating index");

            client.indices.create({
                index: 'flow_track2',
                body: {
                    index: {
                        number_of_shards: 4,
                        number_of_replicas: 0
                    }
                }
            }, function(error, response, status) {
                if (error) {
                    console.log(error);
                }
                client.close();
                process.exit(1);
            });
        }
    });
}


function storeFlow(flow, client) {
    flow.timestamp = Date.now();

    client.index({
        index: 'flow_track2',
        type: 'raw_flow',
        body: {
            ipv4_src_addr  : flow.ipv4_src_addr,
            ipv4_dst_addr  : flow.ipv4_dst_addr,
            ipv4_next_hop  : flow.ipv4_next_hop,
            input_snmp     : flow.input_snmp,
            output_snmp    : flow.output_snmp,
            in_pkts        : flow.in_pkts,
            in_bytes       : flow.in_bytes,
            first_switched : flow.first_switched,
            last_switched  : flow.last_switched,
            ipv4_src_port  : flow.ipv4_src_port,
            ipv4_dst_port  : flow.ipv4_dst_port,
            tcp_flags      : flow.tcp_flags,
            protocol       : flow.protocol,
            src_tos        : flow.src_tos,
            in_as          : flow.in_as,
            out_as         : flow.out_as,
            src_mask       : flow.src_mask,
            dst_mask       : flow.dst_mask,
            timestamp      : flow.timestamp
        }
    });
}