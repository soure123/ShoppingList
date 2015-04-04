var shopping = angular.module('shopping', ['ngRoute', 'ngTouch', 'ui.bootstrap']);

shopping.config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
            $routeProvider.otherwise({redirectTo: '/'});
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.interceptors.push('MyHttpInterceptor');
        }
]);