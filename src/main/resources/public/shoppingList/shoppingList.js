var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/shoppingList/shoppingList.html',
        controller: 'shoppingList'
    };
    $routeProvider
        .when('/einkaufsliste', routeConfig)
        .when('/einkaufsliste/:status', routeConfig);
}])

shopping.controller('shoppingList', ['$scope', 'itemStore', '$routeParams', '$filter', '$modal',
    function($scope, itemStore, $routeParams, $filter, $modal){
        'use strict';

        var initNewItem = function(){
            return {
                name : '',
                count : 1
            };
        }
        $scope.originalItem = null;
        $scope.newItem = initNewItem();


        var items = $scope.items = itemStore.items;

        var open = function (size, item) {

            var modalInstance = $modal.open({
                templateUrl: 'shoppingList/edit/editItem.html',
                controller: 'editItem',
                size: size,
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (item) {
                saveEdits(item);
            }, function () {
                revertEdits(item);
            });
        };

        $scope.$watch('items', function () {
            $scope.allChecked = !$filter('filter')(items, { bought: false }).length;
        }, true);

        $scope.$on('$routeChangeSuccess', function () {
            var status = $scope.status = $routeParams.status || '';

            $scope.statusFilter = (status === 'verbleibend') ?
            { bought: false } : (status === 'gekauft') ?
            { bought: true } : null;
        });

        $scope.addItem = function additem(){
            var newItem = {
                article : {
                    name: $scope.newItem.name.trim()
                },
                number: $scope.newItem.count,
                bought : false
            }

            if(!newItem.article.name){
                return;
            }

            $scope.saving = true;

            itemStore.insert(newItem)
                .then(function(){
                    $scope.newItem = initNewItem();
                })
                .finally(function(){
                    $scope.saving = false;
                })
        }

        $scope.removeItem = function (item) {
            itemStore.delete(item);
        };

        $scope.startEditing = function(item){
            open('lg', item);
            $scope.originalItem = {};
            angular.copy(item, $scope.originalItem);
        }

        var revertEdits = function(item){
            item.article.name = $scope.originalItem.article.name;
            item.number = $scope.originalItem.number;
        }

        var saveEdits = function (item) {

            if (item.article.name === $scope.originalItem.article.name && item.number === $scope.originalItem.number) {
                item.editing = false;
                return;
            }

            itemStore[item.article.name ? 'put' : 'delete'](item)
                .then(function success() {}, function error() {
                    revertEdits(item);
                });
        };

        $scope.toggleBought = function (item, bought) {
            if (angular.isDefined(bought)) {
                item.bought = bought;
            }else{
                item.bought = !item.bought;
            }
            itemStore.put(item)
                .then(function success() {}, function error() {
                    item.bought = !item.bought;
                });
        };

        $scope.markAll = function(bought){
            items.forEach(function (item) {
                if (item.bought !== bought) {
                    $scope.toggleBought(item, bought);
                }
            });
        }
    }
]);