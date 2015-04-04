var shopping = angular.module('shopping');

shopping.controller('logout',['authService',
    function(authService) {
        authService.logout();
    }
]);

shopping.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/logout', {
        templateUrl: 'authentication/logout/logout.html',
        controller: 'logout'
    });
}]);
