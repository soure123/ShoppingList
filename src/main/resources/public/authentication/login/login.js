var shopping = angular.module('shopping');

shopping.controller('login',['$rootScope', '$scope', '$location', 'authService',
    function ($rootScope, $scope, $location, authService) {
        $scope.credentials = {};

        $scope.login = function () {
            authService.authenticate($scope.credentials, function (username) {
                if($rootScope.authenticated){
                    $rootScope.user = username;
                    $location.path($scope.$parent.lastPath);
                }else{
                    $scope.error = true;
                }
            })
        };

        var redirectIfLoggedIn = function (){
            if($rootScope.authenticated){
                $location.path($scope.$parent.lastPath);
            }
        }

        redirectIfLoggedIn();
    }
]);

shopping.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'authentication/login/login.html',
        controller: 'login'
    });
}]);
