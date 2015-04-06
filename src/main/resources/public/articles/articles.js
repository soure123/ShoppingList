var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/articles/articles.html',
        controller: 'articles'
    };
    $routeProvider
        .when('/artikel', routeConfig);
}])

shopping.controller('articles', ['$scope',
    function($scope) {
    }
]);