var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location', 'authService', '$route',
    function ($rootScope, $scope, $location, authService, $route) {
        $scope.lastPath = "";
        $scope.navCollapsed = true;

        $scope.isSubRouteOf = function (viewLocation) {
            viewLocation = viewLocation.split('/');
            var location = $location.path().split('/');
            for(var i = 0; i < viewLocation.length; i++){
                if(viewLocation[i] != location[i]){
                    return false;
                }
            }
            return true;
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation == $location.path();
        };

        $scope.toggleNavCollapsed = function (){
            $scope.navCollapsed = ! $scope.navCollapsed;
        };

        var urlIsDefined = function(url){
            return url && url.$$route;
        }

        var urlMatchesPath = function(url, path){
            return urlIsDefined(url) && url.$$route.originalPath == path;
        };

        var isFreeRoute = function (url) {
            return urlMatchesPath(url, '/login') || urlMatchesPath(url, '/logout');
        }

        var redirectToLoginIfNotFreeRotue = function(newUrl) {
            if (!isFreeRoute(newUrl)) {
                if(urlIsDefined(newUrl)){
                    $scope.lastPath = newUrl.$$route.originalPath;
                }
                $location.path('/login');
            }
        };

        var redirectToLoginIfAuthenticationRequired = function(newUrl) {
            authService.isAuthenticated(function (username) {
                $rootScope.user = username;
                if (!$rootScope.authenticated) {
                    redirectToLoginIfNotFreeRotue(newUrl);
                }else{
                    $route.reload();
                }
            });
        };

        $rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {
            if(!$rootScope.authenticated){
                if(!isFreeRoute(newUrl)){
                    event.preventDefault();
                }
                redirectToLoginIfAuthenticationRequired(newUrl);
            }
        })

        $rootScope.$on('$routeChangeSuccess', function () {
            $scope.navCollapsed = true;
        })
    }
]);