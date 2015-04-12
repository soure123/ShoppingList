var shopping = angular.module('shopping');

shopping.factory('RestCommunicator', ['HALResource', '$q',
    function (HALResource, $q) {
        'use strict';

        var deleteElement = function (resource, element) {
            if(element.id) {
                return resource.delete({id: element.id}, element);
            }
        };

        var post = function(resource, element){
            return resource.save(element);
        }

        var put = function (resource, element){
            if(element.id){
                return resource.update({id:element.id}, element);
            }
        };

        var deferred = $q.defer();
        deferred.resolve();
        var defaultResolvedPromise = deferred.promise;


        var RestCommunicator = {
            fetchList : function(resource, list){
                return resource.get().$promise
                    .then(function(response){
                        list.splice(0,list.length);
                        list.push.apply(list, HALResource.getContent(response));
                    });
            },
            fetchElement : function(resource, element){
                if(element.id) {
                    return resource.get({id: element.id}).$promise
                        .then(function (value) {
                            return {element: element, fetchedElement: value};
                        })
                }
                return defaultResolvedPromise;
            },
            add: function (resource, element, list) {
                return post(resource, element).$promise.then(function(value){
                    list.push(value);
                    return value;
                });
            },
            update:function(resource, element){
                return put(resource, element).$promise;
            },
            remove: function(resource, element, list){
                var index = list.indexOf(element);
                if(index > -1){
                    list.splice(index, 1);
                    return deleteElement(resource, element).$promise;
                }
                return defaultResolvedPromise;
            }
        };

        return RestCommunicator;
    }
]);