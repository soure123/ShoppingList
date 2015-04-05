var shopping = angular.module('shopping');

shopping.controller('navigation', ['$rootScope', '$scope', '$location',
    function ($rootScope, $scope, $location) {
        $scope.lastPath = "";

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
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
                if(newUrl.$$route.originalPath == '/login'){
                    $location.path( oldUrl.$$route.originalPath == '/logout' ? '/' : oldUrl.$$route.originalPath);
                }
            }else{
                redirectToLoginIfNotFreePage(newUrl, oldUrl)
            }
        })

        $scope.$on('$routeChangeSuccess', function () {
            $scope.navCollapsed = true;
        })

        $scope.showLoginNav = function(){
            return !$rootScope.authenticated && !$scope.isActive('/login')
        }

        $scope.showLogoutNav = function(){
            return $rootScope.authenticated;
        }

        $scope.hideLoginLogoutNav = function(){
            return !$rootScope.authenticated && $scope.isActive('/login')
        }

        $scope.linkTo = function(view){
            $scope.navCollapsed = true;
            if(!angular.equals($location.path(), view)){
                $location.path(view); // path not hash
            }
        };
    }
]);