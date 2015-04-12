var shopping = angular.module('shopping');
shopping.factory('articleStore', ['RestCommunicator', '$resource', '$filter', '$q',
    function(RestCommunicator, $resource, $filter, $q){
        var ARTICLE_ENDPOINT = "/api/articles/";

        var methods = {
            'update': { method:'PUT' },
            'delete': { method: 'DELETE'}
        };

        var Article = $resource(ARTICLE_ENDPOINT + "/:id", null, methods);

        var store = {
            articles : [],
            add: function(article) {
                articleInStore = store.findByValue("name", article.name);
                if(!articleInStore){
                    return RestCommunicator.add(Article, article, store.articles);
                }
                var deferred = $q.defer();
                deferred.resolve(articleInStore);
                return deferred.promise;
            },
            remove : function(article){
                return RestCommunicator.remove(Article, article, store.articles);
            },
            update:function(article){
                return RestCommunicator.update(Article, article);
            },
            findByValue: function (key, value) {
                return $filter('findByValue')(store.articles, key, value);
            },
            fetch : function(){
                return RestCommunicator.fetchList(Article, store.articles);
            }
        }
        store.fetch();
        return store;
    }
])