/* jshint unused: false, expr: true*/
'use strict';

var NetFlowStorage = require('../../lib/NetFlowStorage');
var GetLogger = require('../../lib/GetLogger');
var logger = new GetLogger(process.env.NODE_ENV);
var config = require('config');

var es = require('elasticsearch');
var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);



describe('NetFlowStorage', function() {

    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });


    describe('constructor', function() {

        it('should be an instance of NetFlowStorage', function() {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.be.instanceof(NetFlowStorage);
        });

        it('should have a host', function() {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('host');
        });

        it('should have shards', function() {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('shards');
        });

        it('should have a replica', function() {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('replicas');

        });

        it('should have an index name', function() {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('index_name');
        });

        // TOOD: Add UT to test that we correctly call connect

    });

    describe('createIndex', function() {
        it('creates an index if one does not exist', function() {


            var nfStore = new NetFlowStorage(es, logger, config);

            var myCreateSpy = sandbox.spy();

            nfStore.client = {
                indices: {
                    exists: function(index_name, cb) {
                        cb(null, false);
                    },
                    create: myCreateSpy
                }
            };

            nfStore.createIndex();

            expect(myCreateSpy).to.be.calledOnce;
        });

        it('does not create an index if one exists', function() {


            var nfStore = new NetFlowStorage(es, logger, config);
            var myCreateSpy = sandbox.spy();

            nfStore.client = {
                indices: {
                    exists: function(index_name, cb) {
                        cb(null, true);
                    },
                    create: myCreateSpy
                }
            };

            nfStore.createIndex();

            expect(myCreateSpy).to.not.be.called;
        });
    });

    describe('storeFlow', function() {
        it('should correctly store the flow', function() {


            var nfStore = new NetFlowStorage(es, logger, config);


            // Set the date to a fixed value so we can check it in the save.
            var clock = sinon.useFakeTimers(Date.now() - 10000000);
            var test_time = Date.now();
            var index;


            var sample_flow = {
                ipv4_src_addr: '1.1.1.1', // 16843009
                ipv4_dst_addr: '2.2.2.2', // 33686018
                ipv4_next_hop: '3.3.3.3', // 50529027
                input_snmp: 1,
                output_snmp: 0,
                in_pkts: 29,
                in_bytes: 4381,
                first_switched: 598956992,
                last_switched: 598958053,
                ipv4_src_port: 22,
                ipv4_dst_port: 37402,
                tcp_flags: 27,
                protocol: 6,
                src_tos: 0,
                in_as: 0,
                out_as: 0,
                src_mask: 0,
                dst_mask: 0
            };




            // Setup our mock
            var stub = sandbox.stub(es, 'Client', function() {});
            nfStore.client = new es.Client();
            nfStore.client.index = function() {};
            var myIndexSpy = sandbox.spy(nfStore.client, 'index');


            nfStore.storeFlow(sample_flow);

            var store_compare = {
                index: 'flow_track2',
                type: 'raw_flow',
                body: sample_flow
            };

            // Set our timestamp and converted ip addresses
            store_compare.body.timestamp = test_time;
            store_compare.body.ipv4_src_addr = 16843009;
            store_compare.body.ipv4_dst_addr = 33686018;
            store_compare.body.ipv4_next_hop = 50529027;


            expect(myIndexSpy).to.be.calledWith(store_compare);
            clock.restore();
        });

    });

});