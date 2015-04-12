var shopping = angular.module('shopping');

shopping.factory('itemStore', ['RestCommunicator', '$filter', '$resource', 'articleStore',
    function (RestCommunicator, $filter, $resource, articleStore) {
        'use strict';
        var ITEM_ENDPOINT = '/api/shoppingItems/';

        var methods = {
            'update': { method:'PUT' },
            'delete': { method: 'DELETE'}
        };


        var Item = $resource(ITEM_ENDPOINT + "/:id", null, methods);

        var ItemArticle = $resource(ITEM_ENDPOINT + "/:id/article", null, methods);

        var store = {
            items: [],
            fetch : function(){
                RestCommunicator.fetchList(Item, store.items).then(function(){
                    for(var i = 0; i < store.items.length; i++){
                        RestCommunicator.fetchElement(ItemArticle, store.items[i])
                            .then(function(response){
                                response.element.embeddedArticle = response.fetchedElement;
                                response.element.article = response.fetchedElement._links.self.href;
                            });
                    }
                })
            },
            add: function (item) {
                return articleStore.add(item.embeddedArticle)
                    .then(function(article){
                        item.article = article._links.self.href;
                        return RestCommunicator.add(Item, item, store.items)
                            .then(function(value){
                                item = value;
                                item.embeddedArticle = article;
                                item.article = article._links.self.href;
                                return item;
                            });
                    });
            },
            update:function(item){
                return articleStore.update(item.embeddedArticle).then(function(){
                    return RestCommunicator.update(Item, item);
                });
            },
            remove: function(item){
                return RestCommunicator.remove(Item, item, store.items);
            },
            findByValue: function (key, value) {
                return $filter('findByValue')(store.items, key, value);
            }
        };
        store.fetch();
        return store;
    }
]);