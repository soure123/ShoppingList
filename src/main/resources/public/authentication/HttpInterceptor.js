var shopping = angular.module('shopping');

shopping.service('MyHttpInterceptor',['$location', '$q', '$cookies', function ($location ,$q, $cookies) {
    return {
        responseError: function(rejection) {
            if(rejection.status == 401 || rejection.status == 403 || rejection.status == 0) {
                $cookies.remove('JSESSIONID');
                $cookies.remove('XSRF-TOKEN');
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
}]);