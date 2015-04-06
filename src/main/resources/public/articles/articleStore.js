var shopping = angular.module('shopping');
shopping.factory('articleStore', ['$http' , '$q', '$filter', function($http, $q, $filter){
    var ARTICLE_ENDPOINT = "/api/articles/";
    var store = {
        articles : [],
        post: function (article) {
            var originalItems = store.articles.slice(0);

            return $http.post(ARTICLE_ENDPOINT, article)
                .then(function success(resp) {
                    article.id = resp.data.id;
                    store.articles.push(article);
                    return resp.headers('Location');
                }, function error() {
                    angular.copy(originalItems, store.articles);
                    return;
                });
        },
        fetch: function () {
            var deferred = $q.defer();
            $http.get(ARTICLE_ENDPOINT)
                .then(function (resp) {
                    if(resp.data._embedded) {
                        angular.copy(resp.data._embedded.articles, store.articles);
                    }
                    deferred.resolve(store.articles);
                });
            return deferred.promise;
        },
        findByName: function (name) {
            return $filter('findByName')(store.articles, name);
        },
        delete: function (article) {
            var originalArticles = store.articles.slice(0);

            store.articles.splice(store.articles.indexOf(article), 1);

            return $http.delete(ARTICLE_ENDPOINT + article.id)
                .then(function success() {
                    return store.articles;
                }, function error() {
                    angular.copy(originalArticles, store.articles);
                    return originalArticles;
                });
        }
    }
    store.fetch();
    return store;
}])