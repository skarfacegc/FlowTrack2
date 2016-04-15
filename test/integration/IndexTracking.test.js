'use strict';

var IndexTracking = require('../../lib/model/IndexTracking');
var NetFlowStorage = require('../../lib/model/NetFlowStorage');
var GetLogger = require('../../lib/util/GetLogger');

var logger = new GetLogger('quiet');
var config = require('config');
var moment = require('moment');
var es = require('elasticsearch');
var chaiAsPromised = require('chai-as-promised');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var moment = require('moment');
chai.use(chaiAsPromised);
chai.use(sinonChai);




describe('Integration Tests', function () {
    describe('IndexTracking', function () {
        // the 5 here is from mocha-retry  retry this test 2x before
        // giving up.  Should smooth out some of the issues with travis
        // dealing with timing on ES is painful:
        it(5, 'should delete indicies', function (done) {
            this.timeout(5000);  // set a longer timeout for mocha

            var nfStore = new NetFlowStorage(es, logger, config);
            var indexTrack = new IndexTracking(es, logger, config);
            var momentObj = moment();
            var timestamps = [];
            var testList = [];

            var callbackSpy = sinon.spy();

            // Build our values to test and check
            for (var i = 0 ; i < 3 ; i++) {
                timestamps.push(moment(momentObj)
                    .startOf('day')
                    .subtract(config.get('Application.retention_days') * i, 'd')
                    .valueOf());

                // Build our test list from every value but the last
                // which is the one that should be deleted
                if (i !== 2) {
                    testList.push(config.get('Application.index_name') +
                        '.' + moment(timestamps[i]).format('MM-DD-YYYY'));
                }
            }

            // Store the flows and set the clock prior to each store
            timestamps.forEach(function (currentValue, index, array) {
                var clock = sinon.useFakeTimers(currentValue);
                nfStore.storeFlow(getFlow());
                clock.restore();
            });

            // pause for a bit to let the DB catch up
            setTimeout(function () {
                indexTrack.getExpiredIndices(function (indexList) {
                    indexTrack.deleteIndices(indexList, function () {
                        setTimeout(function (indexList) {
                            indexTrack.getIndexList(function (indexList) {
                                try {
                                    expect(indexList.sort()).to.deep.equal(testList.sort());
                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });
                        }, 1500); // let the database calm down
                    });
                });
            }, 1500); // let the database calm down
        });
    });
});


var getFlow = function () {
    return {
        ipv4_src_addr: '1.1.1.1', // 16843009
        ipv4_dst_addr: '2.2.2.2', // 33686018
        ipv4_next_hop: '3.3.3.3', // 50529027
        input_snmp: 1,
        output_snmp: 0,
        in_pkts: 29,
        in_bytes: 5000,
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
};
