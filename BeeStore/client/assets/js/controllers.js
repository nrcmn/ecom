angular.module('controllers', [])
    .controller('MainCtrl', function ($scope, $state, __LoadCategories) {
        var categories = [9, 8, 21, 2, 223, 76, 81]; // approved categories ids
        __LoadCategories(categories);

        $scope.openCategory = function (arg) {
            window.subCategoryId = arg.id;
            $state.go('categories');
        }
    })

    .controller('SubCategoryCtrl', function ($scope, $rootScope, $state, __LoadProducts, __LoadFilters) {
        $scope.subCategories = [];
        $rootScope.categories.sub.forEach(function (item, i, arr) {
            if (item.parent == window.subCategoryId) {
                $scope.subCategories.push(item);
            }

            ($scope.subCategories.length <= 3) ? $scope.showLeader = true : $scope.showLeader = false;
        })

        $scope.openSubCategory = function (subCategory) {
            __LoadProducts(subCategory, 15, 1, 'weight');
            __LoadFilters(subCategory);

            $state.go('products');
        }
    })

    .controller('ProductListCtrl', function ($scope, $rootScope) {
        $rootScope.productsList = undefined;
    })

    .controller('FilterCtrl', function ($scope, $rootScope) {
        $rootScope.checkFilter = function (index) {
            console.log(index);
            $rootScope.filterInd = index;
            // $rootScope.filterValues = filter;
        }
    })
