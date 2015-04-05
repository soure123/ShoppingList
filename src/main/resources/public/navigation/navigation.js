var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location',
    function ($rootScope, $scope, $location) {
        $scope.lastPath = "";

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        var redirectToLoginIfNotFreePage = function(newUrl, oldUrl) {
            if (newUrl.$$route.originalPath != '/login' && newUrl.$$route.originalPath != '/logout') {
                if(oldUrl){
                    $scope.lastPath = oldUrl.$$route.originalPath;
                }else{
                    $scope.lastPath = '/';
                }
                $location.path('/login');
            }
        }

        $rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {

            if($rootScope.authenticated){
                if(newUrl.$$route.originalPath == '/login'){
                    $location.path( oldUrl.$$route.originalPath == '/logout' ? '/' : oldUrl.$$route.originalPath);
                }
            }else{
                redirectToLoginIfNotFreePage(newUrl, oldUrl)
            }
        })
    }
]);