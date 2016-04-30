/* global angular, moment */

var app = angular.module('flowList', ['ui.grid']);

app.controller('flowListCtrl', function($scope, $http) {
  'use strict';
  $http.get('/json/rawFlowsForLast/5/minutes')
        .success(function(data) {
          var retList = [];

          data.forEach(function(element) {
            var flowRecord = {
              srcAddress: element._source.ipv4_src_addr,
              dstAddress: element._source.ipv4_dst_addr,
              Packets: element._source.in_pkts,
              Bytes: element._source.in_bytes,
              Time: moment(element._source.timestamp)
                .format('YYYY-MM-DD HH:mm:ss')
            };
            retList.push(flowRecord);
          });
          $scope.flows = retList;
        })
        .error(function() {
          console.warn('doh');
        });
});
