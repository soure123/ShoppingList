var shopping = angular.module('shopping', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngCookies']);

shopping.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider.otherwise({redirectTo: '/einkaufsliste'});
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('MyHttpInterceptor');
    }
]);

shopping.run(['$rootScope',
    function ($rootScope) {
        $rootScope.authenticated = false;
        $rootScope.user = "";
    }
])