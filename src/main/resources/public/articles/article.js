var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/articles/articles.html',
        controller: 'article'
    };
    $routeProvider
        .when('/artikel', routeConfig);
}])

shopping.controller('article', ['$scope',
    function($scope) {
    }
]);