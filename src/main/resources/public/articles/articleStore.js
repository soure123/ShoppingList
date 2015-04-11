var shopping = angular.module('shopping');
shopping.factory('articleStore', ['HALResource', '$resource' , '$q', '$filter',
    function(HALResource, $resource, $q, $filter){
        var ARTICLE_ENDPOINT = "/api/articles/";

        var methods = {
            'update': { method:'PUT' },
            'delete': { method: 'DELETE'}
        };

        var Article = $resource(ARTICLE_ENDPOINT + "/:id", null, methods);

        var post = function (article) {
            return Article.save(article);
        };

        var deleteArticle = function (article) {
            if(article.id) {
                return Article.delete({id: article.id}, article).$promise;
            }
        };

        var put = function (article){
            if(article.id){
                return Article.update({id:article.id}, article);
            }
        };

        var deleteRemovedArticles = function(){
            var promises = [];
            for(var i = 0 ; i < removedArticles.length; i++){
                var promise = deleteArticle(removedArticles[i]);
                if(promise){
                    promises.push(promise);
                }
            }
            return waitForAllPromises(promises, 0);
            removedArticles = [];
        };

        var waitForAllPromises = function(promises, index){
            var deferred = $q.defer();
            if(index < promises.length){
                promises[index].then(function(){
                    index++;
                    waitForAllPromises(promises, index);
                })
            }else{
                deferred.resolve();
            }
            return deferred.promise;
        }

        var removedArticles = [];

        var store = {
            articles : [],
            add: function(article, persist) {
                var existingArticle = $filter('findByValue')(store.articles, "name", article.name);
                var deferred = $q.defer();
                if(!existingArticle){
                    if(persist){
                        return post(article).$promise
                            .then(function(value) {
                                angular.copy(value,article);
                                store.articles.push(article);
                                return article;
                            });
                    }else{
                        store.articles.push(article);
                    }
                }else{
                    deferred.resolve(existingArticle);
                }
                return deferred.promise;
            },
            remove : function(article, persist){
                var index = store.articles.indexOf(article);
                if(index > -1){
                    store.articles.splice(index, 1);
                    if(persist){
                        deleteArticle(article);
                    }else{
                        removedArticles.push(article);
                    }
                }
            },
            update:function(article, persist){
                if(persist){
                    return put(article).$promise;
                }
            },
            findByValue: function (key, value) {
                return $filter('findByValue')(store.articles, key, value);
            },
            synch : function () {

                deleteRemovedArticles().then(function(){
                    Article.get().$promise
                        .then(function(response){
                            var newArticles = HALResource.getList(response);
                            for(var i = 0; i < store.articles.length; i++){
                                if(store.articles[i].id){
                                    var newArticle = $filter('findByValue')(newArticles, "id", store.articles[i].id)
                                    //remove if doesn't exist anymore
                                    if(!newArticle){
                                        store.remove(article);
                                    }
                                    //update if modified
                                    else if (store.articles[i] != newArticle){
                                        put(store.articles[i]);
                                    }
                                }else{
                                    //create new
                                    post(store.articles[i])
                                }
                            }
                            for(var i = 0; i < newArticles.length; i++){
                                var oldArticle = $filter('findByValue')(store.articles, "id", newArticles[i].id)
                                if(!oldArticle){
                                    //add new
                                    store.add(newArticles[i]);
                                }
                            }
                        });
                });


            }
        }
        store.synch();
        return store;
    }
])