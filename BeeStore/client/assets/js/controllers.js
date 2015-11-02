angular.module('controllers', [])

    .controller('MainCtrl', function ($scope, $state, __LoadCategories) {
        var categories = [9, 8, 21, 2, 223, 76, 81]; // approved categories ids
        __LoadCategories(categories);

        $scope.openCategory = function (arg) {
            window.subCategoryId = arg.id;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope) {
        $scope.subCategories = [];
        $rootScope.categories.sub.forEach(function (item, i, arr) {
            if (item.parent == window.subCategoryId) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false;
        })
    })
