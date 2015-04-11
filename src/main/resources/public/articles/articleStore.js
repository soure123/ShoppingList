var shopping = angular.module('shopping');
shopping.factory('articleStore', ['$resource', '$http' , '$q', '$filter',
    function($resource, $http, $q, $filter){
        var ARTICLE_ENDPOINT = "/api/articles/";

        var Article = $resource(ARTICLE_ENDPOINT + "/:id");

        var store = {
            articles : [],
            get : function (){
                return articles;
            },
            getById : function(id){
                var elementInList = $filter('findByValue')(store.articles, "id",  value);
                if(!elementInList){
                    return Article.get({id: id});
                }
                return elementInList;
            },
            post: function (article) {
                return Article.save(article).$promise
                    .then(function(response){
                        angular.copy(response, article);
                        store.articles.push(article);
                        return article;
                    });
            },
            fetch: function () {
                articles = Article.get().$promise
                    .then(function(response){
                        if(response._embedded){
                            store.articles.push.apply(store.articles, response._embedded.articles);
                            return store.articles;
                        }
                    });
                return articles;
            },
            findByValue: function (key, value) {
                return $filter('findByValue')(store.articles, key, value);
            },
            delete: function (article) {
                var index = articles.indexOf(article);
                if(article.id){
                    article.$remove().$promise
                        .then(function(){

                        }, function(){
                            if(index > -1){
                                articles.push(article);
                            }
                        });
                }
                var index = articles.indexOf(article);
                if(index > -1){
                    articles.splice(index, 1)
                }
            }
        }
        store.fetch();
        return store;
    }
])