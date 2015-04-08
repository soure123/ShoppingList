var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location', 'authService', '$route',
    function ($rootScope, $scope, $location, authService, $route) {
        $scope.lastPath = "";
        $scope.navCollapsed = true;

        $scope.isActive = function (viewLocation) {
            viewLocation = viewLocation.split('/');
            var location = $location.path().split('/');
            for(var i = 0; i < viewLocation.length; i++){
                if(viewLocation[i] != location[i]){
                    return false;
                }
            }
            return true;
        };

        $scope.toggleNavCollapsed = function (){
            $scope.navCollapsed = ! $scope.navCollapsed;
        }

        var urlMatchesPath = function(url, path){
            return url && url.$$route && url.$$route.originalPath == path;
        };

        var isFreeRoute = function (url) {
            return urlMatchesPath(url, '/login') || urlMatchesPath(url, '/logout');
        }

        var redirectToLoginIfNotFreeRotue = function(newUrl) {
            if (!isFreeRoute(newUrl)) {
                $scope.lastPath = newUrl.$$route.originalPath
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

        var stopCalling = $rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {
            if($rootScope.authenticated){
                if(urlMatchesPath(newUrl, '/login')){
                    $location.path( oldUrl && oldUrl.$$route ? oldUrl.$$route.originalPath : '/');
                }
            }else{
                if(!isFreeRoute(newUrl)){
                    event.preventDefault();
                    stopCalling();
                }
                redirectToLoginIfAuthenticationRequired(newUrl);
            }
        })

        $rootScope.$on('$routeChangeSuccess', function () {
            $scope.navCollapsed = true;
        })
    }
]);