var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location',
    function ($rootScope, $scope, $location) {
        $scope.lastPath = "";

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $rootScope.$on('$routeChangeStart', function () {
            if (!$scope.isActive('/login') && !$scope.isActive('/logout') && !$rootScope.authenticated) {
                $scope.lastPath = $location.path();
                $location.path('/login');
            }
        })
    }
]);