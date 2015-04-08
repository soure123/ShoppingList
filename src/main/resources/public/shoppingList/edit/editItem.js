var shopping = angular.module('shopping');

shopping.controller('editItem', ['$scope', '$modalInstance', 'item',
    function($scope, $modalInstance, item) {
        $scope.item = item;

        $scope.ok = function () {
            $modalInstance.close(item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);