/* jshint unused: false, expr: true*/
'use strict';

var NetFlowStorage = require('../../lib/model/NetFlowStorage');
var IndexTracking = require('../../lib/model/IndexTracking');
var GetLogger = require('../../lib/util/GetLogger');
var logger = new GetLogger('quiet');
var config = require('config');

var es = require('elasticsearch');
var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);



describe('NetFlowStorage', function () {


    describe('constructor', function () {

        it('should be an instance of NetFlowStorage', function () {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.be.instanceof(NetFlowStorage);
        });

        it('should have a host', function () {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('host');
        });

        it('should have shards', function () {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('shards');
        });

        it('should have a replica', function () {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('replicas');

        });

        it('should have an index name', function () {

            var nfStore = new NetFlowStorage(es, logger, config);

            expect(nfStore).to.have.property('index_name');
        });

        // TOOD: Add UT to test that we correctly call connect

    });


    describe('createTemplate', function () {
        it('should call putTemplate correctly', function () {
            var nfStore = new NetFlowStorage(es, logger, config);
            var sandbox = sinon.sandbox.create();
            var templateStub = sandbox.stub(nfStore.client.indices, 'putTemplate').yields();
            var callbackSpy = sandbox.spy();

            nfStore.createTemplate(callbackSpy);

            expect(callbackSpy).to.be.calledOnce;

            sandbox.restore();
        });

        it('should handle errors correctly', function () {
            var nfStore = new NetFlowStorage(es, logger, config);
            var sandbox = sinon.sandbox.create();
            var templateStub = sandbox.stub(nfStore.client.indices, 'putTemplate')
              .yields('Test Error', 'response', 'status');
            var callbackSpy = sandbox.spy();

            expect(nfStore.createTemplate.bind(callbackSpy)).to.throw(Error);
            expect(callbackSpy).to.not.be.called;

            sandbox.restore();
        });
    });

    describe('refreshIndices', function () {
        it('should call client.refresh correctly', function () {
            var nfStore = new NetFlowStorage(es, logger, config);
            var indexName = config.get('Application.index_name') + '*';
            var sandbox = sinon.sandbox.create();
            var indicesStub = sandbox.stub(nfStore.client.indices, 'refresh');

            nfStore.refreshIndices();

            expect(indicesStub).to.be.calledWith({index: indexName});

            sandbox.restore();
        });
    });

    describe('storeFlow', function () {
        it('should correctly store the flow', function () {


            var nfStore = new NetFlowStorage(es, logger, config);
            var indexTracking = new IndexTracking(es,logger,config);
            var sandbox = sinon.sandbox.create();

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
            var stub = sandbox.stub(es, 'Client', function () {});
            nfStore.client = new es.Client();
            nfStore.client.index = function () {};
            var myIndexSpy = sandbox.spy(nfStore.client, 'index');


            nfStore.storeFlow(sample_flow);

            var store_compare = {
                index: indexTracking.generateIndexName(),
                type: 'raw_flow',
                body: sample_flow
            };

            // Set our timestamp and converted ip addresses
            store_compare.body.timestamp = test_time;


            expect(myIndexSpy).to.be.calledWith(store_compare);
            clock.restore();

            sandbox.restore();
        });

    });

    describe('waitForNewIndex', function () {
        it('should call cluster.health correctly', function () {
            var nfStore = new NetFlowStorage(es, logger, config);
            var sandbox = sinon.sandbox.create();

            var indexNamePattern = config.get('Application.index_name') + '*';


            var clusterHealthStub =
                sandbox.stub(nfStore.client.cluster, 'health')
                .yields('err', 'res', 'status');

            nfStore.waitForNewIndex();

            expect(clusterHealthStub).to.be.calledWith({
                waitForStatus: 'green',
                timeout: '30s',
                index: indexNamePattern
            });

            sandbox.restore();
        });

        it('should call the callback correctly', function () {
            var nfStore = new NetFlowStorage(es, logger, config);
            var sandbox = sinon.sandbox.create();

            var indexNamePattern = config.get('Application.index_name') + '*';
            var callbackSpy = sandbox.spy();
            var clusterHealthStub =
                sandbox.stub(nfStore.client.cluster, 'health')
                .yields('err', 'res', 'status');

            nfStore.waitForNewIndex(callbackSpy);

            expect(callbackSpy).to.be.calledWith('err', 'res', 'status');

            sandbox.restore();
        })
    });
});
