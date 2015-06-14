'use strict';

function ftUtils() {}

// turn an integer into dotted quad!
ftUtils.inet_ntoa = function(ipInt) {

    var buffer = new ArrayBuffer(4);
    var uint8View = new Uint8Array(buffer);
    var uint32View = new Uint32Array(buffer);
    uint32View[0] = ipInt;
    var ipSegments = [];
    for (var i = 0; i < uint8View.length; i++) {
        ipSegments.push(uint8View[i]);
    }

    return ipSegments.join(".");

};