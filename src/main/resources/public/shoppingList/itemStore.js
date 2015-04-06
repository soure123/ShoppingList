var shopping = angular.module('shopping');

shopping.factory('itemStore', ['$http', 'articleStore',
    function($http, articleStore) {
        'use strict';
        var ITEM_ENDPOINT = '/api/shoppingItems/';

        var postItem = function(item, articleLocation){
            var postItem = {};
            angular.copy(item, postItem);
            postItem.article = articleLocation;
            $http.post(ITEM_ENDPOINT, postItem)
                .then(function (resp) {
                    item.id = resp.data.id;
                    store.items.push(item);
                    return store.items;
                });
        }

        var putItem = function(item, articleLocation) {
            var originalItems = store.items.slice(0);
            var copiedItem = {};
            angular.copy(item, copiedItem);
            copiedItem.article = articleLocation;
            return $http.put(ITEM_ENDPOINT + copiedItem.id, copiedItem)
                .then(function success() {
                    return store.items;
                }, function error() {
                    angular.copy(originalItems, store.items);
                    return originalItems;
                });
        }


        var store = {
            items:[],
            delete: function (item) {
                var originalItems = store.items.slice(0);

                store.items.splice(store.items.indexOf(item), 1);

                return $http.delete(ITEM_ENDPOINT + item.id)
                    .then(function success() {
                        return store.items;
                    }, function error() {
                        angular.copy(originalItems, store.items);
                        return originalItems;
                    });
            },

            fetch: function () {
                return $http.get(ITEM_ENDPOINT)
                    .then(function (resp) {
                        if(resp.data._embedded) {
                            angular.copy(resp.data._embedded.shoppingItems, store.items);
                        }
                        for(var i = 0; i < store.items.length; i++){
                            $http.get(store.items[i]._links.article.href).success((function(index){
                                return function(data){
                                    var article = {
                                        name: data.name,
                                        price: data.price
                                    };
                                    store.items[index].article = article
                                }
                            })(i));
                        }
                        return store.items;
                    });
            },

            insert: function (item) {
                return articleStore.fetch().then(function(articles){
                    var article = articleStore.findByName(item.article.name);
                    if(!article){
                        articleStore.post(item.article).then(function (location) {
                            postItem(item, location);
                        });
                        return store.items
                    }else{
                        postItem(item, article._links.self.href);
                    }
                }, function(){
                    return store.items;
                })
            },
            put: function (item) {
                return articleStore.fetch().then(function(articles) {
                    var article = articleStore.findByName(item.article.name);
                    if(!article){
                        articleStore.post(item.article).then(function (location) {
                            putItem(item, location);
                        });
                    }else{
                        putItem(item, article._links.self.href);
                    }
                });
            }
        };
        store.fetch();
        return store;
    }
]);