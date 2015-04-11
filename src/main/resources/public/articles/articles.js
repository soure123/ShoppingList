var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/articles/articles.html',
        controller: 'articles'
    };
    $routeProvider
        .when('/artikel', routeConfig);
}])

shopping.controller('articles', ['$scope', 'articleStore',
    function($scope, articleStore) {
        var articles = $scope.articles = articleStore.articles;

        $scope.removeArticle = function (article) {
            articleStore.remove(article, true);
        };
    }
]);