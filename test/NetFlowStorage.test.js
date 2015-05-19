/* jshint unused: false, -W079: false */
/* Don't complain about unused or W079 squash the redef warnings on should */
'use strict';

var NetflowStorage = require('../lib/NetFlowStorage');
var should = require('chai').should();


describe('NetFlowStorage', function() {
    describe('constructor', function() {

        var nfStore = new NetflowStorage();

        it('should be an instance of NetFlowStorage', function() {
            nfStore.should.be.instanceof(NetflowStorage);
        });

    });

});