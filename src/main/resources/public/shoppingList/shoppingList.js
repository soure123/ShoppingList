var shopping = angular.module('shopping');

shopping.config(['$routeProvider', function($routeProvider){
    var routeConfig = {
        templateUrl: '/shoppingList/shoppingList.html',
        controller: 'shoppingList'
    };
    $routeProvider
        .when('/', routeConfig)
        .when('/:status', routeConfig);
}])

shopping.controller('shoppingList', ['$scope', 'itemStore', '$routeParams',
    function($scope, itemStore, $routeParams){
        'use strict';
        itemStore.fetch();

        $scope.originalItem = null;

        var items = $scope.items = itemStore.items;

        $scope.$on('$routeChangeSuccess', function () {
            var status = $scope.status = $routeParams.status || '';

            $scope.statusFilter = (status === 'verbleibend') ?
            { bought: false } : (status === 'gekauft') ?
            { bought: true } : null;
        });

        $scope.addItem = function additem(){
            var newItem = {
                article : {
                    name: $scope.newItem.trim()
                },
                number: 1,
                bought : false
            }

            if(!newItem.article.name){
                return;
            }

            $scope.saving = true;

            itemStore.insert(newItem)
                .then(function(){
                    $scope.newItem = '';
                })
                .finally(function(){
                    $scope.saving = false;
                })
        }

        $scope.removeItem = function (item) {
            itemStore.delete(item);
        };

        $scope.startEditing = function(item){
            item.editing = true;
            $scope.originalItem = {};
            angular.copy(item, $scope.originalItem);
        }
        $scope.saveEdits = function (item, event) {
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                item.editing = false;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                $scope.reverted = null;
                item.editing = false;
                return;
            }

            item.article.name = item.article.name.trim();

            if (item.article.name === $scope.originalItem.article.name) {
                item.editing = false;
                return;
            }

            itemStore[item.article.name ? 'put' : 'delete'](item)
                .then(function success() {}, function error() {
                    item.article.name = $scope.originalItem.article.name;
                })
                .finally(function () {
                    item.editing = false;
                });
        };

        $scope.toggleBought = function (item, bought) {
            if (angular.isDefined(bought)) {
                item.bought = bought;
            }
            itemStore.put(item)
                .then(function success() {}, function error() {
                    item.bought = !item.bought;
                });
        };
    }
]);