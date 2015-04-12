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
                articleInStore = store.findByValue("name", article.name)[0];
                if(!articleInStore.length){
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
                var articlesWithSameName = store.findByValue("name", article.name);
                if( articlesWithSameName.length > 1){
                    var alreadyExistingArticle = $filter('findByValueInverse')(store.articles, "id", article.id)[0];
                    RestCommunicator.fetchElement(Article,article)
                        .then(function(fetched){
                              article.name = fetched.fetchedElement.name;
                        });
                    return RestCommunicator.fetchElement(Article, alreadyExistingArticle)
                        .then(function(fetched){
                            return fetched.fetchedElement;
                        });
                }
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