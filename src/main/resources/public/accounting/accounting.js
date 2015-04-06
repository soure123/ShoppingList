var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/accounting/accounting.html',
        controller: 'accounting'
    };
    $routeProvider
        .when('/abrechnung', routeConfig);
}])

shopping.controller('accounting', ['$scope',
    function($scope) {
    }
]);