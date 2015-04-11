var shopping = angular.module('shopping');

shopping.factory('itemStore', ['$filter', '$resource', '$q', '$http', 'articleStore', 'HALResource',
    function ($filter, $resource, $q, $http, articleStore, HALResource) {
        'use strict';

        var deleteItem = function (item) {
            if(item.id) {
                return Item.delete({id: item.id}, item).$promise;
            }
        };

        var deleteRemovedItems = function(){
            var promises = [];
            for(var i = 0 ; i < removedItems.length; i++){
                var promise = deleteItem(removedItems[i]);
                if(promise){
                    promises.push(promise);
                }
            }
            return waitForAllPromises(promises, 0);
            removedItems = [];
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
        };

        var post = function(item){
            return Item.save(item).$promise
                .then(function(value){
                    var embeddedArticle = item.embeddedArticle;
                    angular.copy(value, item);
                    item.embeddedArticle = embeddedArticle;
                });
        }

        var put = function (item){
            if(item.id){
                return Item.update({id:item.id}, item);
            }
        };

        var store = {
            items: [],
            fetch : function(resource, list){
                list.splice(0,lists.length);
                return resource.get().$promise
                    .then(function(response){
                        list = HALResource.getList(response);
                    });
            },
           
            },
            add: function (item, persist) {
                if(item.embeddedArticle){
                    return articleStore.add(item.embeddedArticle, true)
                        .then(function(article){
                            item.article = article._links.self.href;
                            item.embeddedArticle = article;
                            store.items.push(item);
                            if (persist) {
                                return post(item).$promise;
                            }
                        })
                }else{
                    item.embeddedArticle = ItemArtikel.get({id:item.id});
                    item.embeddedArticle.$promise.then(function(){
                        store.items.push(item);
                    });
                }

            },
            update:function(item, persist){
                if(item.embeddedArticle && item._links.article){
                    return articleStore.update(item.embeddedArticle, true)
                        .then(function(article) {
                            item.article = article._links.self.href;
                            if(persist) {
                                return put(item).$promise;
                            }
                        });
                }
            },
            remove: function(item, persist){
                var index = store.items.indexOf(item);
                if(index > -1){
                    store.items.splice(index, 1);
                    if(persist){
                        deleteItem(item);
                    }else {
                        removedItems.push(item);
                    }
                }
            },
            findByValue: function (key, value) {
                return $filter('findByValue')(store.items, key, value);
            }
        };
        store.synch();
        return store;
    }
]);