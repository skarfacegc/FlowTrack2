var app = angular.module('flowList', []);

app.controller('flowListCtrl', function($scope, $http) {
    $http.get('/json/rawFlowsForLast/5/minutes').
    success(function(data, status, headers, conrit) {
        $scope.flows = data;
    }).
    error(function(data, status, headers) {
        console.warn('doh');
    });

});