var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location', 'authService',
    function ($rootScope, $scope, $location, authService) {
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

        var redirectToLoginIfNotFreePage = function(newUrl, oldUrl) {
            if (!urlMatchesPath(newUrl, '/login') && !urlMatchesPath(newUrl, '/logout')) {
                if(oldUrl && !urlMatchesPath(oldUrl, '/login') && !urlMatchesPath(oldUrl, '/logout')){
                    $scope.lastPath = oldUrl.$$route.originalPath;
                }else if(!oldUrl){
                    $scope.lastPath = '/';
                }
                $location.path('/login');
            }
        };

        var redirectToLoginIfAuthenticationRequired = function(newUrl, oldUrl) {
            authService.isAuthenticated(function (username) {
                $rootScope.user = username;
                if (!$rootScope.authenticated) {
                    redirectToLoginIfNotFreePage(newUrl, oldUrl);
                }

            });
        };

        $scope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {
            if($rootScope.authenticated){
                if(urlMatchesPath(newUrl, '/login')){
                    $location.path( urlMatchesPath(oldUrl, '/logout') ? '/' : oldUrl.$$route.originalPath);
                }
            }else{
                redirectToLoginIfAuthenticationRequired(newUrl, oldUrl);
            }
        })

        $scope.$on('$routeChangeSuccess', function () {
            $scope.navCollapsed = true;
        })
    }
]);