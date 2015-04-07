var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location', '$route', '$routeParams',
    function ($rootScope, $scope, $location, $route, $routeParams) {
        $scope.lastPath = "";

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

        var redirectToLoginIfNotFreePage = function(newUrl, oldUrl) {
            if (newUrl.$$route && newUrl.$$route.originalPath != '/login' && newUrl.$$route.originalPath != '/logout') {
                if(oldUrl && oldUrl.$$route && oldUrl.$$route.originalPath != '/login' && oldUrl.$$route.originalPath != '/logout'){
                    $scope.lastPath = oldUrl.$$route.originalPath;
                }else if(!oldUrl){
                    $scope.lastPath = '/';
                }
                $location.path('/login');
            }
        }

        $rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {

            if($rootScope.authenticated){
                if(newUrl.$$route && newUrl.$$route.originalPath == '/login'){
                    $location.path( oldUrl.$$route.originalPath == '/logout' ? '/' : oldUrl.$$route.originalPath);
                }
            }else{
                redirectToLoginIfNotFreePage(newUrl, oldUrl)
            }
        })

        $scope.$on('$routeChangeSuccess', function () {
            $scope.navCollapsed = true;
        })

        $scope.toggleNavCollapsed = function (){
            $scope.navCollapsed = ! $scope.navCollapsed;
        }
    }
]);