var shopping = angular.module('shopping');

shopping.service('MyHttpInterceptor',['$location', '$q', function ($location ,$q) {
    return {
        'responseError': function(rejection) {
            if(rejection.status == 401 || rejection.status == 0) {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
}]);