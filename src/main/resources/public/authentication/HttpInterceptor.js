var shopping = angular.module('shopping');

shopping.service('MyHttpInterceptor',['$location', '$q', '$cookies', function ($location ,$q, $cookies) {
    return {
        responseError: function(rejection) {
            if(rejection.status == 401 || rejection.status == 403 || rejection.status == 0) {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
}]);